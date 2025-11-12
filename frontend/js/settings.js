// Settings Module
const Settings = {
    async load() {
        this.loadProfile();
        this.setupEventListeners();
    },

    setupEventListeners() {
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfile();
            });
        }

        const notifForm = document.getElementById('notif-form');
        if (notifForm) {
            notifForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveNotificationPreferences();
            });
        }

        const calendarForm = document.getElementById('calendar-form');
        if (calendarForm) {
            calendarForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveCalendarPreferences();
            });
        }

        // Request notification permission
        const notifCheckbox = document.getElementById('notif-enabled');
        if (notifCheckbox) {
            notifCheckbox.addEventListener('change', () => {
                if (notifCheckbox.checked && Notification.permission === 'default') {
                    Notification.requestPermission().then(permission => {
                        if (permission !== 'granted') {
                            notifCheckbox.checked = false;
                            UI.showToast('يجب السماح بالإشعارات للتفعيل', 'warning');
                        }
                    });
                }
            });
        }
    },

    loadProfile() {
        const user = Auth.getCurrentUser();
        if (!user) return;

        // Load profile data
        const nameEl = document.getElementById('profile-name');
        const emailEl = document.getElementById('profile-email');
        
        if (nameEl) nameEl.value = user.full_name || '';
        if (emailEl) emailEl.value = user.email || '';

        // Load notification preferences
        const notifEnabled = localStorage.getItem(NOTIFICATION_ENABLED_KEY) === 'true';
        const notifTime = localStorage.getItem(NOTIFICATION_TIME_KEY) || DEFAULT_NOTIFICATION_TIME;
        const studyIntensity = localStorage.getItem(STUDY_INTENSITY_KEY) || 'medium';

        const notifEnabledEl = document.getElementById('notif-enabled');
        const notifTimeEl = document.getElementById('notif-time');
        const studyIntensityEl = document.getElementById('study-intensity');
        
        if (notifEnabledEl) notifEnabledEl.checked = notifEnabled;
        if (notifTimeEl) notifTimeEl.value = notifTime;
        if (studyIntensityEl) studyIntensityEl.value = studyIntensity;

        // Load calendar preferences
        const calendarType = localStorage.getItem('calendar_type') || 'gregorian';
        const showBothDates = localStorage.getItem('show_both_dates') === 'true';
        
        const calendarTypeEl = document.getElementById('calendar-type');
        const showBothEl = document.getElementById('show-both-dates');
        
        if (calendarTypeEl) calendarTypeEl.value = calendarType;
        if (showBothEl) showBothEl.checked = showBothDates;
    },

    saveProfile() {
        const name = document.getElementById('profile-name').value.trim();

        if (!name) {
            UI.showToast('الرجاء إدخال الاسم', 'warning');
            return;
        }

        const user = Auth.getCurrentUser();
        if (!user) return;
        
        user.full_name = name;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        
        // Update UI
        const userNameEl = document.getElementById('user-name');
        if (userNameEl) userNameEl.textContent = name;
        
        UI.showToast('تم حفظ التغييرات ✓', 'success');
    },

    saveNotificationPreferences() {
        const enabled = document.getElementById('notif-enabled').checked;
        const time = document.getElementById('notif-time').value;
        const intensity = document.getElementById('study-intensity').value;

        if (enabled && Notification.permission !== 'granted') {
            UI.showToast('يجب السماح بالإشعارات للتفعيل', 'warning');
            document.getElementById('notif-enabled').checked = false;
            return;
        }

        // حفظ الإعدادات القديمة للمقارنة
        const oldIntensity = localStorage.getItem(STUDY_INTENSITY_KEY) || 'medium';

        localStorage.setItem(NOTIFICATION_ENABLED_KEY, enabled.toString());
        localStorage.setItem(NOTIFICATION_TIME_KEY, time);
        localStorage.setItem(STUDY_INTENSITY_KEY, intensity);

        if (enabled) {
            // Schedule daily notification check
            UI.showToast('✓ سيتم إرسال إشعارات يومية في ' + time, 'success');
            StudyPlanner.checkAndSendNotifications();
        } else {
            UI.showToast('تم تعطيل الإشعارات', 'info');
        }

        // إعادة توليد الخطة إذا تغيرت الكثافة
        if (oldIntensity !== intensity) {
            const plan = StudyPlanner.getCurrentPlan();
            if (plan) {
                UI.confirm(
                    'تغيير كثافة الدراسة',
                    'تم تغيير كثافة الدراسة. هل تريد إعادة توليد الخطة الدراسية لتطبيق التغييرات؟',
                    () => {
                        // إعادة توليد الخطة
                        try {
                            StudyPlanner.generatePlan(plan.courses, plan.term_id, intensity);
                            UI.showToast('✓ تم تحديث الخطة الدراسية بنجاح', 'success');
                            
                            // إعادة تحميل الصفحة الحالية
                            if (document.getElementById('dashboard-page').classList.contains('active')) {
                                Dashboard.load();
                            } else if (document.getElementById('calendar-page').classList.contains('active')) {
                                Calendar.load();
                            }
                        } catch (error) {
                            UI.showToast('خطأ في تحديث الخطة: ' + error.message, 'error');
                        }
                    }
                );
            }
        }
    },

    saveCalendarPreferences() {
        const calendarType = document.getElementById('calendar-type').value;
        const showBothDates = document.getElementById('show-both-dates').checked;

        localStorage.setItem('calendar_type', calendarType);
        localStorage.setItem('show_both_dates', showBothDates.toString());

        UI.showToast('تم حفظ تفضيلات التقويم', 'success');
        
        // Reload calendar if on calendar page
        if (document.getElementById('calendar-page').classList.contains('active')) {
            Calendar.render();
        }
    }
};

console.log('✅ Settings module loaded');
