// API Helper Functions - OFFLINE MODE (No Backend Required)
const API = {
    // Get token from localStorage
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    // Set token in localStorage
    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    },

    // Remove token
    removeToken() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    // Simulate async operations
    async delay(ms = 300) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Auth endpoints - LOCAL ONLY
    async login(email, password) {
        await this.delay();
        
        // Get all users
        const users = JSON.parse(localStorage.getItem('seu_users') || '[]');
        
        // Find user
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }
        
        // Generate token
        const token = 'local_token_' + Date.now();
        this.setToken(token);
        
        // Save current user
        const userData = { ...user };
        delete userData.password; // Don't store password in current user
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        
        return { success: true, data: { token, user: userData } };
    },

    async register(userData) {
        await this.delay();
        
        // Get all users
        const users = JSON.parse(localStorage.getItem('seu_users') || '[]');
        
        // Check if email exists
        if (users.find(u => u.email === userData.email)) {
            throw new Error('البريد الإلكتروني مستخدم بالفعل');
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            ...userData,
            created_at: new Date().toISOString(),
            selected_courses: [],
            current_plan: null
        };
        
        // Save user
        users.push(newUser);
        localStorage.setItem('seu_users', JSON.stringify(users));
        
        // Generate token
        const token = 'local_token_' + Date.now();
        this.setToken(token);
        
        // Save current user
        const userToSave = { ...newUser };
        delete userToSave.password;
        localStorage.setItem(USER_KEY, JSON.stringify(userToSave));
        
        return { success: true, data: { token, user: userToSave } };
    },


    async getMe() {
        await this.delay();
        const user = JSON.parse(localStorage.getItem(USER_KEY));
        if (!user) throw new Error('غير مسجل');
        return { success: true, data: user };
    },

    // Majors & Courses - From local data
    async getMajors() {
        await this.delay();
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
        return { success: true, data: majors };
    },

    async getMajor(id) {
        await this.delay();
        // This would return major details with courses
        return { success: true, data: { id, name_ar: 'تخصص', courses: [] } };
    },

    async getCourses(majorId) {
        await this.delay();
        return { success: true, data: [] };
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

console.log('✅ API module loaded (OFFLINE MODE - No backend required)');
