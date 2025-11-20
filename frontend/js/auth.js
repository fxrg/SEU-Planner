// Authentication Module
const Auth = {
    init() {
        // This is now handled by specific page inits
    },

    async initLoginPage() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLogin();
            });
        }

        // Guest login
        const guestBtn = document.getElementById('guest-login');
        if (guestBtn) {
            guestBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.loginAsGuest();
            });
        }

        // Forgot Password
        const forgotBtn = document.getElementById('forgot-password-link');
        if (forgotBtn) {
            forgotBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }
    },

    async initRegisterPage() {
        // Load majors for registration
        await this.loadMajors();

        // Register form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleRegister();
            });
        }
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

        if (!email || !password) {
            UI.showToast('الرجاء إدخال البريد الإلكتروني وكلمة المرور', 'warning');
            return;
        }

        UI.showLoading();
        try {
            await API.login(email, password);
            UI.showToast('مرحباً بك مجدداً! نتمنى لك يوماً دراسياً مثمراً 🚀', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (error) {
            console.error('Login Error:', error);
            const msg = this.getErrorMessage(error);
            UI.showToast(msg, 'error');
        } finally {
            UI.hideLoading();
        }
    },

    async handleForgotPassword() {
        const emailInput = document.getElementById('login-email');
        let email = emailInput ? emailInput.value.trim() : '';
        
        if (!email) {
            // If email field is empty, focus it and show toast, or prompt
            // Using prompt for simplicity if field is empty, or just ask them to fill it
            UI.showToast('الرجاء إدخال البريد الإلكتروني في الحقل المخصص أولاً', 'info');
            if (emailInput) emailInput.focus();
            return;
        }
        
        if (!email.includes('@')) {
            UI.showToast('الرجاء إدخال بريد إلكتروني صحيح', 'warning');
            return;
        }

        if (!confirm(`هل تريد إرسال رابط استعادة كلمة المرور إلى: ${email}؟`)) {
            return;
        }

        UI.showLoading();
        try {
            const result = await API.sendPasswordResetEmail(email);
            UI.showToast(result.message, 'success');
        } catch (error) {
            console.error('Reset Password Error:', error);
            const msg = this.getErrorMessage(error);
            UI.showToast(msg, 'error');
        } finally {
            UI.hideLoading();
        }
    },

    async handleRegister() {
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const majorId = parseInt(document.getElementById('reg-major').value);

        if (!name || !email || !password || !majorId) {
            UI.showToast('الرجاء تعبئة جميع الحقول', 'warning');
            return;
        }

        UI.showLoading();
        try {
            await API.register({
                full_name: name,
                email,
                password,
                major_id: majorId
            });
            
            // رسالة نجاح مع توضيح طريقة الحفظ
            const storageMode = API.useFirebase() ? `تم حفظ الحساب في Firebase ${UI.getIcon('cloud')}` : `تم حفظ الحساب محلياً ${UI.getIcon('save')} (لم يتم تفعيل Firebase)`;
            UI.showToast('تم إنشاء الحساب بنجاح! ' + storageMode, 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } catch (error) {
            console.error('Register Error:', error);
            const msg = this.getErrorMessage(error);
            UI.showToast(msg, 'error');
        } finally {
            UI.hideLoading();
        }
    },

    getErrorMessage(error) {
        // Firebase Error Codes
        if (error.code === 'auth/wrong-password') return '❌ كلمة المرور غير صحيحة. جرب مرة أخرى أو استخدم "الدخول كضيف"';
        if (error.code === 'auth/user-not-found') return '❌ البريد الإلكتروني غير مسجل. قم بـ"إنشاء حساب" أو "الدخول كضيف"';
        if (error.code === 'auth/invalid-credential') return '❌ البريد الإلكتروني أو كلمة المرور غير صحيحة. قم بـ"إنشاء حساب جديد" أو استخدم "الدخول كضيف"';
        if (error.code === 'auth/invalid-email') return '❌ البريد الإلكتروني غير صالح';
        if (error.code === 'auth/user-disabled') return '❌ تم تعطيل هذا الحساب';
        if (error.code === 'auth/email-already-in-use') return '✅ البريد الإلكتروني مستخدم بالفعل. استخدم "تسجيل الدخول"';
        if (error.code === 'auth/weak-password') return '❌ كلمة المرور ضعيفة (يجب أن تكون 6 أحرف على الأقل)';
        if (error.code === 'auth/network-request-failed') return '❌ خطأ في الاتصال بالشبكة. تحقق من الإنترنت أو استخدم "الدخول كضيف"';
        if (error.code === 'auth/too-many-requests') return '⏳ تم حظر الوصول مؤقتاً بسبب تكرار المحاولات الفاشلة. حاول لاحقاً أو استخدم "الدخول كضيف"';
        if (error.code === 'auth/invalid-api-key' || (error.message && error.message.includes('400'))) {
            return '⚠️ خطأ في إعدادات الخادم (400). استخدم "الدخول كضيف" للمتابعة';
        }
        
        // Generic or Local Errors
        return error.message || '❌ حدث خطأ غير معروف. جرب "الدخول كضيف"';
    },

    logout() {
        this.disableGuestMode();
        API.removeToken();
        UI.showToast('تم تسجيل الخروج', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
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
    },

    loginAsGuest() {
        this.enableGuestMode();
        UI.showToast('تم الدخول كضيف. جاري التحويل...', 'info');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 100);
    },
};
