const db = require('../../../config/db');
const Quiz = require('../../../models/Quiz');
const QuizQuestion = require('../../../models/QuizQuestion');
const QuizOption = require('../../../models');

// Create a new quiz
exports.createQuiz = async (req, res) => {
    try {
        const { title, description, courseId, lessonId } = req.body;
        const newQuiz = await Quiz.create({ title, description, courseId, lessonId });
        res.status(201).json(newQuiz);
    } catch (error) {
        res.status(500).json({ message: 'Error creating quiz', error });
    }
};

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.findAll();
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quizzes', error });
    }
};

// Get a quiz by ID
exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findByPk(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quiz', error });
    }
};

// Update a quiz
exports.updateQuiz = async (req, res) => {
    try {
        const { title, description } = req.body;
        const [updated] = await Quiz.update({ title, description }, {
            where: { id: req.params.id }
        });
        if (!updated) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        const updatedQuiz = await Quiz.findByPk(req.params.id);
        res.status(200).json(updatedQuiz);
    } catch (error) {
        res.status(500).json({ message: 'Error updating quiz', error });
    }
};

// Delete a quiz
exports.deleteQuiz = async (req, res) => {
    try {
        const deleted = await Quiz.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting quiz', error });
    }
};