// src/api/courses/certificateDefinitionRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true }); // pour :courseId
const certificateController = require('../certificates/controller');
const myCustomAuthMiddleware = require('../../middleware/authMiddleware');

// POST /api/courses/:courseId/certificate-definition
router.route('/') // le chemin complet sera /api/courses/:courseId/certificate-definition
    .post(myCustomAuthMiddleware, certificateController.defineCertificate)
    .get(myCustomAuthMiddleware, certificateController.getCertificateDefinition); // ou public si vous voulez

module.exports = router;