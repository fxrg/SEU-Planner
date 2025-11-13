// Dashboard Module
const Dashboard = {
    currentPlan: null,

    async load() {
        // Update user name
        const user = Auth.getCurrentUser();
        if (user) {
            document.getElementById('user-name').textContent = user.full_name;
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
                    <span class="empty-icon">📚</span>
                    <p>لا توجد جلسات اليوم</p>
                    ${!hasCourses ? 
                        '<button id="choose-courses-btn" class="btn btn-primary" style="margin-top: 15px;">اختر موادك 📝</button>' : 
                        '<button id="create-plan-btn" class="btn btn-primary" style="margin-top: 15px;">إنشاء خطة 📅</button>'
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
            `${courseName} <span style="display: inline-block; background: linear-gradient(135deg, #5a9fff, #4080d0); color: white; padding: 4px 12px; border-radius: 20px; font-size: 13px; margin-right: 10px; box-shadow: 0 2px 4px rgba(90, 159, 255, 0.3);">📚 موديول ${moduleNumber}</span>` : 
            courseName;

        return `
            <div class="session-card ${completed ? 'completed' : ''} ${isFinalReview ? 'final-review' : ''}">
                <div class="session-info">
                    <div class="session-title">${isFinalReview ? '🔥 ' : ''}${titleWithModule}</div>
                    <div class="session-meta">
                        <span>⏱️ ${duration}</span>
                        <span>📖 ${type}</span>
                        <span>🔢 ${session.course_code}</span>
                        <span>🕐 ${UI.formatClock(session.scheduled_time)}</span>
                        ${isFinalReview ? '<span style="color: #ff5722; font-weight: bold;">⚠️ مراجعة نهائية</span>' : ''}
                    </div>
                    ${session.notes ? `<div class="session-notes" style="margin-top: 8px; color: ${isFinalReview ? '#ff5722' : '#666'}; font-size: 14px;">${session.notes}</div>` : ''}
                    <span class="session-type-badge session-type-${session.session_type}" style="${isFinalReview ? 'background: #ff5722; color: white;' : ''}">${type}</span>
                </div>
                <div class="session-actions">
                    <button class="btn btn-sm ${completed ? 'btn-secondary' : isFinalReview ? 'btn-danger' : 'btn-primary'} complete-btn" 
                            data-id="${session.id}">
                        ${completed ? 'مكتملة' : 'إتمام'}
                    </button>
                    <button class="btn btn-sm btn-secondary edit-btn" data-id="${session.id}" title="تعديل">تعديل</button>
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
              <div class="modal-content" style="max-width: 480px;">
                <div class="modal-header">
                    <h2>تعديل الجلسة</h2>
                    <button class="close-btn" onclick="document.getElementById('${modalId}').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>التاريخ</label>
                        <input type="date" id="edit-session-date" value="${s.scheduled_date}">
                    </div>
                    <div class="form-group">
                        <label>الوقت</label>
                        <input type="time" id="edit-session-time" value="${s.scheduled_time}">
                    </div>
                    <div class="form-group">
                        <label>ملاحظة</label>
                        <input type="text" id="edit-session-notes" value="${s.notes || ''}">
                    </div>
                </div>
                <div class="modal-footer" style="display:flex; gap:10px; justify-content:flex-end;">
                    <button class="btn btn-secondary" onclick="document.getElementById('${modalId}').remove()">إلغاء</button>
                    <button class="btn btn-primary" id="save-session-edit">حفظ</button>
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
            UI.showToast('تم إتمام الجلسة بنجاح! 🎉', 'success');
        }

        // Reload
        this.loadTodaySessions();
        this.loadStats();
    },

    checkPlan() {
        const plan = StudyPlanner.getCurrentPlan();
        const noPlanSection = document.getElementById('no-plan-section');
        
        if (noPlanSection) {
            if (plan) {
                noPlanSection.classList.add('hidden');
            } else {
                noPlanSection.classList.remove('hidden');
            }
        }
    },

    showPlanGenerator() {
        UI.showModal('plan-modal');

        const user = Auth.getCurrentUser();

        // Helper to render course list for a given major key
        const renderCoursesForMajor = (majorKey) => {
            const major = SEU_COMPLETE_DATA.majors[majorKey];
            if (!major) return;
            const container = document.getElementById('courses-list');
            const courseCodes = major.courses || [];

            const searchHTML = `
                <div class="course-search-box" style="margin-bottom: 20px;">
                    <input type="text" 
                           id="course-search-input" 
                           placeholder="🔍 ابحث عن مقرر (الاسم أو الرمز)..."
                           style="width: 100%; padding: 12px 20px; border: 2px solid #e0e0e0; border-radius: 25px; font-size: 15px; transition: all 0.3s;">
                    <div id="search-count" style="margin-top: 8px; color: #666; font-size: 14px;"></div>
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
                    <div class="course-item" data-code="${code}" data-name="${courseData.name_ar.toLowerCase()}">
                        <input type="checkbox" id="course-${code}" value="${code}" data-course='${JSON.stringify(courseData)}'>
                        <label for="course-${code}">
                            <span class="course-code">${code}</span>
                            ${courseData.name_ar}
                            <span class="course-difficulty">
                                ${'⭐'.repeat(courseData.difficulty || 3)}
                            </span>
                        </label>
                    </div>
                `;
            }).join('');

            container.innerHTML = searchHTML + '<div id="courses-container">' + coursesHTML + '</div>';

            // Search behavior
            const searchInput = document.getElementById('course-search-input');
            const searchCount = document.getElementById('search-count');
            const coursesContainer = document.getElementById('courses-container');
            const allCourseItems = coursesContainer.querySelectorAll('.course-item');

            searchCount.textContent = `إجمالي المقررات: ${allCourseItems.length}`;

            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                let visibleCount = 0;

                allCourseItems.forEach(item => {
                    const code = item.dataset.code.toLowerCase();
                    const name = item.dataset.name;
                    const matches = code.includes(searchTerm) || name.includes(searchTerm);
                    item.style.display = matches ? 'flex' : 'none';
                    if (matches) visibleCount++;
                });

                if (searchTerm) {
                    searchCount.textContent = `عرض ${visibleCount} من ${allCourseItems.length} مقرر`;
                    searchCount.style.color = visibleCount > 0 ? '#28a745' : '#dc3545';
                } else {
                    searchCount.textContent = `إجمالي المقررات: ${allCourseItems.length}`;
                    searchCount.style.color = '#666';
                }
            });

            searchInput.addEventListener('focus', (e) => {
                e.target.style.borderColor = '#1a73e8';
                e.target.style.boxShadow = '0 0 0 3px rgba(26, 115, 232, 0.1)';
            });
            searchInput.addEventListener('blur', (e) => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.boxShadow = 'none';
            });
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
        const info = `<div class="alert" style="background:#f7f7f7; border:1px solid #eee; padding:10px 12px; border-radius:8px; margin-bottom:12px; color:#666;">
            👀 أنت تتصفح كضيف. يمكن رؤية المواد فقط. لإنشاء خطة يلزم تسجيل الدخول.
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
        const browseCoursesHost = document.getElementById('browse-courses');
        const renderForSelected = () => {
            // Temporarily point courses-list to host for rendering function
            const old = document.getElementById('courses-list');
            const temp = document.createElement('div');
            temp.id = 'courses-list-temp';
            browseCoursesHost.innerHTML = '';
            browseCoursesHost.appendChild(temp);
            // Render into temp then move its children back
            const original = document.getElementById('courses-list');
            original.id = 'courses-list-orig';
            temp.id = 'courses-list';
            renderCoursesForMajor(browseSelect.value);
            // Move content into host and restore ids
            const rendered = document.getElementById('courses-container')?.parentElement;
            if (rendered) browseCoursesHost.innerHTML = rendered.outerHTML;
            document.getElementById('courses-list').id = 'courses-list-temp-done';
            document.getElementById('courses-list-orig').id = 'courses-list';
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
                <div class="modal-content" style="max-width: 800px;">
                    <div class="modal-header">
                        <h2>اختر موادك - ${major.name_ar}</h2>
                        <button class="modal-close" onclick="document.getElementById('courses-modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <p style="margin-bottom: 15px; color: #666;">اختر من ${MIN_COURSES} إلى ${MAX_COURSES} مواد:</p>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 10px; max-height: 400px; overflow-y: auto;">
                            ${major.courses.map(code => {
                                const c = SEU_COMPLETE_DATA.courses[code] || {
                                    code,
                                    name_ar: `مقرر ${code}`,
                                    name_en: code,
                                    difficulty: 3,
                                    hours: 3
                                };
                                return `
                                <label style="display: flex; align-items: center; padding: 10px; border: 1px solid #ddd; border-radius: 5px; cursor: pointer;">
                                    <input type="checkbox" value="${code}" data-course='${JSON.stringify(c)}' style="margin-left: 10px;">
                                    <div>
                                        <strong style="color: #0066cc;">${c.code}</strong><br>
                                        <span style="font-size: 14px;">${c.name_ar}</span><br>
                                        <span>${'⭐'.repeat(c.difficulty || 3)}</span>
                                    </div>
                                </label>
                            `}).join('')}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="document.getElementById('courses-modal').remove()">إلغاء</button>
                        <button class="btn btn-primary" onclick="Dashboard.saveSelectedCourses()">حفظ</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
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
            UI.showPage('login-page');
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
            UI.showToast(`تم إنشاء خطتك الدراسية بنجاح! 🎉\n${plan.total_sessions} جلسة دراسية`, 'success');
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
