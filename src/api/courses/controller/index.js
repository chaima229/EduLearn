// src/api/courses/controller/index.js
const { Course, User, CategoryCourse, Lesson } = require('../../../models');
const { Op } = require('sequelize');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Instructeur ou Admin
exports.createCourse = async (req, res, next) => {
    const { titre, description, categorie_id, niveau_difficulte, image_url_couverture, est_publie } = req.body;
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'instructeur') {
            return res.status(403).json({ message: "Accès refusé." });
        }
        const instructeur_id = (req.user.role === 'instructeur') ? req.user.id : (req.body.instructeur_id || req.user.id); // Admin peut assigner un instructeur

        if(categorie_id) {
            const category = await CategoryCourse.findByPk(categorie_id);
            if (!category) return res.status(400).json({ message: "Catégorie non valide." });
        }

        const course = await Course.create({
            titre, description, instructeur_id, categorie_id, niveau_difficulte, image_url_couverture,
            est_publie: est_publie !== undefined ? est_publie : false
        });
        res.status(201).json(course);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all courses (avec filtres optionnels)
// @route   GET /api/courses
// @access  Public (pour les cours publiés), ou admin/instructeur pour les non-publiés
exports.getAllCourses = async (req, res, next) => {
    const { categorie_id, niveau, search, page = 1, limit = 10 } = req.query;
    const whereClause = {};
    const offset = (parseInt(page) - 1) * parseInt(limit);

    if (categorie_id) whereClause.categorie_id = categorie_id;
    if (niveau) whereClause.niveau_difficulte = niveau;
    if (search) {
        whereClause[Op.or] = [
            { titre: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }

    if (req.user && req.user.role === 'admin') {
        // L'admin voit tout
    } else if (req.user && req.user.role === 'instructeur') {
        // L'instructeur voit ses cours (publiés ou non) ET les cours publiés des autres
        whereClause[Op.or] = [
            ...(whereClause[Op.or] || [{}]), // conserve les filtres existants
            { est_publie: true },
            { [Op.and]: [{ instructeur_id: req.user.id }, { est_publie: false }] }
        ];
        // S'il y avait déjà un whereClause[Op.or], il faut le combiner. C'est un peu plus complexe.
        // Une approche plus simple pour instructeur :
        // 1. Récupérer tous les cours correspondant aux filtres de base.
        // 2. Filtrer ensuite en JS pour ceux auxquels il a accès.
        // Ou construire une requête plus complexe.
        // Pour l'instant, on simplifie: l'instructeur voit les publiés et les siens.
        const orConditions = [{ est_publie: true }];
        if (whereClause.instructeur_id == req.user.id || !whereClause.instructeur_id) { // si pas filtré par instructeur OU filtré par lui-même
            orConditions.push({ [Op.and]: [{ instructeur_id: req.user.id }, { est_publie: false }]});
        }
        whereClause[Op.or] = orConditions;

    } else {
        // Utilisateur non authentifié ou étudiant : voit seulement les cours publiés
        whereClause.est_publie = true;
    }


    try {
        const { count, rows: courses } = await Course.findAndCountAll({
            where: whereClause,
            include: [
                { model: User, as: 'instructor', attributes: ['id', 'nom_utilisateur', 'prenom', 'nom_famille'] },
                { model: CategoryCourse, as: 'category', attributes: ['id', 'nom_categorie'] }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['date_creation', 'DESC']]
        });
        res.json({
            courses,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalCourses: count
        });
    } catch (error) {
        next(error);
    }
};


// @desc    Get a single course by ID
// @route   GET /api/courses/:id
// @access  Public (si publié) ou Privé (instructeur/admin)
exports.getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findByPk(req.params.id, {
            include: [
                { model: User, as: 'instructor', attributes: ['id', 'nom_utilisateur', 'prenom', 'nom_famille'] },
                { model: CategoryCourse, as: 'category', attributes: ['id', 'nom_categorie'] },
                { model: Lesson, order: [['ordre', 'ASC']], attributes: ['id', 'titre', 'ordre', 'duree_estimee_min'] }
            ]
        });

        if (!course) return res.status(404).json({ message: 'Cours non trouvé' });

        if (!course.est_publie && (!req.user || (req.user.id !== course.instructeur_id && req.user.role !== 'admin'))) {
             return res.status(403).json({ message: 'Accès non autorisé à ce cours' });
        }
        res.json(course);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Instructeur du cours ou Admin
exports.updateCourse = async (req, res, next) => {
    const { titre, description, categorie_id, instructeur_id, niveau_difficulte, image_url_couverture, est_publie } = req.body;
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return res.status(404).json({ message: 'Cours non trouvé' });

        if (course.instructeur_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Non autorisé à modifier ce cours' });
        }

        if(categorie_id) {
            const category = await CategoryCourse.findByPk(categorie_id);
            if (!category) return res.status(400).json({ message: "Catégorie non valide." });
            course.categorie_id = categorie_id;
        }
        if(instructeur_id && req.user.role === 'admin'){ // Seul l'admin peut changer l'instructeur
            const instructor = await User.findByPk(instructeur_id);
            if (!instructor || instructor.role !== 'instructeur') return res.status(400).json({ message: "Instructeur non valide." });
            course.instructeur_id = instructeur_id;
        }

        course.titre = titre !== undefined ? titre : course.titre;
        course.description = description !== undefined ? description : course.description;
        course.niveau_difficulte = niveau_difficulte !== undefined ? niveau_difficulte : course.niveau_difficulte;
        course.image_url_couverture = image_url_couverture !== undefined ? image_url_couverture : course.image_url_couverture;
        if (est_publie !== undefined) course.est_publie = est_publie;

        await course.save();
        res.json(course);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Instructeur du cours ou Admin
exports.deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return res.status(404).json({ message: 'Cours non trouvé' });

        if (course.instructeur_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Non autorisé à supprimer ce cours' });
        }
        await course.destroy();
        res.json({ message: 'Cours supprimé avec succès' });
    } catch (error) {
        next(error);
    }
};