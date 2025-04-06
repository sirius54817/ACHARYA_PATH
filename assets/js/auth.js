/**
 * Authentication functions for AChart Path
 * Handles user registration, login, and token management
 */

// API base URL - change this if your backend is hosted elsewhere
const API_URL = 'http://localhost:5000/api';

/**
 * Register a new user
 * @param {Object} userData - User data including name, email and password
 * @returns {Promise} - Promise resolving to the user data and token
 */
async function registerUser(userData) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

/**
 * Login user
 * @param {Object} credentials - User credentials including email and password
 * @returns {Promise} - Promise resolving to the user data and token
 */
async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Get current user information
 * @returns {Promise} - Promise resolving to the user data
 */
async function getCurrentUser() {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch(`${API_URL}/auth/user`, {
      headers: {
        'x-auth-token': token
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get user data');
    }
    
    return data;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
}

/**
 * Store user session data
 * @param {Object} data - Data containing user and token
 */
function storeUserSession(data) {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('token', data.token);
  localStorage.setItem('userId', data.user.id);
  localStorage.setItem('userName', data.user.name);
  localStorage.setItem('userEmail', data.user.email);
  localStorage.setItem('userRole', data.user.role || 'user');
}

/**
 * Clear user session data on logout
 */
function clearUserSession() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');
}

/**
 * Check if user is logged in
 * @returns {Boolean} - Whether user is logged in
 */
function isLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true' && 
         localStorage.getItem('token') !== null;
}

/**
 * Redirect to login if not authenticated
 * @param {String} redirectUrl - URL to redirect to after login
 */
function requireAuth(redirectUrl = window.location.href) {
  if (!isLoggedIn()) {
    window.location.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
    return false;
  }
  return true;
}

/**
 * Check if the current page is a login or registration page
 * @returns {Boolean} - Whether the current page is a login/register page
 */
function isAuthPage() {
  const path = window.location.pathname.toLowerCase();
  return path.includes('/login.html') || path.includes('/register.html');
}

// Authentication check
function checkAuth() {
    // Skip authentication check for login and register pages
    if (isAuthPage()) {
        return true;
    }
    
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        // Redirect to login page in the user folder
        let loginPath;
        if (window.location.pathname.includes('/pages/user/')) {
            loginPath = 'login.html';
        } else if (window.location.pathname.includes('/pages/')) {
            loginPath = 'user/login.html';
        } else {
            loginPath = 'pages/user/login.html';
        }
        
        window.location.href = loginPath + '?redirect=' + encodeURIComponent(window.location.href);
        return false;
    }
    return true;
}

// Get correct path based on current location - FIXED VERSION
function getCorrectPath(path) {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // If we're in the user folder, we need to adjust the path
    if (window.location.pathname.includes('/pages/user/')) {
        return '../../' + cleanPath;
    } else if (window.location.pathname.includes('/pages/')) {
        return '../' + cleanPath;
    }
    return cleanPath;
}

// Set user name in UI
function setUserName() {
    const userName = localStorage.getItem('userName') || 'User';
    const userNameElements = document.querySelectorAll('#userName, #welcomeUserName');
    
    userNameElements.forEach(element => {
        if (element) {
            element.textContent = userName;
        }
    });
}

// Setup logout functionality
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

// Logout function
function logout() {
    // Clear user data from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    
    // Redirect to home page - use absolute path to avoid issues
    window.location.href = '/';
}

// Setup role-based UI elements
function setupRoleBasedUI() {
    const userRole = localStorage.getItem('userRole') || 'user';
    const adminElements = document.querySelectorAll('.admin-only');
    
    // Show/hide admin elements based on role
    adminElements.forEach(element => {
        if (userRole === 'admin') {
            element.classList.remove('d-none');
        } else {
            element.classList.add('d-none');
        }
    });
    
    // Add admin panel link for admins
    if (userRole === 'admin') {
        const navbarNav = document.querySelector('#navbarNav .navbar-nav');
        if (navbarNav) {
            // Check if admin panel link already exists
            const adminPanelLink = document.querySelector('.admin-panel-link');
            if (!adminPanelLink) {
                const adminPanelItem = document.createElement('li');
                adminPanelItem.className = 'nav-item admin-panel-link';
                
                // Use direct path instead of getCorrectPath to avoid issues
                let adminPanelPath;
                if (window.location.pathname.includes('/pages/user/')) {
                    adminPanelPath = 'admin-panel.html';
                } else if (window.location.pathname.includes('/pages/')) {
                    adminPanelPath = 'user/admin-panel.html';
                } else {
                    adminPanelPath = 'pages/user/admin-panel.html';
                }
                
                adminPanelItem.innerHTML = `
                    <a class="nav-link" href="${adminPanelPath}">
                        <i class="fas fa-shield-alt me-1"></i> Admin Panel
                    </a>
                `;
                navbarNav.appendChild(adminPanelItem);
            }
        }
    }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
    // Skip auth check on login and register pages
    if (isAuthPage()) {
        return;
    }
    
    // Only check auth for protected pages
    const isPublicPage = window.location.pathname === '/' || 
                         window.location.pathname === '/index.html';
    
    if (!isPublicPage) {
        const isAuthenticated = checkAuth();
        if (!isAuthenticated) return;
    }
    
    setUserName();
    setupLogout();
    setupRoleBasedUI();
}); 