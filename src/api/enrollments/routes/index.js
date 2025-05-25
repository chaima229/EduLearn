// src/api/enrollments/routes/index.js
const express = require('express');
const router = express.Router(); // Routeur principal pour /api/enrollments
const enrollmentController = require('../controller');
const myCustomAuthMiddleware = require('../../../middleware/authMiddleware');

// Créer une route dédiée pour les actions d'un utilisateur sur SES inscriptions
router.get('/my-enrollments', myCustomAuthMiddleware, enrollmentController.getMyEnrollments);

// Route pour obtenir les détails d'une inscription spécifique
router.get('/:enrollmentId', myCustomAuthMiddleware, enrollmentController.getEnrollmentDetails);

// Route pour mettre à jour la progression d'une leçon pour une inscription donnée
router.patch('/:enrollmentId/lessons/:lessonId/progress', myCustomAuthMiddleware, enrollmentController.updateLessonProgress);

// Pas de POST, PUT, DELETE directs sur /api/enrollments/:id en général
// L'inscription se fait via /api/courses/:courseId/enroll
// La suppression d'une inscription peut être gérée par un admin ou si un cours/utilisateur est supprimé (via ON DELETE CASCADE)

module.exports = router;