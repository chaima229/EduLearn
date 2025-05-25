const Certificate = require('../../../models/Certificate');
const UserCertificate = require('../../../models/UserCertificate');

// Create a new certificate
exports.createCertificate = async (req, res) => {
    try {
        const { title, descriptionTemplate, courseId } = req.body;
        const newCertificate = await Certificate.create({ title_certificat: title, description_modele: descriptionTemplate, cours_id: courseId });
        res.status(201).json(newCertificate);
    } catch (error) {
        res.status(500).json({ message: 'Error creating certificate', error });
    }
};

// Get all certificates
exports.getAllCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.findAll();
        res.status(200).json(certificates);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching certificates', error });
    }
};

// Get a certificate by ID
exports.getCertificateById = async (req, res) => {
    try {
        const certificate = await Certificate.findByPk(req.params.id);
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.status(200).json(certificate);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching certificate', error });
    }
};

// Update a certificate
exports.updateCertificate = async (req, res) => {
    try {
        const { title, descriptionTemplate, courseId } = req.body;
        const [updated] = await Certificate.update({ title_certificat: title, description_modele: descriptionTemplate, cours_id: courseId }, {
            where: { id: req.params.id }
        });
        if (!updated) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        const updatedCertificate = await Certificate.findByPk(req.params.id);
        res.status(200).json(updatedCertificate);
    } catch (error) {
        res.status(500).json({ message: 'Error updating certificate', error });
    }
};

// Delete a certificate
exports.deleteCertificate = async (req, res) => {
    try {
        const deleted = await Certificate.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting certificate', error });
    }
};