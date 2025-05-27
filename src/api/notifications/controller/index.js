// src/api/notifications/controller/index.js
const { Notification, User } = require('../../../models'); // Assurez-vous que Notification est le nom du modèle Sequelize
const { Op } = require('sequelize');

// @desc    Get all notifications for the current user
// @route   GET /api/notifications/my
// @access  Private
exports.getMyNotifications = async (req, res, next) => {
    const utilisateur_id = req.user.id; // Depuis le middleware d'authentification

    try {
        const notifications = await Notification.findAll({
            where: { utilisateur_id: utilisateur_id },
            order: [['date_creation', 'DESC']], // Les plus récentes en premier
            // include: [{ model: User, as: 'user', attributes: ['nom_utilisateur'] }] // Optionnel, si besoin
        });
        res.json(notifications);
    } catch (error) {
        console.error("Erreur getMyNotifications:", error);
        next(error);
    }
};

// @desc    Mark a single notification as read
// @route   PATCH /api/notifications/:notificationId/read
// @access  Private
exports.markNotificationAsRead = async (req, res, next) => {
    const utilisateur_id = req.user.id;
    const { notificationId } = req.params;

    try {
        const notification = await Notification.findOne({
            where: { id: notificationId, utilisateur_id: utilisateur_id }
        });

        if (!notification) {
            return res.status(404).json({ message: "Notification non trouvée ou non autorisée." });
        }

        if (notification.est_lu) {
            return res.json({ message: "Notification déjà marquée comme lue.", notification });
        }

        notification.est_lu = true;
        await notification.save();

        res.json({ message: "Notification marquée comme lue.", notification });
    } catch (error) {
        console.error("Erreur markNotificationAsRead:", error);
        next(error);
    }
};

// @desc    Mark all notifications as read for the current user
// @route   PATCH /api/notifications/mark-all-read
// @access  Private
exports.markAllNotificationsAsRead = async (req, res, next) => {
    const utilisateur_id = req.user.id;

    try {
        const [updatedCount] = await Notification.update(
            { est_lu: true },
            { where: { utilisateur_id: utilisateur_id, est_lu: false } }
        );

        res.json({ message: `${updatedCount} notifications marquées comme lues.` });
    } catch (error) {
        console.error("Erreur markAllNotificationsAsRead:", error);
        next(error);
    }
};