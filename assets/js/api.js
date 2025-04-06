// Create a new file for API calls
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api';

// Auth API calls
const AuthAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },
  
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  },
  
  getUser: async (token) => {
    const response = await fetch(`${API_URL}/auth/user`, {
      headers: {
        'x-auth-token': token
      }
    });
    return response.json();
  }
};

// Chat API calls
const ChatAPI = {
  getTopics: async () => {
    const response = await fetch(`${API_URL}/chat/topics`);
    return response.json();
  },
  
  getMessages: async (topicId) => {
    const response = await fetch(`${API_URL}/chat/messages/${topicId}`);
    return response.json();
  }
};

// Export the API objects
window.AuthAPI = AuthAPI;
window.ChatAPI = ChatAPI; 