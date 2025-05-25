const express = require('express');
const router = express.Router();
const forumController = require('../controller/index');

// Routes for forum topics
router.post('/topics', forumController.createTopic); // Create a new forum topic
router.get('/topics', forumController.getAllTopics); // Get all forum topics
router.get('/topics/:id', forumController.getTopicById); // Get a specific forum topic by ID
router.put('/topics/:id', forumController.updateTopic); // Update a specific forum topic by ID
router.delete('/topics/:id', forumController.deleteTopic); // Delete a specific forum topic by ID

// Routes for forum messages
router.post('/messages', forumController.createMessage); // Create a new forum message
router.get('/messages', forumController.getAllMessages); // Get all forum messages
router.get('/messages/:id', forumController.getMessageById); // Get a specific forum message by ID
router.put('/messages/:id', forumController.updateMessage); // Update a specific forum message by ID
router.delete('/messages/:id', forumController.deleteMessage); // Delete a specific forum message by ID

module.exports = router;