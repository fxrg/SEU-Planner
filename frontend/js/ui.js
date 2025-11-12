// UI Helper Functions
const UI = {
    // Show/hide loading
    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
    },

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    },

    // Show toast notification (single instance)
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');

        // Always keep a single toast visible
        Array.from(container.querySelectorAll('.toast')).forEach(t => t.remove());
        if (this._toastTimer) clearTimeout(this._toastTimer);

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        this._toastTimer = setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Show/hide page
    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');

        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageId.replace('-page', '')) {
                link.classList.add('active');
            }
        });

        // Hide navbar on auth pages
        const navbar = document.getElementById('navbar');
        if (pageId === 'login-page' || pageId === 'register-page') {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
    },

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Format time
    formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours} ساعة${mins > 0 ? ` و ${mins} دقيقة` : ''}`;
        }
        return `${mins} دقيقة`;
    },

    // Format clock HH:MM -> 12h with AM/PM
    formatClock(hhmm) {
        if (!hhmm) return '';
        try {
            const [h, m] = hhmm.split(':').map(Number);
            const period = h >= 12 ? 'PM' : 'AM';
            const hour12 = ((h + 11) % 12) + 1; // 0 -> 12
            return `${hour12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
        } catch (e) {
            return hhmm;
        }
    },

    // Get session type label
    getSessionTypeLabel(type) {
        const labels = {
            review: 'مراجعة',
            intensive: 'مكثفة',
            exam_prep: 'تحضير للاختبار',
            light_review: 'مراجعة خفيفة'
        };
        return labels[type] || type;
    },

    // Calculate whole days until date (based on user's day start)
    daysUntil(date) {
        const msPerDay = 24 * 60 * 60 * 1000;
        const today = new Date();
        const target = new Date(date);
        // Normalize to local midnight to avoid timezone/ceil drift
        today.setHours(0, 0, 0, 0);
        target.setHours(0, 0, 0, 0);
        const diff = Math.floor((target - today) / msPerDay);
        return diff;
    },

    // Modal functions
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    },

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    },

    // Confirm dialog
    confirm(title, message, onConfirm, onCancel) {
        // إنشاء مودال للتأكيد
        const existingModal = document.getElementById('confirm-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'confirm-modal';
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="close-btn" onclick="document.getElementById('confirm-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p style="font-size: 16px; line-height: 1.8; color: #333;">${message}</p>
                </div>
                <div class="modal-footer" style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button id="confirm-cancel-btn" class="btn btn-secondary">إلغاء</button>
                    <button id="confirm-ok-btn" class="btn btn-primary">نعم، تأكيد</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // إضافة أحداث الأزرار
        document.getElementById('confirm-ok-btn').addEventListener('click', () => {
            modal.remove();
            if (onConfirm) onConfirm();
        });

        document.getElementById('confirm-cancel-btn').addEventListener('click', () => {
            modal.remove();
            if (onCancel) onCancel();
        });

        // إغلاق عند الضغط خارج المحتوى
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                if (onCancel) onCancel();
            }
        });
    }
};

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to { transform: translateX(-100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
