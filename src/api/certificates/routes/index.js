// src/api/certificates/routes/index.js
const express = require('express');
const router = express.Router();
const certificateController = require('../controller');
const myCustomAuthMiddleware = require('../../../middleware/authMiddleware');

// Route pour que l'utilisateur actuel récupère SES certificats
router.get('/my-certificates', myCustomAuthMiddleware, certificateController.getMyCertificates);

// Route pour attribuer un certificat (par admin/instructeur)
router.post('/award', myCustomAuthMiddleware, certificateController.awardUserCertificate);

// Route pour obtenir un certificat utilisateur spécifique par son ID
router.get('/:userCertificateId', myCustomAuthMiddleware, certificateController.getUserCertificateById);

// Routes pour les définitions de certificats
router.put('/definitions/:certificateDefId', myCustomAuthMiddleware, certificateController.updateCertificateDefinition);

// Note: la création et la récupération de définition de certificat sont imbriquées sous /courses
// Donc elles iront dans un fichier `api/courses/certificateDefinitionRoutes.js`

module.exports = router;