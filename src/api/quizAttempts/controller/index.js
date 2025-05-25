const QuizAttempt = require('../../../models/QuizAttempt');

// Create a new quiz attempt
exports.createQuizAttempt = async (req, res) => {
    try {
        const { utilisateur_id, quiz_id, score_obtenu, reponses_utilisateur } = req.body;
        const newAttempt = await QuizAttempt.create({ utilisateur_id, quiz_id, score_obtenu, reponses_utilisateur });
        res.status(201).json(newAttempt);
    } catch (error) {
        res.status(500).json({ message: 'Error creating quiz attempt', error });
    }
};

// Get all quiz attempts
exports.getAllQuizAttempts = async (req, res) => {
    try {
        const attempts = await QuizAttempt.findAll();
        res.status(200).json(attempts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quiz attempts', error });
    }
};

// Get a specific quiz attempt by ID
exports.getQuizAttemptById = async (req, res) => {
    try {
        const attempt = await QuizAttempt.findByPk(req.params.id);
        if (!attempt) {
            return res.status(404).json({ message: 'Quiz attempt not found' });
        }
        res.status(200).json(attempt);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quiz attempt', error });
    }
};

// Update a quiz attempt
exports.updateQuizAttempt = async (req, res) => {
    try {
        const attempt = await QuizAttempt.findByPk(req.params.id);
        if (!attempt) {
            return res.status(404).json({ message: 'Quiz attempt not found' });
        }
        const updatedAttempt = await attempt.update(req.body);
        res.status(200).json(updatedAttempt);
    } catch (error) {
        res.status(500).json({ message: 'Error updating quiz attempt', error });
    }
};

// Delete a quiz attempt
exports.deleteQuizAttempt = async (req, res) => {
    try {
        const attempt = await QuizAttempt.findByPk(req.params.id);
        if (!attempt) {
            return res.status(404).json({ message: 'Quiz attempt not found' });
        }
        await attempt.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting quiz attempt', error });
    }
};