const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

class ForumTopic extends Model {}

ForumTopic.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cours_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Cours',
            key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    },
    utilisateur_id_createur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Utilisateurs',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    titre: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    date_creation: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    dernier_message_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'ForumTopic',
    tableName: 'ForumSujets',
    timestamps: false,
});

module.exports = ForumTopic;