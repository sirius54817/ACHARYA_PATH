/**
 * Page Transition System
 * Provides smooth transitions between pages
 */
(function() {
    // Create transition overlay with spinner
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.innerHTML = '<div class="page-transition-spinner"></div>';
    document.body.appendChild(overlay);
    
    // Add necessary styles
    const style = document.createElement('style');
    style.textContent = `
        .page-transition-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ffffff;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .page-transition-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        
        .page-transition-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top-color: #000;
            animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        body.page-loaded {
            opacity: 1;
        }
        
        /* Add smooth transitions to navigation links */
        .navbar .nav-link {
            position: relative;
            transition: color 0.3s ease;
        }
        
        .navbar .nav-link:after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: 0;
            left: 50%;
            background-color: #fff;
            transition: all 0.3s ease;
            transform: translateX(-50%);
        }
        
        .navbar .nav-link:hover:after {
            width: 100%;
        }
        
        .navbar .nav-link.active:after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);
    
    // Handle page load
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            document.body.classList.add('page-loaded');
        }, 100);
        
        // Highlight current page in navigation
        highlightCurrentPage();
    });
    
    // Show toast notification
    const showToast = function(message) {
        const toastEl = document.getElementById('navigationToast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toastEl && toastMessage) {
            toastMessage.textContent = message;
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        }
    };
    
    // Highlight the current page in the navigation
    const highlightCurrentPage = function() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.navbar .nav-link');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath && currentPath.endsWith(linkPath)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };
    
    // Main navigation pages
    const mainPages = [
        'dashboard.html',
        'courses.html',
        'government-policies.html',
        'events.html',
        'freelance.html',
        'community.html',
        'support.html',
        'profile.html',
        'settings.html',
        'admin-panel.html'
    ];
    
    // Handle link clicks for page transitions
    document.addEventListener('click', function(e) {
        // Find closest link element
        const link = e.target.closest('a');
        
        // If it's a link and not meant to open in a new tab/window
        if (link && 
            link.href && 
            link.href.indexOf(window.location.origin) === 0 && 
            !link.target && 
            !link.hasAttribute('download') && 
            !link.hasAttribute('data-bs-toggle') && 
            !e.ctrlKey && 
            !e.metaKey) {
            
            // Check if it's a main navigation link
            const isMainNavLink = mainPages.some(page => link.href.endsWith(page));
            
            // Prevent default navigation
            e.preventDefault();
            
            // Get the target URL
            const targetUrl = link.href;
            
            // Show transition overlay
            overlay.classList.add('active');
            
            // Show toast with page name for main navigation
            if (isMainNavLink) {
                const pageName = link.textContent.trim() || 'new page';
                showToast(`Navigating to ${pageName}...`);
            }
            
            // Navigate after transition
            setTimeout(function() {
                window.location.href = targetUrl;
            }, 300);
        }
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            // Page was loaded from cache (back/forward navigation)
            document.body.classList.remove('page-loaded');
            setTimeout(function() {
                document.body.classList.add('page-loaded');
            }, 100);
            
            // Re-highlight current page
            highlightCurrentPage();
        }
    });
})(); 