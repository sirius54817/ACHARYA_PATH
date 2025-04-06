// ACHARYA Chatbot using Gemini API
class AcharyaBot {
    constructor() {
        this.apiKey = 'AIzaSyDaZlI64SjY8Ta0IKD-r2sExulEEnCHBPk';
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        this.chatHistory = [];
        this.isOpen = false;
        this.isMinimized = false;
        this.createChatbotUI();
        this.attachEventListeners();
    }

    createChatbotUI() {
        // Create chatbot container
        const chatbotHTML = `
            <div id="acharya-chatbot" class="acharya-chatbot">
                <div class="acharya-header">
                    <div class="acharya-title">
                        <i class="fas fa-robot me-2"></i>
                        <span>ACHARYA Assistant</span>
                    </div>
                    <div class="acharya-controls">
                        <button id="acharya-minimize" class="acharya-control-btn">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button id="acharya-close" class="acharya-control-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div id="acharya-body" class="acharya-body">
                    <div id="acharya-messages" class="acharya-messages">
                        <div class="acharya-message acharya-bot-message">
                            <div class="acharya-message-content">
                                <p>Hello! I'm ACHARYA, your personal assistant. How can I help you today?</p>
                            </div>
                        </div>
                    </div>
                    <div class="acharya-input-container">
                        <textarea id="acharya-input" class="acharya-input" placeholder="Type your message here..." rows="1"></textarea>
                        <button id="acharya-send" class="acharya-send-btn">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
            <button id="acharya-toggle" class="acharya-toggle-btn">
                <i class="fas fa-comment-dots"></i>
            </button>
        `;

        // Add chatbot HTML to the body
        const chatbotContainer = document.createElement('div');
        chatbotContainer.innerHTML = chatbotHTML;
        document.body.appendChild(chatbotContainer);

        // Add chatbot styles
        const chatbotStyles = `
            .acharya-chatbot {
                position: fixed;
                bottom: 80px;
                right: 20px;
                width: 350px;
                height: 500px;
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
                display: flex;
                flex-direction: column;
                z-index: 9999;
                overflow: hidden;
                transition: all 0.3s ease;
                opacity: 0;
                transform: translateY(20px);
                pointer-events: none;
            }
            
            .acharya-chatbot.open {
                opacity: 1;
                transform: translateY(0);
                pointer-events: all;
            }
            
            .acharya-chatbot.minimized {
                height: 60px;
            }
            
            .acharya-header {
                background-color: #3a3a3a;
                color: white;
                padding: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
            }
            
            .acharya-title {
                display: flex;
                align-items: center;
                font-weight: bold;
            }
            
            .acharya-controls {
                display: flex;
            }
            
            .acharya-control-btn {
                background: none;
                border: none;
                color: white;
                margin-left: 10px;
                cursor: pointer;
                font-size: 14px;
            }
            
            .acharya-body {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            
            .acharya-messages {
                flex: 1;
                overflow-y: auto;
                padding: 15px;
            }
            
            .acharya-message {
                margin-bottom: 15px;
                max-width: 80%;
            }
            
            .acharya-bot-message {
                margin-right: auto;
            }
            
            .acharya-user-message {
                margin-left: auto;
            }
            
            .acharya-message-content {
                padding: 10px 15px;
                border-radius: 10px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
            
            .acharya-bot-message .acharya-message-content {
                background-color: #f0f0f0;
            }
            
            .acharya-user-message .acharya-message-content {
                background-color: #3a3a3a;
                color: white;
            }
            
            .acharya-input-container {
                display: flex;
                padding: 10px;
                border-top: 1px solid #e0e0e0;
            }
            
            .acharya-input {
                flex: 1;
                border: none;
                padding: 10px;
                border-radius: 20px;
                background-color: #f0f0f0;
                resize: none;
                outline: none;
            }
            
            .acharya-send-btn {
                background-color: #3a3a3a;
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-left: 10px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .acharya-toggle-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background-color: #3a3a3a;
                color: white;
                border: none;
                border-radius: 50%;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                cursor: pointer;
                z-index: 9998;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
            }
            
            .acharya-typing {
                display: flex;
                padding: 5px 10px;
                background-color: #f0f0f0;
                border-radius: 10px;
                margin-bottom: 15px;
                width: fit-content;
            }
            
            .acharya-typing-dot {
                width: 8px;
                height: 8px;
                background-color: #777;
                border-radius: 50%;
                margin: 0 2px;
                animation: typing-dot 1.4s infinite ease-in-out;
            }
            
            .acharya-typing-dot:nth-child(1) {
                animation-delay: 0s;
            }
            
            .acharya-typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .acharya-typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }
            
            @keyframes typing-dot {
                0%, 60%, 100% {
                    transform: translateY(0);
                }
                30% {
                    transform: translateY(-5px);
                }
            }
            
            /* Dark mode support */
            [data-theme="dark"] .acharya-chatbot {
                background-color: #2c2c2c;
                box-shadow: 0 5px 25px rgba(0, 0, 0, 0.4);
            }
            
            [data-theme="dark"] .acharya-header {
                background-color: #444444;
            }
            
            [data-theme="dark"] .acharya-input {
                background-color: #3a3a3a;
                color: #f0f0f0;
            }
            
            [data-theme="dark"] .acharya-bot-message .acharya-message-content {
                background-color: #444444;
                color: #f0f0f0;
            }
            
            [data-theme="dark"] .acharya-user-message .acharya-message-content {
                background-color: #666666;
            }
            
            [data-theme="dark"] .acharya-typing {
                background-color: #444444;
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = chatbotStyles;
        document.head.appendChild(styleElement);
    }

    attachEventListeners() {
        // Toggle chatbot visibility
        document.getElementById('acharya-toggle').addEventListener('click', () => {
            this.toggleChatbot();
        });

        // Close chatbot
        document.getElementById('acharya-close').addEventListener('click', () => {
            this.closeChatbot();
        });

        // Minimize chatbot
        document.getElementById('acharya-minimize').addEventListener('click', () => {
            this.minimizeChatbot();
        });

        // Header click to toggle minimize
        document.querySelector('.acharya-header').addEventListener('click', (e) => {
            if (!e.target.closest('.acharya-control-btn')) {
                this.minimizeChatbot();
            }
        });

        // Send message
        document.getElementById('acharya-send').addEventListener('click', () => {
            this.sendMessage();
        });

        // Send message on Enter (but allow Shift+Enter for new line)
        document.getElementById('acharya-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        document.getElementById('acharya-input').addEventListener('input', (e) => {
            const textarea = e.target;
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        });
    }

    toggleChatbot() {
        const chatbot = document.getElementById('acharya-chatbot');
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            chatbot.classList.add('open');
            if (this.isMinimized) {
                chatbot.classList.add('minimized');
            } else {
                chatbot.classList.remove('minimized');
            }
        } else {
            chatbot.classList.remove('open');
        }
    }

    closeChatbot() {
        const chatbot = document.getElementById('acharya-chatbot');
        this.isOpen = false;
        chatbot.classList.remove('open');
    }

    minimizeChatbot() {
        const chatbot = document.getElementById('acharya-chatbot');
        this.isMinimized = !this.isMinimized;
        
        if (this.isMinimized) {
            chatbot.classList.add('minimized');
        } else {
            chatbot.classList.remove('minimized');
        }
    }

    async sendMessage() {
        const input = document.getElementById('acharya-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Clear input
        input.value = '';
        input.style.height = 'auto';
        
        // Add user message to chat
        this.addMessage(message, true);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get response from Gemini API
            const response = await this.getGeminiResponse(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add bot response to chat
            this.addMessage(response, false);
        } catch (error) {
            console.error('Error getting response from Gemini:', error);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add error message
            this.addMessage('Sorry, I encountered an error. Please try again later.', false);
        }
    }

    addMessage(text, isUser) {
        const messagesContainer = document.getElementById('acharya-messages');
        const messageElement = document.createElement('div');
        
        messageElement.className = `acharya-message ${isUser ? 'acharya-user-message' : 'acharya-bot-message'}`;
        
        messageElement.innerHTML = `
            <div class="acharya-message-content">
                <p>${this.formatMessage(text)}</p>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Add to chat history
        this.chatHistory.push({
            role: isUser ? 'user' : 'assistant',
            content: text
        });
    }

    formatMessage(text) {
        // Convert URLs to links
        text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        
        // Convert line breaks to <br>
        text = text.replace(/\n/g, '<br>');
        
        return text;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('acharya-messages');
        const typingElement = document.createElement('div');
        
        typingElement.id = 'acharya-typing';
        typingElement.className = 'acharya-typing';
        
        typingElement.innerHTML = `
            <div class="acharya-typing-dot"></div>
            <div class="acharya-typing-dot"></div>
            <div class="acharya-typing-dot"></div>
        `;
        
        messagesContainer.appendChild(typingElement);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingElement = document.getElementById('acharya-typing');
        if (typingElement) {
            typingElement.remove();
        }
    }

    async getGeminiResponse(message) {
        const url = `${this.apiEndpoint}?key=${this.apiKey}`;
        
        // Prepare the request payload
        const payload = {
            contents: [{
                parts: [{ text: message }]
            }]
        };
        
        // Make the API request
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract the response text
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Invalid response format from Gemini API');
        }
    }
}

// Initialize the chatbot when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a moment before initializing to ensure all other scripts have loaded
    setTimeout(() => {
        window.acharyaBot = new AcharyaBot();
    }, 1000);
}); 