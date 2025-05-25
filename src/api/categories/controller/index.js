// src/api/categories/controller/index.js
const { CategoryCourse } = require('../../../models');

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin ou Instructeur
exports.createCategory = async (req, res, next) => {
    const { nom_categorie, description } = req.body;
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'instructeur') {
            return res.status(403).json({ message: "Accès refusé." });
        }
        const newCategory = await CategoryCourse.create({ nom_categorie, description });
        res.status(201).json(newCategory);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Cette catégorie existe déjà.' });
        }
        next(error);
    }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await CategoryCourse.findAll();
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = async (req, res, next) => {
    try {
        const category = await CategoryCourse.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Catégorie non trouvée." });
        }
        res.json(category);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin ou Instructeur
exports.updateCategory = async (req, res, next) => {
    const { nom_categorie, description } = req.body;
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'instructeur') {
            return res.status(403).json({ message: "Accès refusé." });
        }
        const category = await CategoryCourse.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Catégorie non trouvée." });
        }
        category.nom_categorie = nom_categorie || category.nom_categorie;
        category.description = description !== undefined ? description : category.description;
        await category.save();
        res.json(category);
    } catch (error) {
         if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Ce nom de catégorie est déjà utilisé.' });
        }
        next(error);
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Accès refusé. Réservé aux administrateurs." });
        }
        const category = await CategoryCourse.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Catégorie non trouvée." });
        }
        await category.destroy();
        res.json({ message: "Catégorie supprimée avec succès." });
    } catch (error) {
        next(error);
    }
};