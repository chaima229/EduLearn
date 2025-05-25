// src/api/courses/courseForumRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true }); // pour :courseId
const forumController = require('../forum/controller');
const myCustomAuthMiddleware = require('../../middleware/authMiddleware');

// POST /api/courses/:courseId/forum/topics  (Crée un sujet lié à ce cours)
// GET  /api/courses/:courseId/forum/topics  (Liste les sujets de ce cours)
router.route('/topics')
    .post(myCustomAuthMiddleware, forumController.createForumTopic)
    .get(forumController.getAllForumTopics); // Le contrôleur utilisera :courseId du req.params

module.exports = router;