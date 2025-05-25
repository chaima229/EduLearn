// src/api/forum/routes/index.js
const express = require('express');
const router = express.Router();
const forumController = require('../controller');
const myCustomAuthMiddleware = require('../../../middleware/authMiddleware');

// Routes pour les Sujets (Topics)
router.route('/topics')
    .post(myCustomAuthMiddleware, forumController.createForumTopic) // Pour les sujets généraux
    .get(forumController.getAllForumTopics); // Liste tous les sujets (ou filtre si pas de courseId)

router.route('/topics/:topicId')
    .get(forumController.getForumTopicById) // Récupère un sujet et ses messages
    .delete(myCustomAuthMiddleware, forumController.deleteForumTopic); // Supprime un sujet

// Route pour poster un message dans un sujet
router.post('/topics/:topicId/messages', myCustomAuthMiddleware, forumController.postForumMessage);

// Routes pour les Messages (accès direct par ID de message)
router.route('/messages/:messageId')
    .put(myCustomAuthMiddleware, forumController.updateForumMessage)
    .delete(myCustomAuthMiddleware, forumController.deleteForumMessage);

// Note: la création de sujets et la liste des sujets liés à un cours
// devraient être gérées via des routes imbriquées sous /courses
// Exemple pour `api/courses/routes/index.js`:
// const courseForumRoutes = require('./courseForumRoutes'); // À créer
// router.use('/:courseId/forum', courseForumRoutes);

module.exports = router;