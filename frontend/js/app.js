// Main App Initialization
document.addEventListener('DOMContentLoaded', async () => {
    console.log('SEU Planner Started');

    // Initialize auth
    await Auth.init();

    // Check if logged in or guest
    if (Auth.isLoggedIn() || Auth.isGuest()) {
        UI.showPage('dashboard-page');
        await Dashboard.load();
    } else {
        UI.showPage('landing-page');
    }

    // Landing Page Event Listeners
    const landingLoginBtn = document.getElementById('landing-login-btn');
    if (landingLoginBtn) {
        landingLoginBtn.addEventListener('click', () => UI.showPage('login-page'));
    }

    const landingRegisterBtn = document.getElementById('landing-register-btn');
    if (landingRegisterBtn) {
        landingRegisterBtn.addEventListener('click', () => UI.showPage('register-page'));
    }

    const heroCtaBtn = document.getElementById('hero-cta-btn');
    if (heroCtaBtn) {
        heroCtaBtn.addEventListener('click', () => UI.showPage('register-page'));
    }

    const heroGuestBtn = document.getElementById('hero-guest-btn');
    if (heroGuestBtn) {
        heroGuestBtn.addEventListener('click', () => {
            // Trigger guest login logic from auth.js if available, or just show dashboard
            // Assuming Auth.guestLogin() exists or similar, but based on UI flow:
            // The guest login button in login page triggers Auth.loginAsGuest()
            // We can simulate a click on that button or call the function directly if exposed.
            // Let's check auth.js content first or just redirect to login page and auto-click guest?
            // Better: Call Auth.loginAsGuest() if it exists.
            if (typeof Auth.loginAsGuest === 'function') {
                Auth.loginAsGuest();
            } else {
                // Fallback: go to login page and let user click guest
                UI.showPage('login-page');
                // Optional: highlight guest button
            }
        });
    }

    // Setup navigation
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            UI.showPage(`${page}-page`);

            // Load page content
            switch (page) {
                case 'dashboard':
                    await Dashboard.load();
                    break;
                case 'calendar':
                    await Calendar.load();
                    break;
                case 'notifications':
                    if (window.Notifications && typeof Notifications.load === 'function') {
                        await Notifications.load();
                    } else {
                        console.warn('Notifications module not available');
                    }
                    break;
                case 'settings':
                    await Settings.load();
                    break;
                case 'sessions':
                    if (window.Sessions && typeof Sessions.load === 'function') {
                        await Sessions.load();
                    } else {
                        console.warn('Sessions module not available');
                    }
                    break;
            }
        });
    });

    // Pre-bind Sessions module once so its forms work reliably
    if (window.Sessions && typeof Sessions.load === 'function') {
        try { await Sessions.load(); } catch (e) { console.warn('Sessions init failed', e); }
    }

    // Update countdown every minute
    setInterval(() => {
        if (document.getElementById('dashboard-page').classList.contains('active')) {
            Dashboard.updateCountdown();
        }
    }, 60000);

    // Mobile Menu Logic
    const burgerMenu = document.getElementById('burger-menu');
    const navLinks = document.getElementById('nav-links');
    const navOverlay = document.getElementById('nav-overlay');

    function toggleMenu() {
        burgerMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }

    function closeMenu() {
        burgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (burgerMenu) {
        burgerMenu.addEventListener('click', toggleMenu);
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });

    console.log('App initialized');
});
