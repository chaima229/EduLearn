const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

class ForumMessage extends Model {}

ForumMessage.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    sujet_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ForumSujets',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    utilisateur_id_auteur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Utilisateurs',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    contenu_message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    date_creation: {
        type: DataTypes.TIMESTAMP,
        defaultValue: DataTypes.NOW,
    },
    message_parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'ForumMessages',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
}, {
    sequelize,
    modelName: 'ForumMessage',
    tableName: 'ForumMessages',
    timestamps: false,
});

module.exports = ForumMessage;