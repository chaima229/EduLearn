const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

class Course extends Model {}

Course.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    titre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    instructeur_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Utilisateurs',
            key: 'id',
        },
    },
    categorie_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'CategoriesCours',
            key: 'id',
        },
    },
    niveau_difficulte: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image_url_couverture: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    est_publie: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    date_creation: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    date_mise_a_jour: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'Course',
    tableName: 'Cours',
    timestamps: false,
});

module.exports = Course;