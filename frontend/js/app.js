// Main App Initialization
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 SEU Planner Started');

    // Initialize auth
    await Auth.init();

    // Check if logged in or guest
    if (Auth.isLoggedIn() || Auth.isGuest()) {
        UI.showPage('dashboard-page');
        await Dashboard.load();
    } else {
        UI.showPage('login-page');
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

    console.log('✅ App initialized');
});
