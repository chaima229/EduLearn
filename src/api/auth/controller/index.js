// src/api/auth/controller/index.js
const { User } = require('../../../models'); // PRÉFÉRABLE: Importer via l'index des modèles
// Si vous gardez votre import actuel : const User = require('../../../models/User'); (mais l'import via l'index est mieux)
const bcrypt = require('bcryptjs'); // J'ai utilisé bcryptjs dans les exemples précédents, si vous utilisez bcrypt, c'est OK aussi.
const jwt = require('jsonwebtoken');
const config = require('../../../config'); // Pour JWT_SECRET et potentiellement d'autres configs

// Register a new user
exports.register = async (req, res, next) => { // Ajoutez 'next' pour le error handler
    const { nom_utilisateur, email, mot_de_passe, prenom, nom_famille, role } = req.body;

    try {
        if (!mot_de_passe) {
            return res.status(400).json({ message: "Le mot de passe est requis." });
        }

        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        const usernameExists = await User.findOne({ where: { nom_utilisateur } });
        if (usernameExists) {
            return res.status(400).json({ message: 'Ce nom d\'utilisateur est déjà utilisé' });
        }

        // Le hachage du mot de passe devrait être géré par le hook 'beforeCreate' dans le modèle User.js
        // Donc, pas besoin de hasher ici explicitement si le hook est en place.
        const user = await User.create({
            nom_utilisateur,
            email,
            mot_de_passe_hash: mot_de_passe, // Le hook s'occupera du hachage
            prenom,
            nom_famille,
            role
        });

        // Renvoyer le token aussi lors de l'inscription pour une meilleure UX
        const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '30d' });

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: {
                id: user.id,
                nom_utilisateur: user.nom_utilisateur,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        // res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error: error.message });
        next(error); // Utiliser le error handler global
    }
};

// Login user
exports.login = async (req, res, next) => { // Ajoutez 'next'
    const { email, mot_de_passe } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe invalide' }); // Message générique pour la sécurité
        }

        // La comparaison du mot de passe devrait utiliser la méthode prototype du modèle
        // user.comparePassword(mot_de_passe) si elle est définie
        const isMatch = await user.comparePassword(mot_de_passe);

        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe invalide' });
        }

        // Mettre à jour derniere_connexion
        user.derniere_connexion = new Date();
        await user.save();

        const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '30d' });

        res.status(200).json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                nom_utilisateur: user.nom_utilisateur,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        // res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
        next(error); // Utiliser le error handler global
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
// =============================================
// AJOUTEZ CETTE FONCTION
// =============================================
exports.getMe = async (req, res, next) => { // Ajoutez 'next'
    try {
        // req.user est défini par le middleware `protect`
        // Il contient déjà les informations de l'utilisateur (sans le mot de passe)
        // donc pas besoin de refaire une requête si `protect` fonctionne bien.
        // Cependant, pour être sûr d'avoir les données les plus à jour, on peut refaire un findByPk.

        const userFromDb = await User.findByPk(req.user.id, { // req.user.id vient du token décodé par 'protect'
            attributes: { exclude: ['mot_de_passe_hash'] }
        });

        if (!userFromDb) {
            // Cela ne devrait pas arriver si le token est valide et l'utilisateur existe toujours
            return res.status(404).json({ message: "Utilisateur non trouvé pour ce token."});
        }
        res.json(userFromDb); // Renvoyer les infos de l'utilisateur
    } catch (error) {
        // res.status(500).json({ message: "Erreur serveur lors de la récupération du profil.", error: error.message });
        next(error); // Utiliser le error handler global
    }
};