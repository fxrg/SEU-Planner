// Study Planner - نظام التخطيط الدراسي للجامعة السعودية الإلكترونية

const StudyPlanner = {
    // توليد خطة دراسية ذكية
    generatePlan(selectedCourses, termId, intensity = 'medium') {
        const term = termId === 1 ? 'term1' : 'term2';
        const termData = SEU_COMPLETE_DATA.terms[term];
        
        if (!termData.is_open) {
            throw new Error(`الترم الثاني مغلق حتى ${this.formatDate(new Date(termData.opens_on))}`);
        }

        // حساب الأيام المتاحة للدراسة
        const today = new Date();
        const termEndDate = new Date(termData.end_date);
        const examDate = new Date(termData.exam_start_date);
        const daysAvailable = Math.floor((termEndDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysAvailable <= 0) {
            throw new Error('لا يوجد وقت كافٍ قبل نهاية الترم');
        }

        // حساب ساعات الدراسة اليومية بناءً على الكثافة
        const intensityConfig = {
            light: { 
                hoursPerDay: 2,    // ساعتان يومياً
                sessionsPerDay: 1, // جلسة واحدة
                maxDuration: 120   // حد أقصى للجلسة
            },
            medium: { 
                hoursPerDay: 4,    // 4 ساعات يومياً
                sessionsPerDay: 2, // جلستان
                maxDuration: 120
            },
            intensive: { 
                hoursPerDay: 6,    // 6 ساعات يومياً
                sessionsPerDay: 3, // 3 جلسات
                maxDuration: 120
            }
        };
        
        const config = intensityConfig[intensity];
        const totalMinutesPerDay = config.hoursPerDay * 60;
        
        // إنشاء جدول زمني لجميع الأيام المتاحة
        const schedule = {};
        for (let day = 0; day < daysAvailable - 3; day++) { // -3 للمراجعة النهائية
            const date = new Date(today);
            date.setDate(date.getDate() + day);
            
            // إزالة تخطي الجمعة والسبت - السماح بالدراسة في جميع الأيام
            
            const dateStr = date.toISOString().split('T')[0];
            schedule[dateStr] = {
                sessions: [],
                totalMinutes: 0,
                maxMinutes: totalMinutesPerDay
            };
        }
        
        const availableDays = Object.keys(schedule).length;
        
        // توزيع الموديولات (13 موديول لكل مادة)
        const sessions = [];
        let sessionId = 1;
        const scheduleDates = Object.keys(schedule);
        
        selectedCourses.forEach((course, courseIndex) => {
            const modulesPerCourse = 13; // عدد الموديولات لكل مادة
            
            // كل مادة تبدأ من موديول 1 وتنتهي عند 13
            // نستخدم currentDayIndex خاص بكل مادة
            let courseDayIndex = 0;
            
            for (let module = 1; module <= modulesPerCourse; module++) {
                // جلسة قراءة للموديول (60 دقيقة)
                const readingSession = this.createModuleSession(
                    sessionId++,
                    course,
                    module,
                    'reading',
                    60,
                    scheduleDates[(courseDayIndex) % scheduleDates.length]
                );
                
                if (this.canAddSession(schedule, readingSession)) {
                    sessions.push(readingSession);
                    this.addSessionToSchedule(schedule, readingSession);
                }
                courseDayIndex++;
                
                // جلسة تطبيق عملي للموديول (90 دقيقة) - في يوم آخر
                const practiceSession = this.createModuleSession(
                    sessionId++,
                    course,
                    module,
                    'practice',
                    90,
                    scheduleDates[(courseDayIndex) % scheduleDates.length]
                );
                
                if (this.canAddSession(schedule, practiceSession)) {
                    sessions.push(practiceSession);
                    this.addSessionToSchedule(schedule, practiceSession);
                }
                courseDayIndex++;
                
                // جلسة مراجعة للموديول كل 3 موديولات (45 دقيقة)
                if (module % 3 === 0) {
                    const reviewSession = this.createModuleSession(
                        sessionId++,
                        course,
                        module,
                        'review',
                        45,
                        scheduleDates[(courseDayIndex) % scheduleDates.length]
                    );
                    
                    if (this.canAddSession(schedule, reviewSession)) {
                        sessions.push(reviewSession);
                        this.addSessionToSchedule(schedule, reviewSession);
                    }
                    courseDayIndex++;
                }
            }
        });
        
        // ترتيب الجلسات: أولاً حسب التاريخ، ثم حسب المادة، ثم حسب رقم الموديول
        sessions.sort((a, b) => {
            // أولاً: ترتيب حسب التاريخ
            const dateCompare = new Date(a.scheduled_date) - new Date(b.scheduled_date);
            if (dateCompare !== 0) return dateCompare;
            
            // ثانياً: ترتيب حسب كود المادة (لو نفس التاريخ)
            const courseCompare = a.course_code.localeCompare(b.course_code);
            if (courseCompare !== 0) return courseCompare;
            
            // ثالثاً: ترتيب حسب رقم الموديول (لو نفس المادة)
            const moduleA = a.module_number || 0;
            const moduleB = b.module_number || 0;
            return moduleA - moduleB;
        });
        
        // إضافة جلسات المراجعة النهائية قبل الاختبار
        const finalReviewSessions = this.generateFinalReviewSessions(selectedCourses, examDate);
        sessions.push(...finalReviewSessions);
        
        // إعادة ترتيب بعد إضافة المراجعة النهائية
        sessions.sort((a, b) => {
            const dateCompare = new Date(a.scheduled_date) - new Date(b.scheduled_date);
            if (dateCompare !== 0) return dateCompare;
            
            const courseCompare = a.course_code.localeCompare(b.course_code);
            if (courseCompare !== 0) return courseCompare;
            
            const moduleA = a.module_number || 0;
            const moduleB = b.module_number || 0;
            return moduleA - moduleB;
        });

        // إسناد أوقات متسلسلة خلال اليوم لمنع تداخل المواد في نفس الوقت
        this.assignSequentialTimesPerDay(sessions);
        
        // حفظ الخطة
        const plan = {
            id: Date.now(),
            term_id: termId,
            courses: selectedCourses,
            sessions: sessions,
            intensity: intensity,
            created_at: new Date().toISOString(),
            start_date: today.toISOString().split('T')[0],
            end_date: termData.end_date,
            exam_start_date: termData.exam_start_date,
            total_sessions: sessions.length,
            total_study_hours: sessions.reduce((sum, s) => sum + s.duration_minutes, 0) / 60,
            sessions_per_day: config.sessionsPerDay,
            hours_per_day: config.hoursPerDay
        };
        
        this.savePlan(plan);
        this.scheduleNotifications(plan);
        
        return plan;
    },
    
    // تعيين أوقات الجلسات بشكل متسلسل لكل يوم لمنع التداخل
    assignSequentialTimesPerDay(sessions) {
        // وقت بداية اليوم من الإعدادات (افتراضي 09:00)
        const DEFAULT_START_TIME = localStorage.getItem(STUDY_START_TIME_KEY) || '09:00';
        const BREAK_MINUTES = 15; // استراحة بسيطة بين الجلسات

        // تجميع الجلسات حسب التاريخ
        const byDate = sessions.reduce((acc, s) => {
            (acc[s.scheduled_date] ||= []).push(s);
            return acc;
        }, {});

        const timeToMinutes = (t) => {
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
        };
        const minutesToTime = (mins) => {
            const h = Math.floor(mins / 60).toString().padStart(2, '0');
            const m = (mins % 60).toString().padStart(2, '0');
            return `${h}:${m}`;
        };

        Object.keys(byDate).forEach(date => {
            // الجلسات لهذا اليوم مرتبة مسبقاً حسب القواعد العامة
            let cursor = timeToMinutes(DEFAULT_START_TIME);
            byDate[date].forEach(s => {
                s.scheduled_time = minutesToTime(cursor);
                cursor += (s.duration_minutes || 60) + BREAK_MINUTES;
            });
        });
    },
    
    // إنشاء جلسة دراسية لموديول محدد
    createModuleSession(id, course, moduleNumber, type, duration, date) {
        return {
            id: id,
            course_code: course.code,
            course_name_ar: course.name_ar,
            course_name_en: course.name_en,
            module_number: moduleNumber,
            session_type: type,
            session_type_ar: this.getSessionTypeArabic(type),
            duration_minutes: duration,
            scheduled_date: date,
            scheduled_time: this.getOptimalStudyTime(type),
            is_completed: false,
            difficulty: course.difficulty_level || 3,
            notes: `${this.getSessionTypeArabic(type)} - الموديول ${moduleNumber}`
        };
    },
    
    // التحقق من إمكانية إضافة الجلسة لليوم
    canAddSession(schedule, session) {
        const day = schedule[session.scheduled_date];
        if (!day) return false;
        
        return (day.totalMinutes + session.duration_minutes) <= day.maxMinutes;
    },
    
    // إضافة الجلسة للجدول اليومي
    addSessionToSchedule(schedule, session) {
        const day = schedule[session.scheduled_date];
        if (day) {
            day.sessions.push(session);
            day.totalMinutes += session.duration_minutes;
        }
    },
    
    // توليد جلسات المراجعة النهائية قبل الاختبار
    generateFinalReviewSessions(courses, examDate) {
        const sessions = [];
        let sessionId = 10000; // استخدام ID عالي لتمييز جلسات المراجعة النهائية
        
        // جلسات مراجعة نهائية لكل مادة (3 أيام قبل الاختبار)
        courses.forEach(course => {
            for (let dayBefore = 3; dayBefore >= 1; dayBefore--) {
                const reviewDate = new Date(examDate);
                reviewDate.setDate(reviewDate.getDate() - dayBefore);
                
                // إزالة تخطي الجمعة والسبت - السماح بالمراجعة في جميع الأيام
                
                const sessionType = dayBefore === 3 ? 'review' : dayBefore === 2 ? 'quiz' : 'final-review';
                const duration = dayBefore === 1 ? 120 : 90; // جلسة نهائية أطول
                
                sessions.push({
                    id: sessionId++,
                    course_code: course.code,
                    course_name_ar: course.name_ar,
                    course_name_en: course.name_en,
                    session_type: sessionType,
                    session_type_ar: sessionType === 'final-review' ? 'مراجعة نهائية' : this.getSessionTypeArabic(sessionType),
                    duration_minutes: duration,
                    scheduled_date: reviewDate.toISOString().split('T')[0],
                    scheduled_time: dayBefore === 1 ? '09:00' : '10:00',
                    is_completed: false,
                    is_final_review: true,
                    priority: 'high',
                    difficulty: course.difficulty_level || 3,
                    notes: dayBefore === 1 
                        ? `مراجعة نهائية شاملة لـ ${course.name_ar} - يوم واحد قبل الاختبار!`
                        : `مراجعة مكثفة لـ ${course.name_ar} - ${dayBefore} أيام قبل الاختبار`
                });
            }
        });
        
        return sessions;
    },
    
    // الحصول على الترجمة العربية لنوع الجلسة
    getSessionTypeArabic(type) {
        const types = {
            reading: 'قراءة ومذاكرة',
            practice: 'تطبيق عملي',
            review: 'مراجعة',
            quiz: 'اختبار تجريبي',
            group: 'دراسة جماعية'
        };
        return types[type] || type;
    },
    
    // الحصول على الوقت المثالي للدراسة
    getOptimalStudyTime(sessionType) {
        const times = {
            reading: '09:00',      // قراءة في الصباح
            practice: '10:00',     // تطبيق في الصباح
            review: '16:00',       // مراجعة بعد الظهر
            quiz: '14:00',         // اختبارات بعد الظهر
            group: '19:00'         // دراسة جماعية مساءً
        };
        return times[sessionType] || '10:00';
    },
    
    // ملاحظات الجلسة
    getSessionNotes(type, courseName) {
        const notes = {
            reading: `اقرأ الفصل الجديد من مادة ${courseName} وسجل الملاحظات المهمة`,
            practice: `حل التمارين والأمثلة العملية من ${courseName}`,
            review: `راجع ما تم دراسته سابقاً في ${courseName}`,
            quiz: `اختبر نفسك في ${courseName} باستخدام أسئلة تجريبية`,
            group: `ناقش المواضيع الصعبة في ${courseName} مع زملائك`
        };
        return notes[type] || '';
    },
    
    // حفظ الخطة
    savePlan(plan) {
        const user = Auth.getCurrentUser();
        if (!user) return;
        
        const plans = JSON.parse(localStorage.getItem('seu_study_plans') || '[]');
        plans.push(plan);
        localStorage.setItem('seu_study_plans', JSON.stringify(plans));
        
        // حفظ الخطة الحالية
        user.current_plan = plan.id;
        user.selected_courses = plan.courses;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    
    // الحصول على الخطة الحالية
    getCurrentPlan() {
        const user = Auth.getCurrentUser();
        if (!user || !user.current_plan) return null;
        
        const plans = JSON.parse(localStorage.getItem('seu_study_plans') || '[]');
        return plans.find(p => p.id === user.current_plan);
    },
    
    // الحصول على جلسات اليوم
    getTodaySessions() {
        const plan = this.getCurrentPlan();
        if (!plan) return [];
        
        const today = new Date().toISOString().split('T')[0];
        return plan.sessions.filter(s => s.scheduled_date === today);
    },
    
    // الحصول على جلسات الأسبوع
    getWeekSessions(weekOffset = 0) {
        const plan = this.getCurrentPlan();
        if (!plan) return [];
        
        const today = new Date();
        today.setDate(today.getDate() + (weekOffset * 7));
        
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const startStr = weekStart.toISOString().split('T')[0];
        const endStr = weekEnd.toISOString().split('T')[0];
        
        return plan.sessions.filter(s => s.scheduled_date >= startStr && s.scheduled_date <= endStr);
    },
    
    // إتمام جلسة
    completeSession(sessionId) {
        const plan = this.getCurrentPlan();
        if (!plan) return;
        
        const session = plan.sessions.find(s => s.id === sessionId);
        if (session) {
            session.is_completed = true;
            session.completed_at = new Date().toISOString();
            this.updatePlan(plan);
        }
    },
    
    // إلغاء إتمام جلسة
    uncompleteSession(sessionId) {
        const plan = this.getCurrentPlan();
        if (!plan) return;
        
        const session = plan.sessions.find(s => s.id === sessionId);
        if (session) {
            session.is_completed = false;
            delete session.completed_at;
            this.updatePlan(plan);
        }
    },
    
    // تحديث الخطة
    updatePlan(plan) {
        const plans = JSON.parse(localStorage.getItem('seu_study_plans') || '[]');
        const index = plans.findIndex(p => p.id === plan.id);
        if (index !== -1) {
            plans[index] = plan;
            localStorage.setItem('seu_study_plans', JSON.stringify(plans));
        }
    },

    // تحديث جلسة واحدة (تاريخ/وقت/ملاحظات...)
    updateSession(sessionId, patch) {
        const plan = this.getCurrentPlan();
        if (!plan) return;
        const s = plan.sessions.find(x => x.id === sessionId);
        if (!s) return;
        Object.assign(s, patch);
        this.updatePlan(plan);
        return s;
    },

    // تطبيق وقت بداية الدراسة الجديد على الخطة الحالية (إعادة ضبط أوقات اليوم فقط)
    applyStudyStartTime() {
        const plan = this.getCurrentPlan();
        if (!plan) return;

        // اعد تعيين الأوقات لجميع الجلسات بحسب الوقت المختار
        this.assignSequentialTimesPerDay(plan.sessions);
        this.updatePlan(plan);
        return plan;
    },
    
    // الحصول على الإحصائيات
    getStats() {
        const plan = this.getCurrentPlan();
        if (!plan) {
            return {
                total_sessions: 0,
                completed_sessions: 0,
                total_study_minutes: 0,
                completion_rate: 0
            };
        }
        
        const completedSessions = plan.sessions.filter(s => s.is_completed);
        const totalMinutes = completedSessions.reduce((sum, s) => sum + s.duration_minutes, 0);
        
        return {
            total_sessions: plan.sessions.length,
            completed_sessions: completedSessions.length,
            total_study_minutes: totalMinutes,
            completion_rate: Math.round((completedSessions.length / plan.sessions.length) * 100)
        };
    },
    
    // جدولة الإشعارات
    scheduleNotifications(plan) {
        if (!('Notification' in window)) {
            console.log('المتصفح لا يدعم الإشعارات');
            return;
        }
        
        // طلب إذن الإشعارات
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
        
        // حفظ معلومات الإشعارات
        const notificationTime = localStorage.getItem(NOTIFICATION_TIME_KEY) || DEFAULT_NOTIFICATION_TIME;
        localStorage.setItem('last_notification_date', new Date().toISOString().split('T')[0]);
    },
    
    // إرسال إشعار يومي
    sendDailyNotification() {
        if (Notification.permission !== 'granted') return;
        
        const todaySessions = this.getTodaySessions();
        if (todaySessions.length === 0) return;
        
        const incompleteSessions = todaySessions.filter(s => !s.is_completed);
        if (incompleteSessions.length === 0) {
            new Notification('SEU Planner', {
                body: 'أحسنت! أكملت جميع جلسات اليوم',
                icon: '/icon.png'
            });
            return;
        }
        
        const firstSession = incompleteSessions[0];
        new Notification('SEU Planner - تذكير دراسي', {
            body: `لديك ${incompleteSessions.length} جلسات اليوم.\nابدأ بـ: ${firstSession.course_name_ar} - ${firstSession.session_type_ar}`,
            icon: '/icon.png',
            tag: 'daily-reminder'
        });
    },
    
    // فحص وإرسال الإشعارات اليومية
    checkAndSendNotifications() {
        const enabled = localStorage.getItem(NOTIFICATION_ENABLED_KEY) === 'true';
        if (!enabled) return;
        
        const lastNotificationDate = localStorage.getItem('last_notification_date');
        const today = new Date().toISOString().split('T')[0];
        
        if (lastNotificationDate !== today) {
            this.sendDailyNotification();
            localStorage.setItem('last_notification_date', today);
        }
    },
    
    // تنسيق التاريخ
    formatDate(date) {
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
};

// فحص الإشعارات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // فحص الإشعارات كل ساعة
    StudyPlanner.checkAndSendNotifications();
    setInterval(() => {
        StudyPlanner.checkAndSendNotifications();
    }, 60 * 60 * 1000); // كل ساعة
});

console.log('Study Planner module loaded');
