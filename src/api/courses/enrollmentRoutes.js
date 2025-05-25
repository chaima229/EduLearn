// src/api/courses/enrollmentRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true }); // Important pour :courseId
const enrollmentController = require('../enrollments/controller'); // Chemin vers le contrôleur des inscriptions
const myCustomAuthMiddleware = require('../../middleware/authMiddleware');

router.post('/enroll', myCustomAuthMiddleware, enrollmentController.enrollUserToCourse);

module.exports = router;