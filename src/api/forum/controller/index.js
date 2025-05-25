const ForumTopic = require('../../../models/ForumTopic');
const ForumMessage = require('../../../models/ForumMessage');

// Create a new forum topic
exports.createTopic = async (req, res) => {
    try {
        const { titre, cours_id } = req.body;
        const newTopic = await ForumTopic.create({ titre, cours_id, utilisateur_id_createur: req.user.id });
        res.status(201).json(newTopic);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du sujet', error });
    }
};

// Get all forum topics
exports.getAllTopics = async (req, res) => {
    try {
        const topics = await ForumTopic.findAll();
        res.status(200).json(topics);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des sujets', error });
    }
};

// Get a single forum topic by ID
exports.getTopicById = async (req, res) => {
    try {
        const topic = await ForumTopic.findByPk(req.params.id);
        if (!topic) {
            return res.status(404).json({ message: 'Sujet non trouvé' });
        }
        res.status(200).json(topic);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du sujet', error });
    }
};

// Update a forum topic
exports.updateTopic = async (req, res) => {
    try {
        const { titre, cours_id } = req.body;
        const topic = await ForumTopic.findByPk(req.params.id);
        if (!topic) {
            return res.status(404).json({ message: 'Sujet non trouvé' });
        }
        topic.titre = titre;
        topic.cours_id = cours_id;
        await topic.save();
        res.status(200).json(topic);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du sujet', error });
    }
};

// Delete a forum topic
exports.deleteTopic = async (req, res) => {
    try {
        const topic = await ForumTopic.findByPk(req.params.id);
        if (!topic) {
            return res.status(404).json({ message: 'Sujet non trouvé' });
        }
        await topic.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du sujet', error });
    }
};

// Create a new message in a forum topic
exports.createMessage = async (req, res) => {
    try {
        const { sujet_id, contenu_message } = req.body;
        const newMessage = await ForumMessage.create({ sujet_id, contenu_message, utilisateur_id_auteur: req.user.id });
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du message', error });
    }
};

// Get all messages for a specific forum topic
exports.getMessagesByTopicId = async (req, res) => {
    try {
        const messages = await ForumMessage.findAll({ where: { sujet_id: req.params.id } });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des messages', error });
    }
};