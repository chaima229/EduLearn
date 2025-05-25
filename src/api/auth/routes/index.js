// src/api/auth/routes/index.js
const express = require('express');
const router = express.Router();
const authController = require('../controller');
const myCustomAuthMiddleware = require('../../../middleware/authMiddleware'); // Renommez l'import pour plus de clarté

// ... vos console.log pour débogage ...
console.log('Type of myCustomAuthMiddleware:', typeof myCustomAuthMiddleware); // Devrait afficher 'function'

router.post('/register', authController.register);
router.post('/login', authController.login);
// Utilisez le middleware que vous avez importé directement
router.get('/me', myCustomAuthMiddleware, authController.getMe);

module.exports = router;