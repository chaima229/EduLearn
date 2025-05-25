const express = require('express');
const router = express.Router();
const quizAttemptController = require('../controller');

// Route to create a new quiz attempt
router.post('/', quizAttemptController.createQuizAttempt);

// Route to get all quiz attempts
router.get('/', quizAttemptController.getAllQuizAttempts);

// Route to get a specific quiz attempt by ID
router.get('/:id', quizAttemptController.getQuizAttemptById);

// Route to update a quiz attempt by ID
router.put('/:id', quizAttemptController.updateQuizAttempt);

// Route to delete a quiz attempt by ID
router.delete('/:id', quizAttemptController.deleteQuizAttempt);

module.exports = router;