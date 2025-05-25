const Lesson = require('../../../models/Lesson');

// Create a new lesson
exports.createLesson = async (req, res) => {
    try {
        const { titre, contenu, cours_id, ordre, duree_estimee_min } = req.body;
        const newLesson = await Lesson.create({ titre, contenu, cours_id, ordre, duree_estimee_min });
        res.status(201).json(newLesson);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la leçon', error });
    }
};

// Get all lessons
exports.getAllLessons = async (req, res) => {
    try {
        const lessons = await Lesson.findAll();
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des leçons', error });
    }
};

// Get a lesson by ID
exports.getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findByPk(req.params.id);
        if (!lesson) {
            return res.status(404).json({ message: 'Leçon non trouvée' });
        }
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la leçon', error });
    }
};

// Update a lesson
exports.updateLesson = async (req, res) => {
    try {
        const { titre, contenu, cours_id, ordre, duree_estimee_min } = req.body;
        const lesson = await Lesson.findByPk(req.params.id);
        if (!lesson) {
            return res.status(404).json({ message: 'Leçon non trouvée' });
        }
        await lesson.update({ titre, contenu, cours_id, ordre, duree_estimee_min });
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la leçon', error });
    }
};

// Delete a lesson
exports.deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findByPk(req.params.id);
        if (!lesson) {
            return res.status(404).json({ message: 'Leçon non trouvée' });
        }
        await lesson.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la leçon', error });
    }
};