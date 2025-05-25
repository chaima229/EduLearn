// src/api/users/routes/index.js
const express = require('express');
const router = express.Router();
const userController = require('../controller');
const myCustomAuthMiddleware = require('../../../middleware/authMiddleware');
// Si vous implémentez 'authorize': const { authorize } = require('../../../middleware/authMiddleware');

router.route('/')
    .get(myCustomAuthMiddleware, userController.getAllUsers); // Le contrôleur vérifie le rôle admin

router.route('/:id')
    .get(myCustomAuthMiddleware, userController.getUserById)
    .put(myCustomAuthMiddleware, userController.updateUser)
    .delete(myCustomAuthMiddleware, userController.deleteUser); // Le contrôleur vérifie le rôle admin

module.exports = router;