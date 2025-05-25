const express = require('express');
const router = express.Router();
const enrollmentController = require('../controller/index');

// Routes for managing course enrollments
router.post('/', enrollmentController.createEnrollment);
router.get('/', enrollmentController.getAllEnrollments);
router.get('/:id', enrollmentController.getEnrollmentById);
router.put('/:id', enrollmentController.updateEnrollment);
router.delete('/:id', enrollmentController.deleteEnrollment);

// Routes for managing lesson progress
router.post('/:enrollmentId/lessons/:lessonId/progress', enrollmentController.updateLessonProgress);
router.get('/:enrollmentId/lessons/progress', enrollmentController.getLessonProgressByEnrollmentId);

module.exports = router;