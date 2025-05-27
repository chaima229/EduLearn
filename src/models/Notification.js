// models/Notification.js
module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', { // Nom du modèle Sequelize
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        utilisateur_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        type_notification: { // Ex: 'course_update', 'quiz_reminder', etc.
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        titre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        entite_liee_id: { // ID of the related entity (e.g., course_id, quiz_id)
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        type_entite_liee: { // Type of the related entity (e.g., 'course', 'quiz')
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        est_lu: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        date_creation: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    }, {
        tableName: 'Notifications', // Nom exact de votre table en BDD
        timestamps: false, // On gère `date_creation` manuellement
        // Vous pourriez ajouter `updatedAt: false` si vous n'en avez pas besoin
    });

    Notification.associate = function(models) {
        Notification.belongsTo(models.User, { // models.User est le nom de votre modèle User
            foreignKey: 'utilisateur_id',
            as: 'user' // ou 'recipient'
        });
        // Pas d'associations directes vers les entités liées ici pour garder simple
        // La logique de liaison se fera via entite_liee_id et type_entite_liee
    };

    return Notification;
};