const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import database connection from config
const { sequelize } = require('./config/database');

// Routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('SQLite database connection established successfully');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Import models
const db = require('./models');

// Sync all models with database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database & tables synced successfully');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Join a chat room
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });
  
  // Leave a chat room
  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room: ${roomId}`);
  });
  
  // Send message to a room
  socket.on('send_message', (data) => {
    io.to(data.roomId).emit('receive_message', data);
    
    // Save message to database
    require('./controllers/chatController').saveMessage(data);
  });
  
  // Create new topic/room
  socket.on('create_topic', (data) => {
    require('./controllers/chatController').createTopic(data)
      .then(topic => {
        io.emit('new_topic', topic);
      })
      .catch(err => {
        socket.emit('error', { message: 'Failed to create topic' });
      });
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../')));
  
  // Any route that is not an API route should be handled by the React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 