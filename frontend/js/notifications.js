// Notifications Module (exported on window for global access)
window.Notifications = {
    async load() {
        await this.loadNotifications();
        this.setupEventListeners();
    },

    setupEventListeners() {
        document.getElementById('mark-all-read').addEventListener('click', async () => {
            await this.markAllAsRead();
        });
    },

    async loadNotifications() {
        const container = document.getElementById('notifications-list');
        
        try {
            const response = await API.getNotifications();
            const notifications = response.data;

            if (notifications.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <span class="empty-icon">🔔</span>
                        <p>لا توجد إشعارات</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = notifications.map(n => this.renderNotification(n)).join('');

            // Update badge
            const unread = notifications.filter(n => !n.is_read).length;
            document.getElementById('notif-badge').textContent = unread;

            // Add click handlers
            container.querySelectorAll('.notif-item').forEach(item => {
                item.addEventListener('click', async () => {
                    const id = item.dataset.id;
                    const isRead = item.classList.contains('read');
                    if (!isRead) {
                        await this.markAsRead(id);
                    }
                });
            });

        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    },

    renderNotification(notif) {
        const date = new Date(notif.created_at).toLocaleString('ar-SA');
        const typeIcons = {
            daily: '📅',
            reminder: '⏰',
            warning: '⚠️',
            info: 'ℹ️',
            exam: '📝'
        };

        return `
            <div class="notif-item ${notif.is_read ? 'read' : 'unread'}" data-id="${notif.id}">
                <div class="notif-icon">${typeIcons[notif.notification_type] || '📬'}</div>
                <div class="notif-content">
                    <div class="notif-title">${notif.title}</div>
                    <div class="notif-message">${notif.message}</div>
                    <div class="notif-date">${date}</div>
                </div>
            </div>
        `;
    },

    async markAsRead(id) {
        try {
            await API.markAsRead(id);
            await this.loadNotifications();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    },

    async markAllAsRead() {
        try {
            await API.markAllAsRead();
            UI.showToast('تم تحديد جميع الإشعارات كمقروءة', 'success');
            await this.loadNotifications();
        } catch (error) {
            UI.showToast('حدث خطأ', 'error');
        }
    }
};

// Add notification styles (scoped var to avoid global name collisions)
(function(){
const notifStyle = document.createElement('style');
notifStyle.textContent = `
.notifications-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.notif-item {
    background: white;
    border: 2px solid var(--border);
    border-radius: var(--radius);
    padding: 15px;
    display: flex;
    gap: 15px;
    cursor: pointer;
    transition: var(--transition);
}

.notif-item:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow);
}

.notif-item.unread {
    border-right: 4px solid var(--primary);
    background: #f0f9ff;
}

.notif-icon {
    font-size: 2rem;
}

.notif-content {
    flex: 1;
}

.notif-title {
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 5px;
}

.notif-message {
    color: #6c757d;
    margin-bottom: 8px;
    white-space: pre-wrap;
}

.notif-date {
    font-size: 0.85rem;
    color: #adb5bd;
}
`;
document.head.appendChild(notifStyle);
})();
