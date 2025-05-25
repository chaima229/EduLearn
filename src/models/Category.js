const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

class Category extends Model {}

Category.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nom_categorie: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Category',
    tableName: 'CategoriesCours',
    timestamps: false,
});

module.exports = Category;