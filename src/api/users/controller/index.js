// src/api/users/controller/index.js
const { User } = require('../../../models');
const { Op } = require('sequelize');
// Si vous n'avez pas encore le middleware 'authorize':
// const { myCustomAuthMiddleware } = require('../../../middleware/authMiddleware'); // Pour ce fichier, il est appliqué au niveau des routes

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin (si vous avez 'authorize', sinon, protégez et vérifiez le rôle manuellement)
exports.getAllUsers = async (req, res, next) => {
    try {
        // Vérification manuelle du rôle si 'authorize' n'est pas utilisé:
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Accès refusé. Réservé aux administrateurs." });
        }
        const users = await User.findAll({
            attributes: { exclude: ['mot_de_passe_hash'] }
        });
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Admin ou l'utilisateur lui-même)
exports.getUserById = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
            return res.status(403).json({ message: "Accès non autorisé à ce profil utilisateur." });
        }
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['mot_de_passe_hash'] }
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update user (Admin ou l'utilisateur lui-même)
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res, next) => {
    const { nom_utilisateur, email, prenom, nom_famille, role, mot_de_passe } = req.body;
    try {
        const userToUpdate = await User.findByPk(req.params.id);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        if (req.user.role !== 'admin' && req.user.id !== userToUpdate.id) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier cet utilisateur." });
        }
        if (role && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à changer le rôle." });
        }

        if (email && email !== userToUpdate.email) {
            const emailExists = await User.findOne({ where: { email, id: { [Op.ne]: userToUpdate.id } } });
            if (emailExists) return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
            userToUpdate.email = email;
        }
        if (nom_utilisateur && nom_utilisateur !== userToUpdate.nom_utilisateur) {
            const usernameExists = await User.findOne({ where: { nom_utilisateur, id: { [Op.ne]: userToUpdate.id } } });
            if (usernameExists) return res.status(400).json({ message: 'Ce nom d\'utilisateur est déjà utilisé.' });
            userToUpdate.nom_utilisateur = nom_utilisateur;
        }

        userToUpdate.prenom = prenom !== undefined ? prenom : userToUpdate.prenom;
        userToUpdate.nom_famille = nom_famille !== undefined ? nom_famille : userToUpdate.nom_famille;
        if (role && req.user.role === 'admin') userToUpdate.role = role;
        if (mot_de_passe) userToUpdate.mot_de_passe_hash = mot_de_passe; // Le hook s'occupe du hashage

        await userToUpdate.save();
        const updatedUserResponse = { ...userToUpdate.get({ plain: true }) };
        delete updatedUserResponse.mot_de_passe_hash;
        res.json(updatedUserResponse);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
             return res.status(400).json({ message: 'Email ou nom d\'utilisateur déjà utilisé.' });
        }
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Accès refusé. Réservé aux administrateurs." });
        }
        const user = await User.findByPk(req.params.id);
        if (user) {
            if (user.id === req.user.id && user.role === 'admin') {
                return res.status(400).json({ message: "Un administrateur ne peut pas se supprimer lui-même." });
            }
            await user.destroy();
            res.json({ message: 'Utilisateur supprimé' });
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        next(error);
    }
};