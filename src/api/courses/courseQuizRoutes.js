// src/api/courses/courseQuizRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true }); // pour :courseId
const quizController = require('../quizzes/controller');
const myCustomAuthMiddleware = require('../../middleware/authMiddleware');

// POST /api/courses/:courseId/quizzes
router.post('/', myCustomAuthMiddleware, quizController.createQuiz);
// GET /api/courses/:courseId/quizzes (si vous voulez lister les quiz d'un cours)
// router.get('/', myCustomAuthMiddleware, quizController.getQuizzesForCourse); // À implémenter dans quizController

module.exports = router;