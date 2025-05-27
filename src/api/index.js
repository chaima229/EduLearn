// src/api/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/routes');
const userRoutes = require('./users/routes');
const categoryRoutes = require('./categories/routes');
const courseRoutes = require('./courses/routes'); // Gère /api/courses et /api/courses/:id + imbrications
const lessonRoutes = require('./lessons/routes'); // Gère /api/lessons/:id
const enrollmentRoutes = require('./enrollments/routes'); // Gère /api/enrollments/...
const quizRoutes = require('./quizzes/routes'); // Gère /api/quizzes/:id + imbrications
const quizAttemptRoutes = require('./quizAttempts/routes'); // Gère /api/quiz-attempts/:id
const certificateRoutes = require('./certificates/routes'); // Gère /api/certificates/...
const forumRoutes = require('./forum/routes'); // Gère /api/forum/...
const notificationRoutes = require('./notifications/routes')

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/courses', courseRoutes);       // Déjà configuré pour imbriquer les routes de leçons, quiz, certificats, forum
router.use('/lessons', lessonRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/quizzes', quizRoutes);         // Déjà configuré pour imbriquer les routes de tentatives
router.use('/quiz-attempts', quizAttemptRoutes);
router.use('/certificates', certificateRoutes);
router.use('/forum', forumRoutes);
router.use('/notifications', notificationRoutes);


router.get('/healthcheck', (req, res) => res.send('API is healthy and running!'));

module.exports = router;