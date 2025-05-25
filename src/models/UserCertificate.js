const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class UserCertificate extends Model {}

UserCertificate.init({
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
    certificat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Certificats',
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
    date_obtention: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    url_certificat_genere: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'UserCertificate',
    tableName: 'CertificatsUtilisateur',
    timestamps: false,
});

module.exports = UserCertificate;