// src/api/lessons/routes/index.js
const express = require('express');
const router = express.Router();
const lessonController = require('../controller');
const myCustomAuthMiddleware = require('../../../middleware/authMiddleware');

router.route('/:id')
    .get(myCustomAuthMiddleware, lessonController.getLessonById) // myCustomAuthMiddleware pour avoir req.user pour les vérifications
    .put(myCustomAuthMiddleware, lessonController.updateLesson) // Le contrôleur vérifie le rôle/propriétaire
    .delete(myCustomAuthMiddleware, lessonController.deleteLesson); // Le contrôleur vérifie le rôle/propriétaire

module.exports = router;