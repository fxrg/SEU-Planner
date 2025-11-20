// Dashboard Module
const Dashboard = {
    currentPlan: null,

    async load() {
        // Update user name
        const user = Auth.getCurrentUser();
        if (user) {
            document.getElementById('user-name').textContent = user.full_name;
            
            // Update mobile user name if element exists
            const mobileUserName = document.getElementById('mobile-user-name');
            if (mobileUserName) {
                mobileUserName.textContent = user.first_name || user.full_name.split(' ')[0];
            }
        }

        // Update countdown
        this.updateCountdown();

        // Load stats
        this.loadStats();

        // Load today's sessions
        this.loadTodaySessions();

        // Check if user has a plan
        this.checkPlan();

        // Setup event listeners
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Refresh today button
        const refreshBtn = document.getElementById('refresh-today');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadTodaySessions();
            });
        }

        // Delete plan button
        const deletePlanBtn = document.getElementById('delete-plan');
        if (deletePlanBtn) {
            deletePlanBtn.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من حذف الخطة الدراسية؟ لن تتمكن من استرجاعها.')) {
                    localStorage.removeItem('seu_study_plans');
                    UI.showToast('تم حذف الخطة بنجاح', 'success');
                    this.load();
                }
            });
        }

        // Show plan generator
        const showPlanBtn = document.getElementById('show-plan-generator');
        if (showPlanBtn) {
            showPlanBtn.addEventListener('click', () => {
                this.showPlanGenerator();
            });
        }

        // Plan modal close
        const modalClose = document.querySelector('.modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                UI.hideModal('plan-modal');
            });
        }

        // Plan form submit
        const planForm = document.getElementById('plan-form');
        if (planForm) {
            planForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.generatePlan();
            });
        }
    },

    updateCountdown() {
        const days = UI.daysUntil(TERM1_EXAM_DATE);
        const el = document.getElementById('exam-countdown');
        if (!el) return;
        
        if (days > 0) {
            el.textContent = `${days} يوم`;
        } else if (days === 0) {
            el.textContent = 'اليوم!';
        } else {
            el.textContent = 'انتهت';
        }
    },

    loadStats() {
        const stats = StudyPlanner.getStats();
        
        const totalEl = document.getElementById('total-sessions');
        const completedEl = document.getElementById('completed-sessions');
        const hoursEl = document.getElementById('study-hours');
        const progressEl = document.getElementById('progress-percent');
        
        if (totalEl) totalEl.textContent = stats.total_sessions || 0;
        if (completedEl) completedEl.textContent = stats.completed_sessions || 0;
        if (hoursEl) hoursEl.textContent = Math.round(stats.total_study_minutes / 60) || 0;
        if (progressEl) progressEl.textContent = `${stats.completion_rate || 0}%`;
    },

    loadTodaySessions() {
        const container = document.getElementById('today-sessions');
        if (!container) return;
        
        const sessions = StudyPlanner.getTodaySessions();

        if (sessions.length === 0) {
            const user = Auth.getCurrentUser();
            const hasCourses = user && user.selected_courses && user.selected_courses.length > 0;
            
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">${UI.getIcon('book')}</span>
                    <p>لا توجد جلسات اليوم</p>
                    ${!hasCourses ? 
                        `<button id="choose-courses-btn" class="btn btn-primary" style="margin-top: 15px;">اختر موادك ${UI.getIcon('clipboard')}</button>` : 
                        `<button id="create-plan-btn" class="btn btn-primary" style="margin-top: 15px;">إنشاء خطة ${UI.getIcon('calendar')}</button>`
                    }
                </div>
            `;
            
            setTimeout(() => {
                const btn = document.getElementById('choose-courses-btn') || document.getElementById('create-plan-btn');
                if (btn) {
                    btn.onclick = () => {
                        if (btn.id === 'choose-courses-btn') {
                            this.showCourseSelector();
                        } else {
                            this.showPlanGenerator();
                        }
                    };
                }
            }, 100);
            
            return;
        }

    container.innerHTML = sessions.map(session => this.renderSession(session)).join('');

        // Add event listeners for complete buttons
        container.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                this.toggleSession(id);
            });
        });

        // Edit buttons
        container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                this.openEditSession(id);
            });
        });
    },

    renderSession(session) {
        const courseName = session.course_name_ar;
        const duration = UI.formatTime(session.duration_minutes);
        const type = session.session_type_ar;
        const completed = session.is_completed;
        const isFinalReview = session.is_final_review || session.session_type === 'final-review';
        const moduleNumber = session.module_number;
        
        // عنوان المادة مع رقم الموديول
        const titleWithModule = moduleNumber ? 
            `${courseName} <span class="module-badge">موديول ${moduleNumber}</span>` : 
            courseName;

        return `
            <div class="session-card-pro ${completed ? 'completed' : ''} ${isFinalReview ? 'final-review' : ''}">
                <div class="card-status-line"></div>
                <div class="card-main-content">
                    <div class="card-header-row">
                        <span class="course-code-pill">${session.course_code}</span>
                        <span class="time-pill">${UI.getIcon('clock')} ${UI.formatClock(session.scheduled_time)}</span>
                    </div>
                    
                    <h3 class="session-title-pro">
                        ${isFinalReview ? '<span class="fire-icon">🔥</span>' : ''}
                        ${titleWithModule}
                    </h3>
                    
                    <div class="session-meta-grid">
                        <div class="meta-item-pro">
                            <span class="icon-wrapper">${UI.getIcon('timer')}</span>
                            <span class="meta-text">${duration}</span>
                        </div>
                        <div class="meta-item-pro">
                            <span class="icon-wrapper">${UI.getIcon('book')}</span>
                            <span class="meta-text">${type}</span>
                        </div>
                    </div>

                    ${session.notes ? `
                        <div class="session-note-pro">
                            ${UI.getIcon('edit')} ${session.notes}
                        </div>
                    ` : ''}
                </div>

                <div class="card-actions-column">
                    <button class="action-btn-pro complete-btn ${completed ? 'is-completed' : ''}" 
                            data-id="${session.id}" 
                            title="${completed ? 'مكتملة' : 'إتمام'}">
                        ${completed ? UI.getIcon('check') : '<div class="check-ring"></div>'}
                    </button>
                    <button class="action-btn-pro edit-btn" 
                            data-id="${session.id}" 
                            title="تعديل">
                        ${UI.getIcon('settings') || '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>'}
                    </button>
                </div>
            </div>
        `;
    },

    openEditSession(sessionId) {
        const plan = StudyPlanner.getCurrentPlan();
        if (!plan) return;
        const s = plan.sessions.find(x => x.id === sessionId);
        if (!s) return;

        const modalId = 'edit-session-modal';
        const old = document.getElementById(modalId);
        if (old) old.remove();

        const html = `
            <div class="modal active" id="${modalId}">
              <div class="modal-content edit-session-modal-content">
                <div class="modal-header">
                    <h3>تعديل الجلسة</h3>
                    <button class="close-btn" onclick="document.getElementById('${modalId}').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>التاريخ</label>
                        <input type="date" id="edit-session-date" class="form-control form-control-lg" value="${s.scheduled_date}">
                    </div>
                    <div class="form-group">
                        <label>الوقت</label>
                        <input type="time" id="edit-session-time" class="form-control form-control-lg" value="${s.scheduled_time}">
                    </div>
                    <div class="form-group">
                        <label>ملاحظة</label>
                        <input type="text" id="edit-session-notes" class="form-control form-control-lg" value="${s.notes || ''}" placeholder="أضف ملاحظة...">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary btn-lg" onclick="document.getElementById('${modalId}').remove()">إلغاء</button>
                    <button class="btn btn-primary btn-lg" id="save-session-edit">حفظ التغييرات</button>
                </div>
              </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', html);
        document.getElementById('save-session-edit').addEventListener('click', () => {
            const date = document.getElementById('edit-session-date').value;
            const time = document.getElementById('edit-session-time').value;
            const notes = document.getElementById('edit-session-notes').value;

            StudyPlanner.updateSession(sessionId, { scheduled_date: date, scheduled_time: time, notes });
            UI.showToast('تم حفظ التعديلات', 'success');
            document.getElementById(modalId).remove();
            this.loadTodaySessions();
        });
    },

    toggleSession(id) {
        const plan = StudyPlanner.getCurrentPlan();
        if (!plan) return;
        
        const session = plan.sessions.find(s => s.id === id);
        
        if (session.is_completed) {
            StudyPlanner.uncompleteSession(id);
            UI.showToast('تم إلغاء إتمام الجلسة', 'info');
        } else {
            StudyPlanner.completeSession(id);
            UI.showToast('تم إتمام الجلسة بنجاح!', 'success');
        }

        // Reload
        this.loadTodaySessions();
        this.loadStats();
    },

    checkPlan() {
        const plan = StudyPlanner.getCurrentPlan();
        const noPlanSection = document.getElementById('no-plan-section');
        const todaySection = document.getElementById('today-sessions-section');
        
        if (noPlanSection) {
            if (plan) {
                noPlanSection.classList.add('hidden');
                if (todaySection) todaySection.classList.remove('hidden');
            } else {
                noPlanSection.classList.remove('hidden');
                if (todaySection) todaySection.classList.add('hidden');
            }
        }
    },

    showPlanGenerator() {
        UI.showModal('plan-modal');

        const user = Auth.getCurrentUser();

        // Helper to render course list for a given major key
        const renderCoursesForMajor = (majorKey, containerId = 'courses-list') => {
            const major = SEU_COMPLETE_DATA.majors[majorKey];
            if (!major) return;
            const container = document.getElementById(containerId);
            if (!container) return;

            const courseCodes = major.courses || [];

            const searchHTML = `
                <div class="course-search-container">
                    <div class="search-input-wrapper">
                        <input type="text" 
                               id="course-search-input" 
                               class="course-search-input"
                               placeholder="ابحث عن مقرر (الاسم أو الرمز)...">
                        <div class="search-icon">
                            ${UI.getIcon('search') || '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>'}
                        </div>
                    </div>
                </div>
            `;

            const coursesHTML = courseCodes.map(code => {
                const courseData = SEU_COMPLETE_DATA.courses[code] || {
                    code,
                    name_ar: `مقرر ${code}`,
                    name_en: code,
                    difficulty: 3,
                    hours: 3
                };

                return `
                    <label class="course-card-new" data-code="${code}" data-name="${courseData.name_ar.toLowerCase()}">
                        <input type="checkbox" id="course-${code}" value="${code}" data-course='${JSON.stringify(courseData)}'>
                        <div class="course-card-inner">
                            <div class="course-card-top">
                                <span class="course-code-tag">${code}</span>
                                <div class="check-circle">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                            </div>
                            <div class="course-title-new">${courseData.name_ar}</div>
                            <div class="course-meta-new">
                                <div class="meta-item" title="الساعات المعتمدة">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    ${courseData.hours || 3} ساعات
                                </div>
                                <div class="meta-item" title="مستوى الصعوبة">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                    ${courseData.difficulty || 3}/5
                                </div>
                            </div>
                        </div>
                    </label>
                `;
            }).join('');

            container.innerHTML = searchHTML + '<div id="courses-container" class="courses-grid">' + coursesHTML + '</div>';

            // Search behavior
            const searchInput = container.querySelector('#course-search-input');
            const coursesContainer = container.querySelector('#courses-container');
            const allCourseItems = coursesContainer.querySelectorAll('.course-card-new');
            const selectedCountEl = document.getElementById('selected-courses-count');

            // Update count function
            const updateCount = () => {
                // Count checked inputs within the specific container or globally if needed
                // Since we might have multiple lists (unlikely but possible), let's scope to the modal
                const modal = document.getElementById('plan-modal');
                const count = modal.querySelectorAll('input[type="checkbox"]:checked').length;
                if (selectedCountEl) selectedCountEl.textContent = count;
            };

            // Add change listeners to checkboxes
            allCourseItems.forEach(item => {
                const checkbox = item.querySelector('input[type="checkbox"]');
                checkbox.addEventListener('change', updateCount);
            });

            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const searchTerm = e.target.value.toLowerCase().trim();

                    allCourseItems.forEach(item => {
                        const code = item.dataset.code.toLowerCase();
                        const name = item.dataset.name;
                        const matches = code.includes(searchTerm) || name.includes(searchTerm);
                        item.style.display = matches ? 'block' : 'none';
                    });
                });
            }
        };

        // If logged-in user with a major → render directly
        if (user && user.major_id && !Auth.isGuest()) {
            const majorKey = this.getMajorKeyById(user.major_id);
            if (majorKey) renderCoursesForMajor(majorKey);
            return;
        }

        // Guest or no major selected → allow browsing majors
        const container = document.getElementById('courses-list');
        const majors = SEU_COMPLETE_DATA.majors;
        const options = Object.entries(majors).map(([key, m]) => `<option value="${key}">${m.name_ar} — <small>${m.college_ar}</small></option>`).join('');
        const info = `<div class="alert" style="background:#f7f7f7; border:1px solid #eee; padding:10px 12px; border-radius:8px; margin-bottom:12px; color:#666; display: flex; align-items: center; gap: 8px;">
            ${UI.getIcon('eye')} أنت تتصفح كضيف. يمكن رؤية المواد فقط. لإنشاء خطة يلزم تسجيل الدخول.
        </div>`;
        
        const majorPicker = `
            ${Auth.isGuest() ? info : ''}
            <div class="form-group" style="margin-bottom:12px;">
                <label>اختر التخصص لعرض مقرراته:</label>
                <select id="browse-major" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:6px;">
                    ${options}
                </select>
            </div>
            <div id="browse-courses"></div>
        `;
        
        container.innerHTML = majorPicker;
        
        const browseSelect = document.getElementById('browse-major');
        
        const renderForSelected = () => {
            renderCoursesForMajor(browseSelect.value, 'browse-courses');
        };
        
        browseSelect.addEventListener('change', renderForSelected);
        renderForSelected();
    },

    getMajorKeyById(majorId) {
        const mapping = {
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
        return mapping[majorId];
    },

    showCourseSelector() {
        const user = Auth.getCurrentUser();
        if (!user || !user.major_id) {
            UI.showToast('الرجاء تسجيل الدخول', 'error');
            return;
        }

        const majorKey = this.getMajorKeyById(user.major_id);
        const major = SEU_COMPLETE_DATA.majors[majorKey];
        
        if (!major) {
            UI.showToast('لم يتم العثور على التخصص', 'error');
            return;
        }

        const old = document.getElementById('courses-modal');
        if (old) old.remove();

        const html = `
            <div class="modal show" id="courses-modal" style="display: flex !important;">
                <div class="modal-content modal-lg">
                    <div class="modal-header">
                        <div class="header-title">
                            <div class="icon-box-sm">${UI.getIcon('book')}</div>
                            <h3>اختر موادك - ${major.name_ar}</h3>
                        </div>
                        <button class="close-btn" onclick="document.getElementById('courses-modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info" style="margin-bottom: 20px; background: #e3f2fd; color: #0d47a1; border: none; border-radius: 10px; padding: 15px; display: flex; align-items: center; gap: 10px;">
                            ${UI.getIcon('info')}
                            <span>اختر من ${MIN_COURSES} إلى ${MAX_COURSES} مواد لإضافتها إلى ملفك الشخصي.</span>
                        </div>
                        
                        <div class="courses-grid">
                            ${major.courses.map(code => {
                                const c = SEU_COMPLETE_DATA.courses[code] || {
                                    code,
                                    name_ar: `مقرر ${code}`,
                                    name_en: code,
                                    difficulty: 3,
                                    hours: 3
                                };
                                return `
                                <label class="course-card-new" data-code="${code}">
                                    <input type="checkbox" value="${code}" data-course='${JSON.stringify(c)}'>
                                    <div class="course-card-inner">
                                        <div class="course-card-top">
                                            <span class="course-code-tag">${c.code}</span>
                                            <div class="check-circle">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                        </div>
                                        <div class="course-title-new">${c.name_ar}</div>
                                        <div class="course-meta-new">
                                            <div class="meta-item">
                                                ${UI.getIcon('star')}
                                                ${c.difficulty || 3}/5
                                            </div>
                                            <div class="meta-item">
                                                ${UI.getIcon('clock')}
                                                ${c.hours || 3} ساعات
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            `}).join('')}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="selection-info">
                            <span class="info-label">تم اختيار:</span>
                            <span class="badge-count" id="selection-count">0</span>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn btn-secondary btn-lg" onclick="document.getElementById('courses-modal').remove()">إلغاء</button>
                            <button class="btn btn-primary btn-lg" onclick="Dashboard.saveSelectedCourses()">حفظ التغييرات</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);

        // Add counter logic
        const modal = document.getElementById('courses-modal');
        const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
        const counter = document.getElementById('selection-count');

        const updateCount = () => {
            const count = modal.querySelectorAll('input[type="checkbox"]:checked').length;
            counter.textContent = count;
        };

        checkboxes.forEach(cb => cb.addEventListener('change', updateCount));
    },

    saveSelectedCourses() {
        const checks = document.querySelectorAll('#courses-modal input:checked');
        
        if (checks.length < MIN_COURSES || checks.length > MAX_COURSES) {
            UI.showToast(`اختر من ${MIN_COURSES} إلى ${MAX_COURSES} مواد`, 'warning');
            return;
        }

        const courses = Array.from(checks).map(c => JSON.parse(c.dataset.course));

        const user = Auth.getCurrentUser();
        user.selected_courses = courses;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        
        document.getElementById('courses-modal').remove();
        UI.showToast(`تم حفظ ${courses.length} مواد!`, 'success');
        
        setTimeout(() => this.load(), 500);
    },

    generatePlan() {
        // Gate plan generation for guests
        if (Auth.isGuest() || !Auth.isLoggedIn()) {
            UI.showToast('لإنشاء خطة يلزم تسجيل الدخول أولاً', 'warning');
            UI.hideModal('plan-modal');
            window.location.href = 'login.html';
            return;
        }
        const checkboxes = document.querySelectorAll('#courses-list input[type="checkbox"]:checked');
        if (checkboxes.length === 0) {
            UI.showToast('اختر مادة واحدة على الأقل', 'warning');
            return;
        }
        
        if (checkboxes.length < MIN_COURSES || checkboxes.length > MAX_COURSES) {
            UI.showToast(`اختر من ${MIN_COURSES} إلى ${MAX_COURSES} مواد`, 'warning');
            return;
        }

        const courses = Array.from(checkboxes).map(cb => JSON.parse(cb.dataset.course));
        const termId = parseInt(document.getElementById('plan-term').value);
        const intensity = localStorage.getItem(STUDY_INTENSITY_KEY) || 'medium';

        UI.showLoading();
        
        try {
            const plan = StudyPlanner.generatePlan(courses, termId, intensity);
            UI.showToast(`تم إنشاء خطتك الدراسية بنجاح!\n${plan.total_sessions} جلسة دراسية`, 'success');
            UI.hideModal('plan-modal');
            this.load();
        } catch (error) {
            UI.showToast(error.message, 'error');
        } finally {
            UI.hideLoading();
        }
    }
};

console.log('✅ Dashboard module loaded with methods:', Object.keys(Dashboard));
