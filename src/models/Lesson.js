const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

class Lesson extends Model {}

Lesson.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cours_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Cours',
            key: 'id',
        },
    },
    titre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contenu: {
        type: DataTypes.TEXT,
    },
    ordre: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    duree_estimee_min: {
        type: DataTypes.INTEGER,
    },
}, {
    sequelize,
    modelName: 'Lesson',
    tableName: 'Lecons',
    timestamps: true,
    createdAt: 'date_creation',
    updatedAt: 'date_mise_a_jour',
});

module.exports = Lesson;