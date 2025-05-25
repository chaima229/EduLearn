const User = require('../../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    const { nom_utilisateur, email, mot_de_passe, prenom, nom_famille, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
        const newUser = await User.create({
            nom_utilisateur,
            email,
            mot_de_passe_hash: hashedPassword,
            prenom,
            nom_famille,
            role
        });

        res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error });
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, mot_de_passe } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Connexion réussie', token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion', error });
    }
};