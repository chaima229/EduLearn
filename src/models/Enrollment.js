const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

class Enrollment extends Model {}

Enrollment.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    utilisateur_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Utilisateurs',
            key: 'id',
        },
    },
    cours_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Cours',
            key: 'id',
        },
    },
    date_inscription: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    progression_pourcentage: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0.00,
    },
    date_achevement: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Enrollment',
    tableName: 'InscriptionsCours',
    timestamps: false,
});

module.exports = Enrollment;