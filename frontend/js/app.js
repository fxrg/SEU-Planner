// Main App Initialization
const App = {
    async init() {
        console.log('SEU Planner Started');

        // Initialize auth
        await Auth.init();

        // Determine current page context
        const path = window.location.pathname;
        const page = path.split('/').pop();
        
        if (page === 'dashboard.html') {
            this.initDashboard();
        } else if (page === 'index.html' || page === '') {
            this.initLanding();
        } else if (page === 'login.html') {
            Auth.initLoginPage();
        } else if (page === 'register.html') {
            Auth.initRegisterPage();
        }

        // Global Mobile Menu Logic (if elements exist)
        this.setupMobileMenu();
    },

    async initDashboard() {
        // Security check
        if (!Auth.isLoggedIn() && !Auth.isGuest()) {
            window.location.href = 'login.html';
            return;
        }

        // Default to dashboard tab
        UI.showPage('dashboard-page');
        await Dashboard.load();

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
                        }
                        break;
                    case 'settings':
                        await Settings.load();
                        break;
                    case 'sessions':
                        if (window.Sessions && typeof Sessions.load === 'function') {
                            await Sessions.load();
                        }
                        break;
                }
            });
        });

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                Auth.logout();
            });
        }

        // Pre-bind Sessions module
        if (window.Sessions && typeof Sessions.load === 'function') {
            try { await Sessions.load(); } catch (e) { console.warn('Sessions init failed', e); }
        }

        // Update countdown every minute
        setInterval(() => {
            if (document.getElementById('dashboard-page').classList.contains('active')) {
                Dashboard.updateCountdown();
            }
        }, 60000);
    },

    initLanding() {
        // Landing Page Event Listeners
        const landingLoginBtn = document.getElementById('landing-login-btn');
        if (landingLoginBtn) {
            landingLoginBtn.addEventListener('click', () => window.location.href = 'login.html');
        }

        const landingRegisterBtn = document.getElementById('landing-register-btn');
        if (landingRegisterBtn) {
            landingRegisterBtn.addEventListener('click', () => window.location.href = 'register.html');
        }

        const heroCtaBtn = document.getElementById('hero-cta-btn');
        if (heroCtaBtn) {
            heroCtaBtn.addEventListener('click', () => window.location.href = 'register.html');
        }

        const heroGuestBtn = document.getElementById('hero-guest-btn');
        if (heroGuestBtn) {
            heroGuestBtn.addEventListener('click', () => {
                // Direct login as guest
                Auth.loginAsGuest();
            });
        }
    },

    setupMobileMenu() {
        const burgerMenu = document.getElementById('burger-menu');
        const navLinks = document.getElementById('nav-links');
        const navOverlay = document.getElementById('nav-overlay');

        if (!burgerMenu || !navLinks) return;

        function toggleMenu() {
            burgerMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
            navOverlay?.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        }

        function closeMenu() {
            burgerMenu.classList.remove('active');
            navLinks.classList.remove('active');
            navOverlay?.classList.remove('active');
            document.body.style.overflow = '';
        }

        burgerMenu.addEventListener('click', toggleMenu);
        
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
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
