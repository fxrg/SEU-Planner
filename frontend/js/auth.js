// Authentication Module
const Auth = {
    async init() {
        // Load majors for registration
        await this.loadMajors();

        // Login form
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });

        // Guest login
        const guestBtn = document.getElementById('guest-login');
        if (guestBtn) {
            guestBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.enableGuestMode();
                UI.showToast('تم الدخول كضيف. يمكنك التصفح فقط.', 'info');
                UI.showPage('dashboard-page');
                Dashboard.load();
            });
        }

        // Register form
        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegister();
        });

        // Toggle forms
        document.getElementById('show-register').addEventListener('click', (e) => {
            e.preventDefault();
            UI.showPage('register-page');
        });

        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            UI.showPage('login-page');
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
    },

    async loadMajors() {
        const select = document.getElementById('reg-major');
        if (!select) return;
        
        // بناء قائمة التخصصات من SEU_COMPLETE_DATA لتفادي التكرار
        const idMap = {
            health_informatics: 1,
            public_health: 2,
            it: 3,
            cs: 4,
            ds: 5,
            finance: 6,
            business: 7,
            ecommerce: 8,
            accounting: 9,
            english: 10,
            law: 11,
            digital_media: 12
        };
        const majors = Object.entries(SEU_COMPLETE_DATA.majors).map(([key, m]) => ({
            id: idMap[key] || key,
            name_ar: m.name_ar,
            college_ar: m.college_ar
        }));
        
        // تجميع التخصصات حسب الكلية
        const colleges = {};
        majors.forEach(major => {
            if (!colleges[major.college_ar]) {
                colleges[major.college_ar] = [];
            }
            colleges[major.college_ar].push(major);
        });
        
        // إضافة التخصصات مجمعة حسب الكلية
        Object.keys(colleges).forEach(collegeName => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = collegeName;
            
            colleges[collegeName].forEach(major => {
                const option = document.createElement('option');
                option.value = major.id;
                option.textContent = major.name_ar;
                optgroup.appendChild(option);
            });
            
            select.appendChild(optgroup);
        });
    },

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        UI.showLoading();
        try {
            await API.login(email, password);
            UI.showToast('تم تسجيل الدخول بنجاح!', 'success');
            UI.showPage('dashboard-page');
            await Dashboard.load();
        } catch (error) {
            UI.showToast(error.message, 'error');
        } finally {
            UI.hideLoading();
        }
    },

    async handleRegister() {
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const majorId = parseInt(document.getElementById('reg-major').value);

        UI.showLoading();
        try {
            await API.register({
                full_name: name,
                email,
                password,
                major_id: majorId
            });
            
            // رسالة نجاح مع توضيح طريقة الحفظ
            const storageMode = API.useFirebase() ? 'تم حفظ الحساب في Firebase ☁️' : 'تم حفظ الحساب محلياً 💾 (لم يتم تفعيل Firebase)';
            UI.showToast('تم إنشاء الحساب بنجاح! ' + storageMode, 'success');
            
            UI.showPage('dashboard-page');
            await Dashboard.load();
        } catch (error) {
            UI.showToast(error.message, 'error');
        } finally {
            UI.hideLoading();
        }
    },

    logout() {
        this.disableGuestMode();
        API.removeToken();
        UI.showToast('تم تسجيل الخروج', 'info');
        UI.showPage('login-page');
    },

    isLoggedIn() {
        return !!API.getToken();
    },

    isGuest() {
        return localStorage.getItem('GUEST_MODE') === '1' && !this.isLoggedIn();
    },

    enableGuestMode() {
        localStorage.setItem('GUEST_MODE', '1');
        // إعداد اسم المستخدم في الواجهة
        const guest = { id: 'guest', full_name: 'ضيف', email: null, major_id: null, selected_courses: [] };
        localStorage.setItem(USER_KEY, JSON.stringify(guest));
    },

    disableGuestMode() {
        localStorage.removeItem('GUEST_MODE');
    },

    getCurrentUser() {
        const userStr = localStorage.getItem(USER_KEY);
        if (userStr) return JSON.parse(userStr);
        if (this.isGuest()) return { id: 'guest', full_name: 'ضيف', email: null, major_id: null, selected_courses: [] };
        return null;
    }
};
