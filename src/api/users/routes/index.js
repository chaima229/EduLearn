const express = require('express');
const router = express.Router();
const userController = require('../controller/index');

// Routes for user management
router.post('/', userController.createUser); // Create a new user
router.get('/', userController.getAllUsers); // Get all users
router.get('/:id', userController.getUserById); // Get a user by ID
router.put('/:id', userController.updateUser); // Update a user by ID
router.delete('/:id', userController.deleteUser); // Delete a user by ID

module.exports = router;