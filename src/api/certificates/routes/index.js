const express = require('express');
const router = express.Router();
const certificatesController = require('../controller');

// Route to create a new certificate
router.post('/', certificatesController.createCertificate);

// Route to get all certificates
router.get('/', certificatesController.getAllCertificates);

// Route to get a specific certificate by ID
router.get('/:id', certificatesController.getCertificateById);

// Route to update a certificate by ID
router.put('/:id', certificatesController.updateCertificate);

// Route to delete a certificate by ID
router.delete('/:id', certificatesController.deleteCertificate);

module.exports = router;