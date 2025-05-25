// src/api/forum/controller/index.js
const { ForumTopic, ForumMessage, User, Course } = require('../../../models');
const { Op } = require('sequelize');

// === Sujets du Forum ===
// @desc    Create a new forum topic
// @route   POST /api/forum/topics  OU POST /api/courses/:courseId/forum/topics
// @access  Private (Utilisateur authentifié)
exports.createForumTopic = async (req, res, next) => {
    const { titre } = req.body;
    const { courseId } = req.params; // Optionnel, si lié à un cours
    const utilisateur_id_createur = req.user.id;

    try {
        let topicData = { titre, utilisateur_id_createur };
        if (courseId) {
            const course = await Course.findByPk(courseId);
            if (!course) return res.status(404).json({ message: "Cours non trouvé pour lier le sujet."});
            // Optionnel: vérifier si l'user a accès au cours pour y poster (ex: est inscrit)
            topicData.cours_id = courseId;
        }
        const topic = await ForumTopic.create(topicData);
        res.status(201).json(topic);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all forum topics (avec filtres optionnels)
// @route   GET /api/forum/topics  OU GET /api/courses/:courseId/forum/topics
// @access  Public (ou privé si besoin de vérifier l'accès au cours)
exports.getAllForumTopics = async (req, res, next) => {
    const { courseId } = req.params;
    const { search, page = 1, limit = 10 } = req.query;
    const whereClause = {};
    const offset = (parseInt(page) - 1) * parseInt(limit);

    if (courseId) {
        whereClause.cours_id = courseId;
    } else {
        // Si pas de courseId, ne lister que les sujets généraux (cours_id IS NULL)
        // ou tous les sujets si c'est le comportement désiré
        // whereClause.cours_id = null; // Pour lister seulement les sujets généraux non liés à un cours
    }
    if (search) {
        whereClause.titre = { [Op.like]: `%${search}%` };
    }
    // TODO: Si courseId, vérifier les droits d'accès au cours si nécessaire

    try {
        const { count, rows: topics } = await ForumTopic.findAndCountAll({
            where: whereClause,
            include: [
                { model: User, as: 'creator', attributes: ['id', 'nom_utilisateur'] },
                { model: Course, as: 'course', attributes: ['id', 'titre'] } // si pertinent
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['dernier_message_date', 'DESC'], ['date_creation', 'DESC']]
        });
        res.json({
            topics,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalTopics: count
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single forum topic (avec ses messages)
// @route   GET /api/forum/topics/:topicId
// @access  Public (ou privé si besoin de vérifier l'accès au cours du sujet)
exports.getForumTopicById = async (req, res, next) => {
    const { topicId } = req.params;
    // const { page = 1, limit = 20 } = req.query; // Pour la pagination des messages
    // const offsetMessages = (parseInt(page) - 1) * parseInt(limit);

    try {
        const topic = await ForumTopic.findByPk(topicId, {
            include: [
                { model: User, as: 'creator', attributes: ['id', 'nom_utilisateur'] },
                { model: Course, as: 'course', attributes: ['id', 'titre'] },
                {
                    model: ForumMessage,
                    include: [{ model: User, as: 'author', attributes: ['id', 'nom_utilisateur'] }],
                    order: [['date_creation', 'ASC']], // Charger tous les messages pour l'instant
                    // limit: parseInt(limit),
                    // offset: offsetMessages
                }
            ]
        });
        if (!topic) return res.status(404).json({ message: "Sujet non trouvé." });
        // TODO: Vérifier droits d'accès au sujet si son cours est privé et l'user non inscrit
        res.json(topic);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a forum topic
// @route   DELETE /api/forum/topics/:topicId
// @access  Private (Créateur du sujet ou Admin)
exports.deleteForumTopic = async (req, res, next) => {
    try {
        const topic = await ForumTopic.findByPk(req.params.topicId);
        if (!topic) return res.status(404).json({ message: "Sujet non trouvé."});
        if (topic.utilisateur_id_createur !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Non autorisé à supprimer ce sujet." });
        }
        await topic.destroy(); // ON DELETE CASCADE s'occupera des messages
        res.json({ message: "Sujet supprimé." });
    } catch (error) {
        next(error);
    }
};

// === Messages du Forum ===
// @desc    Post a message to a forum topic
// @route   POST /api/forum/topics/:topicId/messages
// @access  Private (Utilisateur authentifié, ayant accès au sujet)
exports.postForumMessage = async (req, res, next) => {
    const { contenu_message, message_parent_id } = req.body;
    const { topicId } = req.params;
    const utilisateur_id_auteur = req.user.id;

    const t = await sequelize.transaction();
    try {
        const topic = await ForumTopic.findByPk(topicId, { transaction: t });
        if (!topic) {
            await t.rollback();
            return res.status(404).json({ message: "Sujet non trouvé." });
        }
        // TODO: Vérifier si l'utilisateur a le droit de poster dans ce sujet (accès au cours, etc.)

        if (message_parent_id) {
            const parentMessage = await ForumMessage.findOne({ where: {id: message_parent_id, sujet_id: topicId}, transaction: t});
            if(!parentMessage){
                await t.rollback();
                return res.status(400).json({ message: "Message parent non valide pour ce sujet." });
            }
        }

        const message = await ForumMessage.create({
            sujet_id: topicId,
            utilisateur_id_auteur,
            contenu_message,
            message_parent_id
        }, { transaction: t });

        // Mettre à jour dernier_message_date du sujet
        topic.dernier_message_date = new Date();
        await topic.save({ transaction: t });

        await t.commit();
        // Recharger le message avec l'auteur pour la réponse
        const fullMessage = await ForumMessage.findByPk(message.id, {
            include: [{model: User, as: 'author', attributes: ['id', 'nom_utilisateur']}]
        });
        res.status(201).json(fullMessage);
    } catch (error) {
        await t.rollback();
        next(error);
    }
};

// @desc    Update a forum message
// @route   PUT /api/forum/messages/:messageId
// @access  Private (Auteur du message ou Admin)
exports.updateForumMessage = async (req, res, next) => {
    const { contenu_message } = req.body;
    try {
        const message = await ForumMessage.findByPk(req.params.messageId);
        if (!message) return res.status(404).json({ message: "Message non trouvé." });
        if (message.utilisateur_id_auteur !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Non autorisé à modifier ce message." });
        }
        message.contenu_message = contenu_message;
        await message.save();
        res.json(message);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a forum message
// @route   DELETE /api/forum/messages/:messageId
// @access  Private (Auteur du message ou Admin)
exports.deleteForumMessage = async (req, res, next) => {
    try {
        const message = await ForumMessage.findByPk(req.params.messageId);
        if (!message) return res.status(404).json({ message: "Message non trouvé." });
        if (message.utilisateur_id_auteur !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Non autorisé à supprimer ce message." });
        }
        await message.destroy(); // ON DELETE CASCADE s'occupera des réponses
        res.json({ message: "Message supprimé." });
    } catch (error) {
        next(error);
    }
};