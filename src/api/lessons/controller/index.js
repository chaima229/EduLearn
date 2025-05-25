// src/api/lessons/controller/index.js
const { Lesson, Course, CourseEnrollment } = require('../../../models'); // Ajoutez CourseEnrollment

// @desc    Get a specific lesson by ID
// @route   GET /api/lessons/:id
// @access  Private (Utilisateur inscrit au cours, ou instructeur/admin)
exports.getLessonById = async (req, res, next) => {
    try {
        const lesson = await Lesson.findByPk(req.params.id, {
            include: [{ model: Course, attributes: ['id', 'titre', 'instructeur_id', 'est_publie'] }]
        });

        if (!lesson) return res.status(404).json({ message: 'Leçon non trouvée' });

        // Vérification d'accès
        const course = lesson.Cour;
        if (!course.est_publie && req.user.id !== course.instructeur_id && req.user.role !== 'admin') {
             return res.status(403).json({ message: 'Accès non autorisé à la leçon de ce cours non publié.' });
        }

        // Vérifier si l'utilisateur (non-admin, non-instructeur) est inscrit au cours pour voir le contenu
        if (req.user.role === 'etudiant' && req.user.id !== course.instructeur_id) {
            const enrollment = await CourseEnrollment.findOne({
                where: { utilisateur_id: req.user.id, cours_id: course.id }
            });
            if (!enrollment) {
                 return res.status(403).json({ message: 'Vous devez être inscrit au cours pour voir cette leçon.' });
            }
        }
        // Les admins et l'instructeur du cours peuvent toujours voir la leçon
        res.json(lesson);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a lesson by ID
// @route   PUT /api/lessons/:id
// @access  Private (Instructeur du cours ou Admin)
exports.updateLesson = async (req, res, next) => {
    const { titre, contenu, ordre, duree_estimee_min } = req.body;
    try {
        const lesson = await Lesson.findByPk(req.params.id, { include: Course });
        if (!lesson) return res.status(404).json({ message: 'Leçon non trouvée' });

        if (lesson.Cour.instructeur_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Non autorisé à modifier cette leçon' });
        }

        lesson.titre = titre !== undefined ? titre : lesson.titre;
        lesson.contenu = contenu !== undefined ? contenu : lesson.contenu;
        lesson.ordre = ordre !== undefined ? ordre : lesson.ordre;
        lesson.duree_estimee_min = duree_estimee_min !== undefined ? duree_estimee_min : lesson.duree_estimee_min;

        await lesson.save();
        res.json(lesson);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'L\'ordre de cette leçon existe déjà pour ce cours.' });
        }
        next(error);
    }
};

// @desc    Delete a lesson by ID
// @route   DELETE /api/lessons/:id
// @access  Private (Instructeur du cours ou Admin)
exports.deleteLesson = async (req, res, next) => {
    try {
        const lesson = await Lesson.findByPk(req.params.id, { include: Course });
        if (!lesson) return res.status(404).json({ message: 'Leçon non trouvée' });

        if (lesson.Cour.instructeur_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Non autorisé à supprimer cette leçon' });
        }
        await lesson.destroy();
        res.json({ message: 'Leçon supprimée' });
    } catch (error) {
        next(error);
    }
};

// Les fonctions pour les leçons imbriquées dans un cours sont séparées
// pour la clarté, dans un fichier spécifique ou ici si vous préférez.
// Ici, on les met dans ce contrôleur pour l'instant.

// @desc    Get all lessons for a specific course
// @route   GET /api/courses/:courseId/lessons
// @access  Private (Utilisateur inscrit au cours, ou instructeur/admin)
exports.getLessonsForCourse = async (req, res, next) => {
    const { courseId } = req.params;
    try {
        const course = await Course.findByPk(courseId);
        if(!course) return res.status(404).json({ message: "Cours non trouvé"});

        // Vérification d'accès (similaire à getLessonById)
        if (!course.est_publie && (!req.user || (req.user.id !== course.instructeur_id && req.user.role !== 'admin'))) {
             return res.status(403).json({ message: 'Accès non autorisé aux leçons de ce cours non publié.' });
        }
        let lessonsVisible = true;
        if (req.user && req.user.role === 'etudiant' && req.user.id !== course.instructeur_id) {
            const enrollment = await CourseEnrollment.findOne({
                where: { utilisateur_id: req.user.id, cours_id: course.id }
            });
            if (!enrollment) lessonsVisible = false;
        }


        const lessons = await Lesson.findAll({
            where: { cours_id: courseId },
            order: [['ordre', 'ASC']],
            // Ne pas envoyer le contenu de toutes les leçons dans la liste sauf si nécessaire.
            // On peut le conditionner si l'utilisateur est inscrit.
            attributes: lessonsVisible ? Lesson.getAttributes() : ['id', 'cours_id', 'titre', 'ordre', 'duree_estimee_min']
        });
        if(!lessonsVisible && lessons.length > 0){
             return res.status(200).json({lessons, message: "Inscrivez-vous pour voir le contenu des leçons."});
        }
        res.json(lessons);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new lesson for a specific course
// @route   POST /api/courses/:courseId/lessons
// @access  Private (Instructeur du cours ou Admin)
exports.createLessonForCourse = async (req, res, next) => {
    const { titre, contenu, ordre, duree_estimee_min } = req.body;
    const { courseId } = req.params;
    try {
        const course = await Course.findByPk(courseId);
        if(!course) return res.status(404).json({ message: "Cours non trouvé pour y ajouter une leçon."});

        if (course.instructeur_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Non autorisé à ajouter une leçon à ce cours' });
        }

        const newLesson = await Lesson.create({
            cours_id: courseId, titre, contenu, ordre, duree_estimee_min
        });
        res.status(201).json(newLesson);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'L\'ordre de cette leçon existe déjà pour ce cours.' });
        }
        next(error);
    }
};