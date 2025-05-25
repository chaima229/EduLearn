// src/api/enrollments/controller/index.js
const { CourseEnrollment, LessonProgress, Course, Lesson, User } = require('../../../models');
const { sequelize } = require('../../../models'); // Pour les transactions si besoin

// @desc    Enroll user to a course
// @route   POST /api/courses/:courseId/enroll
// @access  Private (étudiant)
exports.enrollUserToCourse = async (req, res, next) => {
    const { courseId } = req.params;
    const utilisateur_id = req.user.id;

    try {
        const course = await Course.findByPk(courseId);
        if (!course) return res.status(404).json({ message: "Cours non trouvé." });
        if (!course.est_publie) return res.status(400).json({ message: "Ce cours n'est pas encore publié." });

        const existingEnrollment = await CourseEnrollment.findOne({
            where: { utilisateur_id, cours_id: courseId }
        });
        if (existingEnrollment) {
            return res.status(400).json({ message: "Vous êtes déjà inscrit à ce cours." });
        }

        const enrollment = await CourseEnrollment.create({ utilisateur_id, cours_id: courseId });
        res.status(201).json({ message: "Inscription réussie.", enrollment });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') { // Au cas où l'index unique le gère avant notre check
            return res.status(400).json({ message: "Vous êtes déjà inscrit à ce cours (contrainte DB)." });
        }
        next(error);
    }
};

// @desc    Get all enrollments for the current user
// @route   GET /api/enrollments/my-enrollments
// @access  Private
exports.getMyEnrollments = async (req, res, next) => {
    try {
        const enrollments = await CourseEnrollment.findAll({
            where: { utilisateur_id: req.user.id },
            include: [{
                model: Course,
                attributes: ['id', 'titre', 'image_url_couverture'],
                include: [{model: User, as: 'instructor', attributes:['prenom', 'nom_famille']}]
            }],
            order: [['date_inscription', 'DESC']]
        });
        res.json(enrollments);
    } catch (error) {
        next(error);
    }
};

// @desc    Get enrollment details (including lesson progress)
// @route   GET /api/enrollments/:enrollmentId
// @access  Private (l'utilisateur de l'inscription ou admin)
exports.getEnrollmentDetails = async (req, res, next) => {
    try {
        const enrollment = await CourseEnrollment.findByPk(req.params.enrollmentId, {
            include: [
                { model: Course, include: [Lesson] }, // Inclure toutes les leçons du cours
                { model: LessonProgress, include: [Lesson] } // Inclure la progression des leçons spécifiques
            ]
        });
        if (!enrollment) return res.status(404).json({ message: "Inscription non trouvée." });
        if (enrollment.utilisateur_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Accès non autorisé à cette inscription." });
        }
        res.json(enrollment);
    } catch (error) {
        next(error);
    }
};


// @desc    Mark a lesson as completed/uncompleted for an enrollment
// @route   PATCH /api/enrollments/:enrollmentId/lessons/:lessonId/progress
// @access  Private (l'utilisateur de l'inscription)
exports.updateLessonProgress = async (req, res, next) => {
    const { enrollmentId, lessonId } = req.params;
    const { est_completee } = req.body; // boolean

    if (typeof est_completee !== 'boolean') {
        return res.status(400).json({ message: "'est_completee' doit être un booléen." });
    }

    try {
        const enrollment = await CourseEnrollment.findByPk(enrollmentId);
        if (!enrollment) return res.status(404).json({ message: "Inscription non trouvée." });
        if (enrollment.utilisateur_id !== req.user.id) {
            return res.status(403).json({ message: "Accès non autorisé." });
        }

        const lesson = await Lesson.findByPk(lessonId);
        if (!lesson || lesson.cours_id !== enrollment.cours_id) {
            return res.status(404).json({ message: "Leçon non trouvée ou n'appartient pas à ce cours." });
        }

        let lessonProgress = await LessonProgress.findOne({
            where: { inscription_cours_id: enrollmentId, lecon_id: lessonId }
        });

        if (!lessonProgress) {
            lessonProgress = await LessonProgress.create({
                inscription_cours_id: enrollmentId,
                lecon_id: lessonId,
                est_completee: est_completee,
                date_completion: est_completee ? new Date() : null
            });
        } else {
            lessonProgress.est_completee = est_completee;
            lessonProgress.date_completion = est_completee ? new Date() : null;
            await lessonProgress.save();
        }

        // Recalculer la progression du cours
        const totalLessonsInCourse = await Lesson.count({ where: { cours_id: enrollment.cours_id } });
        const completedLessons = await LessonProgress.count({
            where: { inscription_cours_id: enrollmentId, est_completee: true }
        });

        enrollment.progression_pourcentage = totalLessonsInCourse > 0 ? (completedLessons / totalLessonsInCourse) * 100 : 0;
        if (enrollment.progression_pourcentage >= 100 && !enrollment.date_achevement) {
            enrollment.date_achevement = new Date();
        } else if (enrollment.progression_pourcentage < 100) {
            enrollment.date_achevement = null;
        }
        await enrollment.save();

        res.json({ lessonProgress, courseProgression: enrollment.progression_pourcentage });

    } catch (error) {
        next(error);
    }
};