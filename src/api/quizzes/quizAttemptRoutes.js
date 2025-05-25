// src/api/quizzes/quizAttemptRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true }); // pour :quizId
const quizAttemptController = require('../quizAttempts/controller');
const myCustomAuthMiddleware = require('../../middleware/authMiddleware');

// POST /api/quizzes/:quizId/attempts
router.post('/', myCustomAuthMiddleware, quizAttemptController.submitQuizAttempt);
// GET /api/quizzes/:quizId/attempts
router.get('/', myCustomAuthMiddleware, quizAttemptController.getQuizAttempts);

module.exports = router;