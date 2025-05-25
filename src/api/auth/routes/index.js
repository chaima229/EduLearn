const express = require('express');
const router = express.Router();
const authController = require('../controller/index');

// Route for user registration
router.post('/register', authController.register);

// Route for user login
router.post('/login', authController.login);

// Route for user logout
router.post('/logout', authController.logout);

// Export the router
module.exports = router;