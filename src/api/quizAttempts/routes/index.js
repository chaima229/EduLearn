// src/api/quizAttempts/routes/index.js
const express = require('express');
const router = express.Router(); // Routeur pour /api/quiz-attempts
const quizAttemptController = require('../controller');
const myCustomAuthMiddleware = require('../../../middleware/authMiddleware');

// Route pour obtenir une tentative spécifique par son ID
router.get('/:attemptId', myCustomAuthMiddleware, quizAttemptController.getQuizAttemptById);

// Note: La soumission (POST) et la récupération (GET list) des tentatives sont gérées
// via une route imbriquée sous /api/quizzes/:quizId/attempts

module.exports = router;