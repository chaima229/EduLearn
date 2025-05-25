const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

class Certificate extends Model {}

Certificate.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cours_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'Cours',
            key: 'id',
        },
    },
    titre_certificat: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description_modele: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Certificate',
    tableName: 'Certificats',
    timestamps: false,
});

module.exports = Certificate;