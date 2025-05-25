// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../config'); // Assurez-vous que config.jwtSecret est la bonne clé de votre fichier de config

const myCustomAuthMiddleware = (req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Token requis pour l\'authentification' });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length).trim();
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => { // Utilisez config.jwtSecret
        if (err) {
            console.error("Erreur de vérification JWT dans middleware:", err);
            return res.status(401).json({ message: 'Token invalide ou expiré' });
        }
        req.user = decoded; // decoded contient { id: ..., role: ... } du payload du token
        next();
    });
};

module.exports = myCustomAuthMiddleware;