const Enrollment = require('../../../models/Enrollment');
const LessonProgress = require('../../../models/LessonProgress');

// Create a new enrollment
exports.createEnrollment = async (req, res) => {
    try {
        const { utilisateur_id, cours_id } = req.body;
        const enrollment = await Enrollment.create({ utilisateur_id, cours_id });
        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating enrollment', error });
    }
};

// Get all enrollments
exports.getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.findAll();
        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching enrollments', error });
    }
};

// Get a specific enrollment by ID
exports.getEnrollmentById = async (req, res) => {
    try {
        const enrollment = await Enrollment.findByPk(req.params.id);
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        res.status(200).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching enrollment', error });
    }
};

// Update an enrollment
exports.updateEnrollment = async (req, res) => {
    try {
        const { utilisateur_id, cours_id } = req.body;
        const enrollment = await Enrollment.findByPk(req.params.id);
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        enrollment.utilisateur_id = utilisateur_id;
        enrollment.cours_id = cours_id;
        await enrollment.save();
        res.status(200).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating enrollment', error });
    }
};

// Delete an enrollment
exports.deleteEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findByPk(req.params.id);
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        await enrollment.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting enrollment', error });
    }
};

// Create lesson progress
exports.createLessonProgress = async (req, res) => {
    try {
        const { inscription_cours_id, lecon_id, est_completee } = req.body;
        const progress = await LessonProgress.create({ inscription_cours_id, lecon_id, est_completee });
        res.status(201).json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error creating lesson progress', error });
    }
};

// Get all lesson progress for a specific enrollment
exports.getLessonProgressByEnrollmentId = async (req, res) => {
    try {
        const progress = await LessonProgress.findAll({ where: { inscription_cours_id: req.params.id } });
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lesson progress', error });
    }
};