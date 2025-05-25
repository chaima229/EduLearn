const User = require('../../../models/User');

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { nom_utilisateur, email, mot_de_passe_hash, prenom, nom_famille, role } = req.body;
        const newUser = await User.create({ nom_utilisateur, email, mot_de_passe_hash, prenom, nom_famille, role });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error });
    }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error });
    }
};

// Update a user
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        const { nom_utilisateur, email, mot_de_passe_hash, prenom, nom_famille, role } = req.body;
        await user.update({ nom_utilisateur, email, mot_de_passe_hash, prenom, nom_famille, role });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur', error });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        await user.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error });
    }
};