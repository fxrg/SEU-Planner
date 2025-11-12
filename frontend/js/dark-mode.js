// Dark Mode Module
const DarkMode = {
    init() {
        // Load saved preference
        const isDark = localStorage.getItem('dark_mode') === 'true';
        if (isDark) {
            document.body.classList.add('dark-mode');
        }

        // Toggle button
        const toggleBtn = document.getElementById('dark-mode-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggle();
            });
        }
    },

    toggle() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('dark_mode', isDark);
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    DarkMode.init();
});

console.log('✅ Dark mode module loaded');
