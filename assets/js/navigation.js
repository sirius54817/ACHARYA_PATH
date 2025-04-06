/**
 * Navigation System
 * Handles all page redirections and ensures correct paths
 */
(function() {
    // List of all user pages
    const userPages = [
        'admin-panel.html',
        'community.html',
        'courses.html',
        'dashboard.html',
        'events.html',
        'freelance.html',
        'government-policies.html',
        'login.html',
        'profile.html',
        'settings.html',
        'support.html'
    ];
    
    // Get correct path for a user page
    function getUserPagePath(pageName) {
        // If we're already in the user folder
        if (window.location.pathname.includes('/pages/user/')) {
            return pageName;
        } 
        // If we're in another pages subfolder
        else if (window.location.pathname.includes('/pages/')) {
            return 'user/' + pageName;
        } 
        // If we're at the root
        else {
            return 'pages/user/' + pageName;
        }
    }
    
    // Fix all navigation links on the page
    function fixNavigationLinks() {
        // Get all navigation links
        const navLinks = document.querySelectorAll('a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Skip if it's an external link, has a specific target, or is a hash link
            if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript:')) {
                return;
            }
            
            // Check if the link points to a user page
            const pageName = href.split('/').pop();
            if (userPages.includes(pageName)) {
                link.setAttribute('href', getUserPagePath(pageName));
            }
        });
    }
    
    // Fix specific navigation elements
    function fixSpecificNavigation() {
        // Fix navbar brand link
        const navbarBrand = document.querySelector('.navbar-brand');
        if (navbarBrand) {
            navbarBrand.setAttribute('href', getUserPagePath('dashboard.html'));
        }
        
        // Fix dashboard link
        const dashboardLink = document.querySelector('.nav-link[href*="dashboard"]');
        if (dashboardLink) {
            dashboardLink.setAttribute('href', getUserPagePath('dashboard.html'));
        }
        
        // Fix courses link
        const coursesLink = document.querySelector('.nav-link[href*="courses"]');
        if (coursesLink) {
            coursesLink.setAttribute('href', getUserPagePath('courses.html'));
        }
        
        // Fix government policies link
        const policiesLink = document.querySelector('.nav-link[href*="government-policies"]');
        if (policiesLink) {
            policiesLink.setAttribute('href', getUserPagePath('government-policies.html'));
        }
        
        // Fix events link
        const eventsLink = document.querySelector('.nav-link[href*="events"]');
        if (eventsLink) {
            eventsLink.setAttribute('href', getUserPagePath('events.html'));
        }
        
        // Fix freelance link
        const freelanceLink = document.querySelector('.nav-link[href*="freelance"]');
        if (freelanceLink) {
            freelanceLink.setAttribute('href', getUserPagePath('freelance.html'));
        }
        
        // Fix community link
        const communityLink = document.querySelector('.nav-link[href*="community"]');
        if (communityLink) {
            communityLink.setAttribute('href', getUserPagePath('community.html'));
        }
        
        // Fix support link
        const supportLink = document.querySelector('.nav-link[href*="support"]');
        if (supportLink) {
            supportLink.setAttribute('href', getUserPagePath('support.html'));
        }
        
        // Fix profile link
        const profileLink = document.querySelector('.dropdown-item[href*="profile"]');
        if (profileLink) {
            profileLink.setAttribute('href', getUserPagePath('profile.html'));
        }
        
        // Fix settings link
        const settingsLink = document.querySelector('.dropdown-item[href*="settings"]');
        if (settingsLink) {
            settingsLink.setAttribute('href', getUserPagePath('settings.html'));
        }
    }
    
    // Initialize navigation fixes
    document.addEventListener('DOMContentLoaded', function() {
        fixNavigationLinks();
        fixSpecificNavigation();
    });
})(); 