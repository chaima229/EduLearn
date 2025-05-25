const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

class LessonProgress extends Model {}

LessonProgress.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    inscription_cours_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'InscriptionsCours',
            key: 'id',
        },
    },
    lecon_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Lecons',
            key: 'id',
        },
    },
    est_completee: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    date_completion: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'LessonProgress',
    tableName: 'ProgressionLecons',
    timestamps: false,
});

module.exports = LessonProgress;