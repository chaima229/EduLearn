// src/api/notifications/routes/index.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controller'); // Le contrôleur que nous venons de créer
const myCustomAuthMiddleware = require('../../../middleware/authMiddleware');

// Obtenir toutes les notifications pour l'utilisateur courant
router.get('/my', myCustomAuthMiddleware, notificationController.getMyNotifications);

// Marquer toutes les notifications comme lues pour l'utilisateur courant
router.patch('/mark-all-read', myCustomAuthMiddleware, notificationController.markAllNotificationsAsRead);

// Marquer une notification spécifique comme lue
router.patch('/:notificationId/read', myCustomAuthMiddleware, notificationController.markNotificationAsRead);


module.exports = router;