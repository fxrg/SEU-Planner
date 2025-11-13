// Firebase Status Indicator (disabled by default)
(function() {
    // If you ever want to re-enable the badge, set:
    // window.FIREBASE_STATUS_DEBUG = true;
    if (!window.FIREBASE_STATUS_DEBUG) {
        // Do nothing; badge is removed as requested
        return;
    }

    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const host = document.body;
            if (!host) return;
            const statusIndicator = document.createElement('div');
            statusIndicator.style.cssText = `
                position: fixed;
                bottom: 10px;
                left: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.85rem;
                z-index: 9999;
            `;
            const isFirebaseEnabled = window.FIREBASE_ENABLED;
            statusIndicator.textContent = isFirebaseEnabled ? 'Firebase Active' : 'Offline Mode';
            host.appendChild(statusIndicator);
        }, 800);
    });
})();
