const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/routes/index');
const userRoutes = require('./users/routes/index');
const categoryRoutes = require('./categories/routes/index');
const courseRoutes = require('./courses/routes/index');
const lessonRoutes = require('./lessons/routes/index');
const enrollmentRoutes = require('./enrollments/routes/index');
const quizRoutes = require('./quizzes/routes/index');
const quizAttemptRoutes = require('./quizAttempts/routes/index');
const certificateRoutes = require('./certificates/routes/index');
const forumRoutes = require('./forum/routes/index');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/courses', courseRoutes);
router.use('/lessons', lessonRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/quizzes', quizRoutes);
router.use('/quiz-attempts', quizAttemptRoutes);
router.use('/certificates', certificateRoutes);
router.use('/forum', forumRoutes);

module.exports = router;