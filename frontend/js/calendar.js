// Calendar Module
const Calendar = {
    currentWeekOffset: 0,

    async load() {
        await this.render();
        this.setupEventListeners();
    },

    setupEventListeners() {
        document.getElementById('prev-week').addEventListener('click', () => {
            this.currentWeekOffset--;
            this.render();
        });

        document.getElementById('next-week').addEventListener('click', () => {
            this.currentWeekOffset++;
            this.render();
        });
    },

    render() {
        const sessions = StudyPlanner.getWeekSessions(this.currentWeekOffset);
        
        // حساب تواريخ الأسبوع
        const today = new Date();
        today.setDate(today.getDate() + (this.currentWeekOffset * 7));
        
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        // تحديث العنوان مع التقويم المختار
        const calendarType = localStorage.getItem('calendar_type') || 'gregorian';
        const showBothDates = localStorage.getItem('show_both_dates') === 'true';
        
        let titleText = '';
        if (showBothDates) {
            titleText = `${this.formatDateWithType(weekStart, calendarType, true)} - ${this.formatDateWithType(weekEnd, calendarType, true)}`;
        } else if (calendarType === 'hijri') {
            titleText = `${this.formatDateWithType(weekStart, 'hijri', false)} - ${this.formatDateWithType(weekEnd, 'hijri', false)}`;
        } else {
            titleText = `${this.formatDate(weekStart)} - ${this.formatDate(weekEnd)}`;
        }
        
        document.getElementById('calendar-title').textContent = titleText;

        // تجميع الجلسات حسب اليوم
        const sessionsByDay = {};
        sessions.forEach(session => {
            if (!sessionsByDay[session.scheduled_date]) {
                sessionsByDay[session.scheduled_date] = [];
            }
            sessionsByDay[session.scheduled_date].push(session);
        });

        this.renderWeek(weekStart, sessionsByDay, calendarType, showBothDates);
    },

    renderWeek(weekStart, sessionsByDay, calendarType, showBothDates) {
        const grid = document.getElementById('calendar-grid');
        grid.innerHTML = '';

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            
            const dateStr = date.toISOString().split('T')[0];
            const sessions = sessionsByDay[dateStr] || [];
            
            const isToday = date.getTime() === today.getTime();
            const isPast = date < today;

            const dayEl = document.createElement('div');
            dayEl.className = `calendar-day ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}`;
            
            // حساب نسبة الإنجاز
            const completedCount = sessions.filter(s => s.is_completed).length;
            const completionRate = sessions.length > 0 ? Math.round((completedCount / sessions.length) * 100) : 0;
            
            // عرض التاريخ حسب الإعدادات
            let dateDisplay = '';
            if (showBothDates) {
                const hijri = this.gregorianToHijri(date);
                dateDisplay = `${date.getDate()} (${hijri.day} ${hijri.monthName.substring(0, 6)})`;
            } else if (calendarType === 'hijri') {
                const hijri = this.gregorianToHijri(date);
                dateDisplay = `${hijri.day} ${hijri.monthName}`;
            } else {
                dateDisplay = date.getDate();
            }
            
            dayEl.innerHTML = `
                <div class="day-header">
                    <span class="day-number">${dateDisplay}</span>
                    <span class="day-name">${this.getDayName(date.getDay())}</span>
                    ${sessions.length > 0 ? `<span class="day-badge">${sessions.length}</span>` : ''}
                </div>
                <div class="day-sessions">
                    ${sessions.length === 0 ? 
                        '<div class="no-sessions">لا توجد جلسات</div>' :
                        sessions.map(s => this.renderCalendarSession(s)).join('')
                    }
                </div>
                ${sessions.length > 0 ? `
                    <div class="day-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${completionRate}%"></div>
                        </div>
                        <span class="progress-text">${completionRate}%</span>
                    </div>
                ` : ''}
            `;

            grid.appendChild(dayEl);
        }
    },

    renderCalendarSession(session) {
        return `
            <div class="calendar-session ${session.session_type} ${session.is_completed ? 'completed' : ''}" 
                 title="${session.course_name_ar} - ${session.session_type_ar}">
                <span class="session-time">${UI.getIcon('clock')} ${UI.formatClock(session.scheduled_time)}</span>
                <span class="session-course">${session.course_code}</span>
                <span class="session-type-badge-sm">${session.session_type_ar}</span>
                ${session.is_completed ? `<span class="completed-check">${UI.getIcon('check')}</span>` : ''}
            </div>
        `;
    },

    getDayName(day) {
        const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        return days[day];
    },

    formatDate(date) {
        // استخدام en-US للحصول على التاريخ الميلادي ثم ترجمته
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const gregorianDate = date.toLocaleDateString('en-US', options);
        
        // ترجمة أسماء الشهور للعربية
        const monthNames = {
            'January': 'يناير', 'February': 'فبراير', 'March': 'مارس',
            'April': 'أبريل', 'May': 'مايو', 'June': 'يونيو',
            'July': 'يوليو', 'August': 'أغسطس', 'September': 'سبتمبر',
            'October': 'أكتوبر', 'November': 'نوفمبر', 'December': 'ديسمبر'
        };
        
        let result = gregorianDate;
        for (const [eng, ar] of Object.entries(monthNames)) {
            result = result.replace(eng, ar);
        }
        
        return result + ' م';
    },
    
    // تحويل التاريخ الميلادي إلى هجري (تقريبي)
    gregorianToHijri(date) {
        // حساب تقريبي: التاريخ الهجري = (التاريخ الميلادي - 622) * 1.030684
        const gYear = date.getFullYear();
        const gMonth = date.getMonth() + 1;
        const gDay = date.getDate();
        
        // حساب عدد الأيام من بداية التقويم الميلادي
        let totalDays = gDay;
        const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        for (let i = 0; i < gMonth - 1; i++) {
            totalDays += monthDays[i];
        }
        // إضافة يوم كبيسة
        if (gMonth > 2 && ((gYear % 4 === 0 && gYear % 100 !== 0) || gYear % 400 === 0)) {
            totalDays++;
        }
        totalDays += (gYear - 1) * 365 + Math.floor((gYear - 1) / 4) - Math.floor((gYear - 1) / 100) + Math.floor((gYear - 1) / 400);
        
        // التحويل إلى هجري (التاريخ الهجري يبدأ من 16 يوليو 622م)
        const hijriEpoch = 227015; // عدد الأيام من 1/1/1 إلى 1/1/1هـ
        let hijriDays = totalDays - hijriEpoch;
        
        // حساب السنة الهجرية (سنة هجرية = 354.36 يوم)
        const hYear = Math.floor(hijriDays / 354.36) + 1;
        hijriDays = hijriDays - Math.floor((hYear - 1) * 354.36);
        
        // حساب الشهر الهجري
        const hijriMonthDays = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
        let hMonth = 1;
        while (hijriDays > hijriMonthDays[hMonth - 1] && hMonth < 12) {
            hijriDays -= hijriMonthDays[hMonth - 1];
            hMonth++;
        }
        
        const hDay = Math.floor(hijriDays);
        
        const monthNames = [
            'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة',
            'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
        ];
        
        return {
            day: hDay,
            month: hMonth,
            year: hYear,
            monthName: monthNames[hMonth - 1],
            formatted: `${hDay} ${monthNames[hMonth - 1]} ${hYear}هـ`
        };
    },
    
    formatDateWithType(date, calendarType, showBoth = false) {
        // التاريخ الميلادي
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const gregorianEng = date.toLocaleDateString('en-US', options);
        
        // ترجمة أسماء الشهور للعربية
        const monthNames = {
            'January': 'يناير', 'February': 'فبراير', 'March': 'مارس',
            'April': 'أبريل', 'May': 'مايو', 'June': 'يونيو',
            'July': 'يوليو', 'August': 'أغسطس', 'September': 'سبتمبر',
            'October': 'أكتوبر', 'November': 'نوفمبر', 'December': 'ديسمبر'
        };
        
        let gregorian = gregorianEng;
        for (const [eng, ar] of Object.entries(monthNames)) {
            gregorian = gregorian.replace(eng, ar);
        }
        gregorian = gregorian + ' م';
        
        if (calendarType === 'gregorian' && !showBoth) {
            return gregorian;
        }
        
        const hijri = this.gregorianToHijri(date);
        
        if (calendarType === 'hijri' && !showBoth) {
            return hijri.formatted;
        }
        
        // عرض التاريخين معاً
        return `${gregorian} (${hijri.formatted})`;
    }
};

console.log('✅ Calendar module loaded');
