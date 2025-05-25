// src/api/enrollments/routes/index.js
const express = require('express');
const router = express.Router();
const enrollmentController = require('../controller'); // ou la déstructuration
const myCustomAuthMiddleware = require('../../../middleware/authMiddleware');

console.log('--- Dans enrollments/routes ---');
console.log('Type of myCustomAuthMiddleware:', typeof myCustomAuthMiddleware);
// Si vous importez tout l'objet controller:
console.log('enrollmentController:', enrollmentController);
console.log('Type of enrollmentController.createEnrollment:', typeof enrollmentController.createEnrollment); // Remplacez createEnrollment par le nom de votre fonction
// Si vous déstructurez le controller:
// const { createEnrollment, getMyEnrollments } = require('../controller');
// console.log('Type of createEnrollment from import:', typeof createEnrollment);


// Ligne 13 (ou la vôtre)
router.post('/', myCustomAuthMiddleware, enrollmentController.createEnrollment); // ou le nom de votre fonction

module.exports = router;