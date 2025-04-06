const { Topic, Message, User } = require('../models');

// Get all topics
exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ message: 'Error fetching topics', error: error.message });
  }
};

// Create a new topic
exports.createTopic = async (data) => {
  try {
    const { name, description, icon, color, userId } = data;
    
    // Check if topic already exists
    const existingTopic = await Topic.findOne({ where: { name } });
    if (existingTopic) {
      throw new Error('Topic already exists');
    }
    
    const newTopic = await Topic.create({
      name,
      description,
      icon,
      color,
      createdBy: userId
    });
    
    return newTopic;
  } catch (error) {
    console.error('Error creating topic:', error);
    throw error;
  }
};

// Get messages for a topic
exports.getMessages = async (req, res) => {
  try {
    const { topicId } = req.params;
    const messages = await Message.findAll({
      where: { topicId },
      order: [['createdAt', 'ASC']],
      limit: 100
    });
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

// Save a message
exports.saveMessage = async (data) => {
  try {
    const { roomId, userId, senderName, text } = data;
    
    const newMessage = await Message.create({
      topicId: roomId,
      sender: userId,
      senderName,
      text
    });
    
    return newMessage;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}; 