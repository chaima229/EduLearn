const express = require('express');
const router = express.Router();
const courseController = require('../controller/index');

// Route to create a new course
router.post('/', courseController.createCourse);

// Route to get all courses
router.get('/', courseController.getAllCourses);

// Route to get a course by ID
router.get('/:id', courseController.getCourseById);

// Route to update a course by ID
router.put('/:id', courseController.updateCourse);

// Route to delete a course by ID
router.delete('/:id', courseController.deleteCourse);

module.exports = router;