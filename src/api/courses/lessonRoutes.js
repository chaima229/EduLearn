// src/api/courses/lessonRoutes.js
const express = require('express');
// `mergeParams: true` est CRUCIAL pour que :courseId soit accessible ici
const router = express.Router({ mergeParams: true });
const lessonController = require('../lessons/controller'); // Ajustez le chemin si lessonController est ailleurs
const myCustomAuthMiddleware = require('../../middleware/authMiddleware');

router.route('/')
    .get(myCustomAuthMiddleware, lessonController.getLessonsForCourse) // myCustomAuthMiddleware pour avoir req.user
    .post(myCustomAuthMiddleware, lessonController.createLessonForCourse); // Le contrôleur vérifie le rôle

module.exports = router;