const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nom_utilisateur: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    mot_de_passe_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    prenom: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    nom_famille: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM('etudiant', 'instructeur', 'admin'),
        allowNull: false,
        defaultValue: 'etudiant',
    },
    date_inscription: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    derniere_connexion: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'Utilisateurs',
    timestamps: false,
});

module.exports = User;