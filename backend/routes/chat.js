const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Get all topics
router.get('/topics', chatController.getAllTopics);

// Get messages for a specific topic
router.get('/messages/:topicId', chatController.getMessages);

module.exports = router; 