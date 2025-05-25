const express = require('express');
const router = express.Router();
const lessonController = require('../controller/index');

// Create a new lesson
router.post('/', lessonController.createLesson);

// Get all lessons
router.get('/', lessonController.getAllLessons);

// Get a lesson by ID
router.get('/:id', lessonController.getLessonById);

// Update a lesson by ID
router.put('/:id', lessonController.updateLesson);

// Delete a lesson by ID
router.delete('/:id', lessonController.deleteLesson);

module.exports = router;