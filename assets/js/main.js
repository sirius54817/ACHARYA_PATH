// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form validation
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });

    // Counter animation
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds
                    const step = target / (duration / 16); // 60fps
                    
                    let current = 0;
                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    // Dark mode toggle
    initDarkMode();
    
    // Check authentication status if on a page that requires it
    if (window.location.pathname.includes('/user/') || window.location.pathname.includes('/admin/')) {
        checkAuthStatus();
    }
    
    // Logout link handler
    const logoutLinks = document.querySelectorAll('.logout-link');
    if (logoutLinks) {
        logoutLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        });
    }
});

// Dark mode functions
function initDarkMode() {
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateDarkModeIcon(true);
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        updateDarkModeIcon(false);
    }
    
    // Add event listeners to all dark mode toggles
    document.querySelectorAll('.dark-mode-toggle').forEach(toggle => {
        toggle.addEventListener('click', toggleDarkMode);
    });
}

function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    updateDarkModeIcon(newTheme === 'dark');
}

function updateDarkModeIcon(isDark) {
    document.querySelectorAll('.dark-mode-toggle').forEach(toggle => {
        const icon = toggle.querySelector('i');
        if (icon) {
            if (isDark) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    });
}

// Authentication
function checkAuthStatus() {
    // Skip auth check for login and register pages
    if (window.location.pathname.includes('/login.html') || 
        window.location.pathname.includes('/register.html')) {
        return true;
    }
    
    // Use the isLoggedIn function from auth.js if available
    if (typeof isLoggedIn === 'function') {
        if (!isLoggedIn()) {
            // Redirect to login page with the current URL as the redirect target
            window.location.href = '../user/login.html?redirect=' + encodeURIComponent(window.location.href);
            return false;
        }
    } else {
        // Fallback to local implementation
        const localIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('token');
        if (!localIsLoggedIn) {
            window.location.href = '../user/login.html?redirect=' + encodeURIComponent(window.location.href);
            return false;
        }
    }
    
    // Update user info in navbar if present
    const userNameEl = document.querySelector('.user-name');
    if (userNameEl) {
        userNameEl.textContent = localStorage.getItem('userName') || 'User';
    }
    
    const userEmailEl = document.querySelector('.user-email');
    if (userEmailEl) {
        userEmailEl.textContent = localStorage.getItem('userEmail') || '';
    }
    
    // Check for role-specific elements
    const adminElements = document.querySelectorAll('.admin-only');
    const userRole = localStorage.getItem('userRole') || 'user';
    
    if (adminElements.length > 0) {
        if (userRole === 'admin') {
            adminElements.forEach(el => el.classList.remove('d-none'));
        } else {
            adminElements.forEach(el => el.classList.add('d-none'));
        }
    }
}

// Logout function
function logout() {
    // Use the clearUserSession function from auth.js if available
    if (typeof clearUserSession === 'function') {
        clearUserSession();
    } else {
        // Fallback implementation
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
    }
    
    // Redirect to home page
    window.location.href = '../../index.html';
} 