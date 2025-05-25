// src/api/courses/routes/index.js
const express = require('express');
const router = express.Router();
const courseController = require('../controller');
const myCustomAuthMiddleware = require('../../../middleware/authMiddleware');
// ... autres imports
const enrollmentRoutesForCourse = require('../enrollmentRoutes'); // au début du fichier

const courseQuizRoutes = require('../courseQuizRoutes');
// Importer les routes pour les leçons imbriquées
const lessonRoutesForCourse = require('../lessonRoutes'); // À créer (voir ci-dessous)
const certificateDefinitionRoutesForCourse = require('../certificateDefinitionRoutes');
const courseForumRoutes = require('../courseForumRoutes');
// Importer les routes pour les quiz de cours
// const courseQuizRoutes = require('./courseQuizRoutes'); // À créer

router.route('/')
    .post(myCustomAuthMiddleware, courseController.createCourse) // Le contrôleur vérifie le rôle
    .get(myCustomAuthMiddleware, courseController.getAllCourses); // 'myCustomAuthMiddleware' est optionnel ici si public, mais utile pour req.user

router.route('/:id')
    .get(myCustomAuthMiddleware, courseController.getCourseById) // Middleware pour req.user si besoin, logique d'accès dans le ctrl
    .put(myCustomAuthMiddleware, courseController.updateCourse) // Le contrôleur vérifie le rôle/propriétaire
    .delete(myCustomAuthMiddleware, courseController.deleteCourse); // Le contrôleur vérifie le rôle/propriétaire

// Routes imbriquées pour les leçons
router.use('/:courseId/lessons', lessonRoutesForCourse);
// Routes imbriquées pour les quiz liés à un cours
// router.use('/:courseId/quizzes', courseQuizRoutes);



// ...
router.use('/:courseId', enrollmentRoutesForCourse); // vers la fin, avant module.exports


router.use('/:courseId/quizzes', courseQuizRoutes);

router.use('/:courseId/certificate-definition', certificateDefinitionRoutesForCourse);


router.use('/:courseId/forum', courseForumRoutes); // '/:courseId/forum' ou '/:courseId/forum/topics' si vous préférez


module.exports = router;