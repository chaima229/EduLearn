// src/api/certificates/controller/index.js
const { Certificate, UserCertificate, Course, User } = require('../../../models');

// === Définitions de Certificats (par l'admin ou instructeur) ===
// @desc    Define a certificate for a course
// @route   POST /api/courses/:courseId/certificate-definition
// @access  Private (Instructeur du cours ou Admin)
exports.defineCertificate = async (req, res, next) => {
    const { courseId } = req.params;
    const { titre_certificat, description_modele } = req.body;
    try {
        const course = await Course.findByPk(courseId);
        if (!course) return res.status(404).json({ message: "Cours non trouvé."});
        if (course.instructeur_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Non autorisé à définir un certificat pour ce cours." });
        }

        const certificate = await Certificate.create({
            cours_id: courseId,
            titre_certificat,
            description_modele
        });
        res.status(201).json(certificate);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError'){
            return res.status(400).json({ message: "Un certificat est déjà défini pour ce cours."});
        }
        next(error);
    }
};

// @desc    Get certificate definition for a course
// @route   GET /api/courses/:courseId/certificate-definition
// @access  Private (Instructeur du cours ou Admin)
exports.getCertificateDefinition = async (req, res, next) => {
    const { courseId } = req.params;
    try {
        // Pas besoin de vérifier les droits car seule la définition est vue.
        const certificate = await Certificate.findOne({ where: { cours_id: courseId } });
        if (!certificate) return res.status(404).json({ message: "Aucune définition de certificat pour ce cours." });
        res.json(certificate);
    } catch (error) {
        next(error);
    }
};

// @desc    Update certificate definition
// @route   PUT /api/certificates/definitions/:certificateDefId  (route non imbriquée)
// @access  Private (Instructeur du cours associé ou Admin)
exports.updateCertificateDefinition = async (req, res, next) => {
    const { titre_certificat, description_modele } = req.body;
    try {
        const certDef = await Certificate.findByPk(req.params.certificateDefId, { include: Course });
        if (!certDef) return res.status(404).json({ message: "Définition de certificat non trouvée." });
        if (certDef.Cour.instructeur_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Non autorisé à modifier cette définition." });
        }
        certDef.titre_certificat = titre_certificat !== undefined ? titre_certificat : certDef.titre_certificat;
        certDef.description_modele = description_modele !== undefined ? description_modele : certDef.description_modele;
        await certDef.save();
        res.json(certDef);
    } catch (error) {
        next(error);
    }
};


// === Certificats Utilisateur (Générés) ===
// La génération effective (PDF etc) est hors scope ici, on gère juste l'entrée en DB.
// Cela pourrait être déclenché par l'achèvement d'un cours (via webhook/event ou check manuel).
// Pour simplifier, on peut avoir une route pour un admin/instructeur pour "attribuer" un certificat.

// @desc    Award a certificate to a user for a course
// @route   POST /api/certificates/award
// @access  Private (Admin ou Instructeur du cours)
exports.awardUserCertificate = async (req, res, next) => {
    const { utilisateur_id, cours_id, url_certificat_genere } = req.body; // L'URL serait générée par un autre service
    try {
        const user = await User.findByPk(utilisateur_id);
        if(!user) return res.status(404).json({message: "Utilisateur non trouvé."});

        const course = await Course.findByPk(cours_id);
        if (!course) return res.status(404).json({message: "Cours non trouvé."});

        const certificateDef = await Certificate.findOne({ where: { cours_id }});
        if (!certificateDef) return res.status(400).json({ message: "Aucune définition de certificat pour ce cours. Définissez-en une d'abord."});

        if (course.instructeur_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Non autorisé à attribuer un certificat pour ce cours." });
        }
        // Vérifier si l'utilisateur a complété le cours (simplifié ici, vous devriez vérifier CourseEnrollment.date_achevement)
        // const enrollment = await CourseEnrollment.findOne({ where: { utilisateur_id, cours_id, date_achevement: {[Op.ne]: null} }});
        // if (!enrollment) return res.status(400).json({ message: "L'utilisateur n'a pas complété ce cours." });

        const userCert = await UserCertificate.create({
            utilisateur_id,
            certificat_id: certificateDef.id,
            cours_id,
            date_obtention: new Date(),
            url_certificat_genere
        });
        res.status(201).json(userCert);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError'){
            return res.status(400).json({ message: "Cet utilisateur a déjà ce certificat."});
        }
        next(error);
    }
};

// @desc    Get all certificates for the current user
// @route   GET /api/certificates/my-certificates
// @access  Private
exports.getMyCertificates = async (req, res, next) => {
    try {
        const certificates = await UserCertificate.findAll({ // Modèle Sequelize est 'CertificatsUtilisateur' comme défini
            where: { utilisateur_id: req.user.id },
            include: [
                {
                    model: Certificate, // Modèle Sequelize est 'Certificate'
                    // as: 'CertificateDefinition', // OPTIONNEL: alias si vous le souhaitez, sinon ce sera "Certificate"
                    attributes: ['titre_certificat', 'description_modele']
                },
                {
                    model: Course, // Modèle Sequelize est 'Course'
                    // as: 'relatedCourse', // OPTIONNEL: alias, sinon ce sera "Course"
                    attributes: ['id', 'titre']
                },
                {
                    model: User,
                    as: 'utilisateur', // <<< C'est ici le problème
                    attributes: ['id', 'prenom', 'nom_famille', 'email', 'nom_utilisateur']
                }
            ],
            order: [['date_obtention', 'DESC']]
        });
        res.json(certificates);
    } catch (error) {
        console.error("Erreur getMyCertificates:", error); // Bonne pratique d'avoir un log serveur
        next(error);
    }
};

// @desc    Get a specific user certificate
// @route   GET /api/certificates/:userCertificateId (certificat d'un utilisateur spécifique)
// @access  Private (Propriétaire du certificat ou Admin)
exports.getUserCertificateById = async (req, res, next) => {
    try {
        const userCert = await UserCertificate.findByPk(req.params.userCertificateId, {
            include: [User, Certificate, Course]
        });
        if (!userCert) return res.status(404).json({ message: "Certificat utilisateur non trouvé."});

        if(userCert.utilisateur_id !== req.user.id && req.user.role !== 'admin'){
            return res.status(403).json({message: "Accès non autorisé."});
        }
        res.json(userCert);
    } catch (error) {
        next(error);
    }
};