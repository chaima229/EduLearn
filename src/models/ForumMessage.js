module.exports = (sequelize, DataTypes) => {
    const ForumMessage = sequelize.define('ForumMessages', {
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
            onDelete: 'CASCADE', // Ou SET NULL pour anonymiser
            onUpdate: 'CASCADE',
        },
        contenu_message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        date_creation: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        message_parent_id: { // Pour les réponses imbriquées
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'ForumMessages', // Auto-référence
                key: 'id',
            },
            onDelete: 'CASCADE', // Si un message parent est supprimé, ses enfants aussi
            onUpdate: 'CASCADE',
        },
    }, {
        tableName: 'ForumMessages',
        timestamps: true,
        createdAt: 'date_creation',
        updatedAt: false, // Pas de champ updatedAt défini dans le schéma SQL
    });
    return ForumMessage;
};