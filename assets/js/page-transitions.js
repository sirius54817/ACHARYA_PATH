/**
 * Page Transition System
 * Provides smooth transitions between pages
 */
(function() {
    // Get correct path based on current location
    function getCorrectPath(path) {
        // If we're in the user folder, we need to adjust the path
        if (window.location.pathname.includes('/pages/user/')) {
            return '../..' + path;
        } else if (window.location.pathname.includes('/pages/')) {
            return '..' + path;
        }
        return path;
    }
    
    // Highlight current page in navigation
    function highlightCurrentPage() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                // Extract the page name from the href
                const pageName = href.split('/').pop();
                
                // Check if current path contains the page name
                if (currentPath.includes(pageName)) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }
    
    // Initialize page transitions
    document.addEventListener('DOMContentLoaded', function() {
        highlightCurrentPage();
        
        // Add click event listeners to navigation links
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Skip if it's an external link or has a specific target
                if (link.getAttribute('target') || link.getAttribute('href').startsWith('http')) {
                    return;
                }
                
                e.preventDefault();
                const href = link.getAttribute('href');
                
                // Fade out current page
                document.body.classList.add('page-transition-out');
                
                // Navigate to new page after transition
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        });
        
        // Add fade-in class when page loads
        document.body.classList.add('page-transition-in');
        
        // Remove transition classes after animation completes
        setTimeout(() => {
            document.body.classList.remove('page-transition-in');
        }, 500);
    });
    
    // Handle back/forward navigation
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            // Page was loaded from cache (back/forward navigation)
            document.body.classList.add('page-transition-in');
            
            setTimeout(() => {
                document.body.classList.remove('page-transition-in');
                highlightCurrentPage();
            }, 500);
        }
    });
})(); 