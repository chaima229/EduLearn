// src/api/forum/routes/index.js
const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams si c'est imbriqué
const forumController = require('../controller'); // ou la déstructuration
const myCustomAuthMiddleware = require('../../../middleware/authMiddleware'); // ou un autre middleware si pertinent

console.log('--- Dans forum/routes ---');
console.log('Type of myCustomAuthMiddleware:', typeof myCustomAuthMiddleware); // Si vous l'utilisez

// Si vous importez tout l'objet controller:
console.log('forumController:', forumController);
// Remplacez 'nomDeLaFonctionUtiliseeALaLigne14' par le vrai nom de la fonction du contrôleur
console.log('Type of forumController.nomDeLaFonctionUtiliseeALaLigne14:', typeof forumController.nomDeLaFonctionUtiliseeALaLigne14);

// Si vous déstructurez le controller:
// const { getTopics, createTopic } = require('../controller');
// console.log('Type of getTopics from import:', typeof getTopics); // Exemple

// Ligne 14 (ou la vôtre qui cause l'erreur)
// Exemple: router.get('/topics', forumController.getTopics);
// Exemple: router.get('/topics/:topicId/messages', myCustomAuthMiddleware, forumController.getMessagesForTopic);

module.exports = router;