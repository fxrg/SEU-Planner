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
        
        // قائمة التخصصات من بيانات الجامعة السعودية الإلكترونية
        const majors = [
            { id: 1, name_ar: 'المعلوماتية الصحية', college_ar: 'كلية العلوم الصحية' },
            { id: 2, name_ar: 'الصحة العامة', college_ar: 'كلية العلوم الصحية' },
            { id: 3, name_ar: 'تقنية المعلومات', college_ar: 'كلية الحوسبة والمعلوماتية' },
            { id: 4, name_ar: 'علوم الحاسب الآلي', college_ar: 'كلية الحوسبة والمعلوماتية' },
            { id: 5, name_ar: 'علوم البيانات', college_ar: 'كلية الحوسبة والمعلوماتية' },
            { id: 6, name_ar: 'المالية', college_ar: 'كلية العلوم الإدارية والمالية' },
            { id: 7, name_ar: 'إدارة الأعمال', college_ar: 'كلية العلوم الإدارية والمالية' },
            { id: 8, name_ar: 'التجارة الإلكترونية', college_ar: 'كلية العلوم الإدارية والمالية' },
            { id: 9, name_ar: 'المحاسبة', college_ar: 'كلية العلوم الإدارية والمالية' },
            { id: 10, name_ar: 'اللغة الإنجليزية والترجمة', college_ar: 'كلية العلوم والدراسات النظرية' },
            { id: 11, name_ar: 'القانون', college_ar: 'كلية العلوم والدراسات النظرية' },
            { id: 12, name_ar: 'الإعلام الرقمي', college_ar: 'كلية العلوم والدراسات النظرية' }
        ];
        
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
            UI.showToast('تم إنشاء الحساب بنجاح!', 'success');
            UI.showPage('dashboard-page');
            await Dashboard.load();
        } catch (error) {
            UI.showToast(error.message, 'error');
        } finally {
            UI.hideLoading();
        }
    },

    logout() {
        API.removeToken();
        UI.showToast('تم تسجيل الخروج', 'info');
        UI.showPage('login-page');
    },

    isLoggedIn() {
        return !!API.getToken();
    },

    getCurrentUser() {
        const userStr = localStorage.getItem(USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    }
};
