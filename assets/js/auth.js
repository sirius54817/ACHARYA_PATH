// Authentication check
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = '../../pages/public/login.html?redirect=' + encodeURIComponent(window.location.href);
    }
}

// Set user name from localStorage if available
function setUserName() {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(element => {
            element.textContent = storedName;
        });
    }
}

// Logout functionality
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');
            window.location.href = '../../index.html';
        });
    }
}

// Check if user has admin role
function isAdmin() {
    return localStorage.getItem('userRole') === 'admin';
}

// Show/hide admin elements based on role
function setupRoleBasedUI() {
    const adminElements = document.querySelectorAll('.admin-only');
    if (isAdmin()) {
        adminElements.forEach(el => el.classList.remove('d-none'));
    } else {
        adminElements.forEach(el => el.classList.add('d-none'));
    }
}

// Run all auth functions
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setUserName();
    setupLogout();
    setupRoleBasedUI();
}); 