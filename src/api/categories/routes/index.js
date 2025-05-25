// src/api/categories/routes/index.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controller');
const myCustomAuthMiddleware = require('../../../middleware/authMiddleware');

router.route('/')
    .post(myCustomAuthMiddleware, categoryController.createCategory) // Le contrôleur vérifie le rôle
    .get(categoryController.getAllCategories);

router.route('/:id')
    .get(categoryController.getCategoryById)
    .put(myCustomAuthMiddleware, categoryController.updateCategory) // Le contrôleur vérifie le rôle
    .delete(myCustomAuthMiddleware, categoryController.deleteCategory); // Le contrôleur vérifie le rôle

module.exports = router;