module.exports = (sequelize, DataTypes) => {
    const ForumTopic = sequelize.define('ForumSujets', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        cours_id: {
            type: DataTypes.INTEGER,
            allowNull: true, // Un sujet peut être lié à un cours ou être général
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
            onDelete: 'CASCADE', // Ou SET NULL si on veut garder le sujet mais anonymiser
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
        tableName: 'ForumSujets',
        timestamps: true,
        createdAt: 'date_creation',
        updatedAt: 'dernier_message_date', // Sequelize mettra à jour ce champ si on le modifie explicitement.
                                         // Pour une mise à jour automatique basée sur un nouveau message,
                                         // il faudra un trigger en DB ou une logique applicative.
                                         // Pour simplifier, on peut le gérer manuellement lors de la création d'un message.
    });
    return ForumTopic;
};