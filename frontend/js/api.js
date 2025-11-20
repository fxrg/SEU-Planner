// API Helper Functions - OFFLINE by default, Firebase if available
const API = {
    // Whether Firebase auth is available
    useFirebase() {
        return !!(window.FIREBASE_ENABLED && window.firebase && firebase.auth);
    },
    // Get token from localStorage
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    // Set token in localStorage
    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    },

    // Remove token
    async removeToken() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        if (this.useFirebase()) {
            try { await firebase.auth().signOut(); } catch (e) { console.warn(e); }
        }
    },

    // Simulate async operations
    async delay(ms = 300) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Auth endpoints - Firebase preferred, fallback to local
    async login(email, password) {
        if (this.useFirebase()) {
            const cred = await firebase.auth().signInWithEmailAndPassword(email, password);
            const user = cred.user;
            const token = await user.getIdToken();
            this.setToken(token);
            const userData = {
                id: user.uid,
                email: user.email,
                full_name: user.displayName || (user.email ? user.email.split('@')[0] : 'المستخدم'),
                selected_courses: [],
                current_plan: null,
                major_id: (JSON.parse(localStorage.getItem(USER_KEY) || '{}').major_id) || null
            };
            localStorage.setItem(USER_KEY, JSON.stringify(userData));
            return { success: true, data: { token, user: userData } };
        } else {
            await this.delay();
            const users = JSON.parse(localStorage.getItem('seu_users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            if (!user) {
                throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            }
            const token = 'local_token_' + Date.now();
            this.setToken(token);
            const userData = { ...user };
            delete userData.password;
            localStorage.setItem(USER_KEY, JSON.stringify(userData));
            return { success: true, data: { token, user: userData } };
        }
    },

    async sendPasswordResetEmail(email) {
        if (this.useFirebase()) {
            await firebase.auth().sendPasswordResetEmail(email);
            return { success: true, message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' };
        } else {
            await this.delay();
            // Local mode simulation
            const users = JSON.parse(localStorage.getItem('seu_users') || '[]');
            const user = users.find(u => u.email === email);
            if (!user) {
                throw new Error('البريد الإلكتروني غير مسجل');
            }
            return { success: true, message: 'تم إرسال رابط إعادة تعيين كلمة المرور (محاكاة)' };
        }
    },

    async register(userData) {
        if (this.useFirebase()) {
            const cred = await firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password);
            const user = cred.user;
            // set display name
            if (userData.full_name) {
                try { await user.updateProfile({ displayName: userData.full_name }); } catch (e) {}
            }
            const token = await user.getIdToken();
            this.setToken(token);
            const toSave = {
                id: user.uid,
                email: user.email,
                full_name: userData.full_name || user.email.split('@')[0],
                major_id: userData.major_id || null,
                selected_courses: [],
                current_plan: null,
                created_at: new Date().toISOString()
            };
            localStorage.setItem(USER_KEY, JSON.stringify(toSave));
            return { success: true, data: { token, user: toSave } };
        } else {
            await this.delay();
            const users = JSON.parse(localStorage.getItem('seu_users') || '[]');
            if (users.find(u => u.email === userData.email)) {
                throw new Error('البريد الإلكتروني مستخدم بالفعل');
            }
            const newUser = {
                id: Date.now(),
                ...userData,
                created_at: new Date().toISOString(),
                selected_courses: [],
                current_plan: null
            };
            users.push(newUser);
            localStorage.setItem('seu_users', JSON.stringify(users));
            const token = 'local_token_' + Date.now();
            this.setToken(token);
            const userToSave = { ...newUser };
            delete userToSave.password;
            localStorage.setItem(USER_KEY, JSON.stringify(userToSave));
            return { success: true, data: { token, user: userToSave } };
        }
    },


    async getMe() {
        if (this.useFirebase()) {
            const user = firebase.auth().currentUser;
            if (!user) throw new Error('غير مسجل');
            const localUser = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
            const data = {
                id: user.uid,
                email: user.email,
                full_name: user.displayName || localUser.full_name || (user.email ? user.email.split('@')[0] : 'المستخدم'),
                selected_courses: localUser.selected_courses || [],
                current_plan: localUser.current_plan || null,
                major_id: localUser.major_id || null
            };
            localStorage.setItem(USER_KEY, JSON.stringify(data));
            return { success: true, data };
        } else {
            await this.delay();
            const user = JSON.parse(localStorage.getItem(USER_KEY));
            if (!user) throw new Error('غير مسجل');
            return { success: true, data: user };
        }
    },

    // Majors & Courses - From local data
    async getMajors() {
        await this.delay();
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
            key,
            name_ar: m.name_ar,
            college_ar: m.college_ar
        }));
        return { success: true, data: majors };
    },

    async getMajor(id) {
        await this.delay();
        const keyById = {
            1: 'health_informatics',
            2: 'public_health',
            3: 'it',
            4: 'cs',
            5: 'ds',
            6: 'finance',
            7: 'business',
            8: 'ecommerce',
            9: 'accounting',
            10: 'english',
            11: 'law',
            12: 'digital_media'
        };
        const key = keyById[id] || id;
        const major = SEU_COMPLETE_DATA.majors[key];
        if (!major) return { success: false, error: 'major_not_found' };
        const courses = (major.courses || []).map(code => SEU_COMPLETE_DATA.courses[code] || {
            code,
            name_ar: `مقرر ${code}`,
            name_en: code,
            difficulty: 3,
            hours: 3
        });
        return { success: true, data: { id, key, name_ar: major.name_ar, courses } };
    },

    async getCourses(majorId) {
        await this.delay();
        const major = (await this.getMajor(majorId)).data;
        return { success: true, data: major ? major.courses : [] };
    },

    // Plans - Use StudyPlanner module
    async generatePlan(courseIds, termId) {
        await this.delay();
        // This is handled by StudyPlanner.generatePlan() directly
        return { success: true, message: 'تم إنشاء الخطة' };
    },

    async getPlans() {
        await this.delay();
        const plans = JSON.parse(localStorage.getItem('seu_study_plans') || '[]');
        return { success: true, data: plans };
    },

    async getPlan(id) {
        await this.delay();
        const plans = JSON.parse(localStorage.getItem('seu_study_plans') || '[]');
        const plan = plans.find(p => p.id === id);
        return { success: true, data: plan };
    },

    // Sessions - Use StudyPlanner module
    async getTodaySessions() {
        await this.delay();
        const sessions = StudyPlanner.getTodaySessions();
        return { success: true, data: { sessions } };
    },

    async getWeekSessions() {
        await this.delay();
        const sessions = StudyPlanner.getWeekSessions();
        return { success: true, data: sessions };
    },

    async getCalendarSessions(startDate, endDate) {
        await this.delay();
        const plan = StudyPlanner.getCurrentPlan();
        if (!plan) return { success: true, data: {} };
        
        const sessionsByDate = {};
        plan.sessions.forEach(session => {
            if (session.scheduled_date >= startDate && session.scheduled_date <= endDate) {
                if (!sessionsByDate[session.scheduled_date]) {
                    sessionsByDate[session.scheduled_date] = [];
                }
                sessionsByDate[session.scheduled_date].push(session);
            }
        });
        return { success: true, data: sessionsByDate };
    },

    async completeSession(id, notes = '') {
        await this.delay();
        StudyPlanner.completeSession(id);
        return { success: true, message: 'تم إتمام الجلسة' };
    },

    async uncompleteSession(id) {
        await this.delay();
        StudyPlanner.uncompleteSession(id);
        return { success: true, message: 'تم إلغاء الإتمام' };
    },

    // Terms
    async getTerms() {
        await this.delay();
        return { success: true, data: SEU_COMPLETE_DATA.terms };
    },

    async getTermStatus() {
        await this.delay();
        return { success: true, data: SEU_COMPLETE_DATA.terms };
    },

    // Notifications
    async getNotifications() {
        await this.delay();
        const notifications = JSON.parse(localStorage.getItem('seu_notifications') || '[]');
        return { success: true, data: notifications };
    },

    async markAsRead(id) {
        await this.delay();
        const notifications = JSON.parse(localStorage.getItem('seu_notifications') || '[]');
        const notif = notifications.find(n => n.id === id);
        if (notif) notif.is_read = true;
        localStorage.setItem('seu_notifications', JSON.stringify(notifications));
        return { success: true };
    },

    async markAllAsRead() {
        await this.delay();
        const notifications = JSON.parse(localStorage.getItem('seu_notifications') || '[]');
        notifications.forEach(n => n.is_read = true);
        localStorage.setItem('seu_notifications', JSON.stringify(notifications));
        return { success: true };
    },

    // User
    async getProfile() {
        await this.delay();
        const user = JSON.parse(localStorage.getItem(USER_KEY));
        return { success: true, data: user };
    },

    async updateProfile(data) {
        await this.delay();
        const user = JSON.parse(localStorage.getItem(USER_KEY));
        Object.assign(user, data);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        return { success: true, data: user };
    },

    async updatePreferences(data) {
        await this.delay();
        const user = JSON.parse(localStorage.getItem(USER_KEY));
        Object.assign(user, data);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        return { success: true };
    },

    async getStats() {
        await this.delay();
        const stats = StudyPlanner.getStats();
        return { success: true, data: stats };
    }
};

console.log('API module loaded (OFFLINE MODE - No backend required)');
