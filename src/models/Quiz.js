const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

class Quiz extends Model {}

Quiz.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    lecon_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Lecons',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    cours_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Cours',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    titre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    seuil_reussite_pourcentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Quiz',
    tableName: 'Quiz',
    timestamps: false,
});

module.exports = Quiz;