const Category = require('../../../models/Category');

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { nom_categorie, description } = req.body;
        const newCategory = await Category.create({ nom_categorie, description });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la catégorie', error });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des catégories', error });
    }
};

// Get a category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la catégorie', error });
    }
};

// Update a category
exports.updateCategory = async (req, res) => {
    try {
        const { nom_categorie, description } = req.body;
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }
        category.nom_categorie = nom_categorie || category.nom_categorie;
        category.description = description || category.description;
        await category.save();
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la catégorie', error });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }
        await category.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la catégorie', error });
    }
};