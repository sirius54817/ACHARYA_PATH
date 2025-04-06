// Community Chat Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!localStorage.getItem('isLoggedIn')) {
        // Fix the path to login page - using user folder instead of public
        let loginPath;
        if (window.location.pathname.includes('/pages/user/')) {
            loginPath = 'login.html'; // Login page is in the same user folder
        } else {
            loginPath = 'pages/user/login.html';
        }
        
        window.location.href = loginPath + '?redirect=' + encodeURIComponent(window.location.href);
        return;
    }
    
    // DOM Elements
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const chatMessages = document.getElementById('chatMessages');
    const currentTopicElement = document.getElementById('currentTopic');
    const topicsList = document.getElementById('topicsList');
    const createTopicForm = document.getElementById('createTopicForm');
    const saveTopicBtn = document.getElementById('saveTopicBtn');
    
    // Connect to Socket.io server
    // Determine the correct Socket.io server URL based on environment
    const socketUrl = window.location.hostname === 'localhost' ? 
                     'http://localhost:5000' : 
                     window.location.origin;
    
    const socket = io(socketUrl);
    
    // Current user info
    const userId = localStorage.getItem('userId') || 'anonymous';
    const userName = localStorage.getItem('userName') || 'User';
    
    // Current topic
    let currentTopic = 'general';
    let topics = [];
    
    // Connect to socket
    socket.on('connect', () => {
        console.log('Connected to server');
        
        // Join default room
        socket.emit('join_room', currentTopic);
        
        // Fetch topics and messages
        fetchTopics();
        fetchMessages(currentTopic);
    });
    
    // Socket event handlers
    socket.on('receive_message', (data) => {
        if (data.roomId === currentTopic) {
            addMessageToChat(data);
        }
    });
    
    socket.on('new_topic', (topic) => {
        topics.push(topic);
        addTopicToList(topic);
    });
    
    socket.on('error', (error) => {
        showToast(error.message, 'danger');
    });
    
    // Fetch all topics
    function fetchTopics() {
        // Try to use the API if available
        if (window.ChatAPI && window.ChatAPI.getTopics) {
            window.ChatAPI.getTopics()
                .then(data => {
                    topics = data;
                    renderTopics();
                })
                .catch(error => {
                    console.error('Error fetching topics:', error);
                    useFallbackTopics();
                });
        } else {
            // Fallback to direct fetch
            fetch('/api/chat/topics')
                .then(response => response.json())
                .then(data => {
                    topics = data;
                    renderTopics();
                })
                .catch(error => {
                    console.error('Error fetching topics:', error);
                    useFallbackTopics();
                });
        }
    }
    
    // Use fallback topics if API fails
    function useFallbackTopics() {
        topics = [
            { _id: 'general', name: 'General Discussion', icon: 'fas fa-comments', color: '#0d6efd' },
            { _id: 'programming', name: 'Programming', icon: 'fas fa-code', color: '#198754' },
            { _id: 'design', name: 'Design', icon: 'fas fa-palette', color: '#dc3545' },
            { _id: 'business', name: 'Business', icon: 'fas fa-briefcase', color: '#fd7e14' },
            { _id: 'education', name: 'Education', icon: 'fas fa-graduation-cap', color: '#6f42c1' }
        ];
        renderTopics();
    }
    
    // Render topics in sidebar
    function renderTopics() {
        topicsList.innerHTML = '';
        
        topics.forEach(topic => {
            addTopicToList(topic);
        });
        
        // Add "Create New Topic" button
        const createTopicItem = document.createElement('li');
        createTopicItem.className = 'list-group-item d-flex align-items-center create-topic-item';
        createTopicItem.innerHTML = `
            <i class="fas fa-plus-circle me-2"></i>
            <span>Create New Topic</span>
        `;
        
        createTopicItem.addEventListener('click', function() {
            const createTopicModal = new bootstrap.Modal(document.getElementById('createTopicModal'));
            createTopicModal.show();
        });
        
        topicsList.appendChild(createTopicItem);
        
        // Set current topic
        setCurrentTopic(currentTopic);
    }
    
    // Add a topic to the sidebar
    function addTopicToList(topic) {
        const topicItem = document.createElement('li');
        topicItem.className = 'list-group-item d-flex align-items-center topic-item';
        topicItem.dataset.topicId = topic._id;
        
        if (topic._id === currentTopic) {
            topicItem.classList.add('active');
        }
        
        topicItem.innerHTML = `
            <i class="${topic.icon} me-2" style="color: ${topic.color}"></i>
            <span>${topic.name}</span>
        `;
        
        topicItem.addEventListener('click', function() {
            setCurrentTopic(topic._id);
        });
        
        topicsList.appendChild(topicItem);
    }
    
    // Set current topic and load messages
    function setCurrentTopic(topicId) {
        // Leave previous room
        socket.emit('leave_room', currentTopic);
        
        // Update current topic
        currentTopic = topicId;
        
        // Join new room
        socket.emit('join_room', currentTopic);
        
        // Update UI
        const topicItems = document.querySelectorAll('.topic-item');
        topicItems.forEach(item => {
            if (item.dataset.topicId === topicId) {
                item.classList.add('active');
                
                // Update current topic display
                const topic = topics.find(t => t._id === topicId);
                if (topic && currentTopicElement) {
                    currentTopicElement.innerHTML = `
                        <i class="${topic.icon} me-2" style="color: ${topic.color}"></i>
                        ${topic.name}
                    `;
                }
            } else {
                item.classList.remove('active');
            }
        });
        
        // Clear messages
        chatMessages.innerHTML = '';
        
        // Fetch messages for new topic
        fetchMessages(topicId);
    }
    
    // Fetch messages for a topic
    function fetchMessages(topicId) {
        // Try to use the API if available
        if (window.ChatAPI && window.ChatAPI.getMessages) {
            window.ChatAPI.getMessages(topicId)
                .then(data => {
                    // Display messages
                    data.forEach(message => {
                        addMessageToChat({
                            senderName: message.senderName,
                            text: message.text,
                            time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            own: message.sender === userId
                        });
                    });
                })
                .catch(error => {
                    console.error('Error fetching messages:', error);
                    // Use sample messages as fallback
                    useFallbackMessages(topicId);
                });
        } else {
            // Fallback to direct fetch
            fetch(`/api/chat/messages/${topicId}`)
                .then(response => response.json())
                .then(data => {
                    // Display messages
                    data.forEach(message => {
                        addMessageToChat({
                            senderName: message.senderName,
                            text: message.text,
                            time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            own: message.sender === userId
                        });
                    });
                })
                .catch(error => {
                    console.error('Error fetching messages:', error);
                    // Use sample messages as fallback
                    useFallbackMessages(topicId);
                });
        }
    }
    
    // Use fallback messages if API fails
    function useFallbackMessages(topicId) {
        const sampleMessages = {
            general: [
                { sender: 'John Doe', time: '10:15 AM', text: 'Hello everyone! Welcome to the General Discussion chat room.', own: false },
                { sender: 'Jane Smith', time: '10:17 AM', text: 'Hi John! Thanks for starting this chat. I\'m excited to connect with everyone here.', own: false },
                { sender: userName, time: '10:20 AM', text: 'Hello everyone! I\'m new here. Looking forward to learning and sharing with all of you.', own: true },
                { sender: 'Michael Johnson', time: '10:22 AM', text: 'Welcome! What are you all studying or working on currently?', own: false }
            ],
            programming: [
                { sender: 'Robert Wilson', time: '09:30 AM', text: 'Has anyone tried the new JavaScript framework?', own: false },
                { sender: 'Emily Davis', time: '09:32 AM', text: 'Yes, I\'ve been using it for a week now. It\'s pretty good!', own: false },
                { sender: userName, time: '09:35 AM', text: 'I\'m still learning the basics of JavaScript. Any resources you recommend?', own: true },
                { sender: 'Robert Wilson', time: '09:37 AM', text: 'Check out MDN Web Docs and freeCodeCamp. They\'re great for beginners!', own: false }
            ],
            design: [
                { sender: 'Sophia Lee', time: '11:05 AM', text: 'What design tools is everyone using these days?', own: false },
                { sender: userName, time: '11:08 AM', text: 'I\'ve been using Figma for most of my projects. It\'s really collaborative.', own: true },
                { sender: 'Daniel Brown', time: '11:10 AM', text: 'Figma is great! I also use Adobe XD occasionally.', own: false },
                { sender: 'Sophia Lee', time: '11:12 AM', text: 'Thanks for the input! I\'ve been thinking about switching from Sketch.', own: false }
            ],
            business: [
                { sender: 'William Taylor', time: '02:15 PM', text: 'Anyone here running their own startup?', own: false },
                { sender: 'Olivia Martinez', time: '02:18 PM', text: 'Yes, I launched my e-commerce business last year.', own: false },
                { sender: userName, time: '02:20 PM', text: 'I\'m planning to start a tech consulting business after graduation.', own: true },
                { sender: 'William Taylor', time: '02:22 PM', text: 'That\'s great! Let me know if you need any advice on getting started.', own: false }
            ],
            education: [
                { sender: 'David Wilson', time: '03:45 PM', text: 'What are you all studying?', own: false },
                { sender: userName, time: '03:47 PM', text: 'I\'m studying Computer Science. Currently in my second year.', own: true },
                { sender: 'Emma Thompson', time: '03:50 PM', text: 'I\'m doing a Master\'s in Data Science.', own: false },
                { sender: 'David Wilson', time: '03:52 PM', text: 'Nice! I\'m finishing up my PhD in AI.', own: false }
            ]
        };
        
        // Display sample messages for the current topic
        const messages = sampleMessages[topicId] || sampleMessages.general;
        messages.forEach(message => {
            addMessageToChat({
                senderName: message.sender,
                text: message.text,
                time: message.time,
                own: message.own
            });
        });
    }
    
    // Add message to chat
    function addMessageToChat(data) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${data.own ? 'message-own' : 'message-other'}`;
        
        messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">${data.senderName}</span>
                    <span class="message-time">${data.time}</span>
                </div>
                <div class="message-text">${data.text}</div>
            </div>
        `;
        
        chatMessages.appendChild(messageElement);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Send message
    function sendMessage() {
        const text = messageInput.value.trim();
        
        if (!text) return;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Emit message to server
        socket.emit('send_message', {
            roomId: currentTopic,
            userId: userId,
            senderName: userName,
            text: text,
            time: time
        });
        
        // Add message to chat (optimistic UI update)
        addMessageToChat({
            senderName: userName,
            text: text,
            time: time,
            own: true
        });
        
        // Clear input
        messageInput.value = '';
    }
    
    // Create new topic
    function createTopic(e) {
        e.preventDefault();
        
        const name = document.getElementById('topicName').value.trim();
        const description = document.getElementById('topicDescription').value.trim();
        const icon = document.getElementById('topicIcon').value;
        const color = document.getElementById('topicColor').value;
        
        if (!name || !description || !icon) {
            showToast('Please fill all required fields', 'warning');
            return;
        }
        
        // Emit create topic event
        socket.emit('create_topic', {
            name,
            description,
            icon,
            color,
            userId
        });
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('createTopicModal'));
        modal.hide();
        
        // Reset form
        createTopicForm.reset();
    }
    
    // Show toast notification
    function showToast(message, type = 'info') {
        const toastEl = document.getElementById('chatToast');
        const toastBody = document.getElementById('chatToastBody');
        
        if (toastEl && toastBody) {
            // Set toast type
            toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
            
            // Set message
            toastBody.textContent = message;
            
            // Show toast
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        }
    }
    
    // Event listeners
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', sendMessage);
    }
    
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    if (saveTopicBtn) {
        saveTopicBtn.addEventListener('click', createTopic);
    }
});