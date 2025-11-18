// Group Study Sessions (Firebase Firestore)
const Sessions = {
  _unsub: null,
  _unsubParticipants: null,
  _timer: null,
  current: null,
  _inited: false,

  useFirestore() {
    return !!(window.FIREBASE_ENABLED && window.firebase && window.db);
  },

  getUser() {
    // Prefer Firebase currentUser when available (supports anonymous auth)
    try {
      if (window.FIREBASE_ENABLED && firebase && firebase.auth && firebase.auth().currentUser) {
        const fu = firebase.auth().currentUser;
        let displayName = fu.displayName;
        
        // Try to get name from localStorage if Firebase doesn't have it
        if (!displayName || displayName === 'مشارك') {
          try {
            const localUser = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
            displayName = localUser.full_name || displayName;
          } catch(e) {}
        }
        
        return {
          id: fu.uid,
          full_name: displayName || 'مشارك',
          email: fu.email || null
        };
      }
    } catch(_) {}
    return Auth.getCurrentUser();
  },

  async ensureAuth() {
    if (!(window.FIREBASE_ENABLED && firebase && firebase.auth)) return;
    if (firebase.auth().currentUser) return;
    // Try anonymous sign-in to support sessions without full registration
    try {
      await firebase.auth().signInAnonymously();
      console.log('Signed in anonymously for sessions');
    } catch (e) {
      console.warn('Anonymous sign-in failed', e);
    }
  },

  pageEls: {},

  async load() {
    // Cache elements (safe to call multiple times)
    this.pageEls = {
      createForm: document.getElementById('session-create-form'),
      createBtn: document.getElementById('session-create-btn'),
      nameInput: document.getElementById('session-name'),
      hoursInput: document.getElementById('session-hours'),
      breaksInput: document.getElementById('session-breaks'),
      breakDurationInput: document.getElementById('session-break-duration'),
      joinForm: document.getElementById('session-join-form'),
      joinBtn: document.getElementById('session-join-btn'),
      codeInput: document.getElementById('session-code-input'),
      currentBox: document.getElementById('current-session'),
      codeDisplay: document.getElementById('session-code-display'),
      title: document.getElementById('session-title'),
      owner: document.getElementById('session-owner'),
      status: document.getElementById('session-status'),
      statusChip: document.getElementById('status-chip'),
      countdown: document.getElementById('session-countdown'),
      participantsList: document.getElementById('participants-list'),
      participantsCount: document.getElementById('participants-count'),
      startBtn: document.getElementById('start-session-btn'),
      startBreakBtn: document.getElementById('start-break-btn'),
      endBreakBtn: document.getElementById('end-break-btn'),
      endBtn: document.getElementById('end-session-btn'),
      leaveBtn: document.getElementById('leave-session-btn'),
      breaksInfo: document.getElementById('breaks-info'),
      breaksRemaining: document.getElementById('breaks-remaining'),
      countdownLabel: document.getElementById('countdown-label'),
    };

    if (!this.useFirestore()) {
      UI.showToast('ميزة الجلسات تحتاج تفعيل Firebase', 'warning');
    }

    // Wire forms (use onclick to avoid duplicate listeners)
    const handleCreate = async () => {
      console.log('🔵 Create button clicked'); // debug
      const name = (this.pageEls.nameInput?.value || '').trim();
      const hours = parseFloat(this.pageEls.hoursInput?.value || '3');
      const breaks = parseInt(this.pageEls.breaksInput?.value || '2', 10);
      const breakDuration = parseInt(this.pageEls.breakDurationInput?.value || '15', 10);
      
      if (!name) {
        UI.showToast('أدخل اسم الجلسة', 'warning');
        return;
      }
      
      if (!this.useFirestore()) {
        UI.showToast('ميزة الجلسات تحتاج تفعيل Firebase Firestore', 'warning');
        return;
      }
      try {
        this._setBusy(true);
        await this.ensureAuth();
        const u = this.getUser();
        if (!u || !u.id || u.id === 'guest') {
          UI.showToast('سجّل الدخول أو فعّل Anonymous Auth في Firebase', 'warning');
          return;
        }
        const { code } = await this.createSession({ 
          name, 
          hours,
          breaks,
          breakDuration
        });
        UI.showToast('تم إنشاء الجلسة! شارك الكود مع أصدقائك 👍', 'success');
        this._saveActiveCode(code);
        this.goToSessionPage(code);
      } catch (err) {
        console.error(err);
        if (err && (err.code === 'permission-denied' || /insufficient permissions/i.test(err.message || ''))) {
          UI.showToast('صلاحيات Firestore غير كافية. حدّث قواعد الأمان للسماح بإنشاء الجلسات.', 'error');
        } else {
          UI.showToast(err?.message || 'تعذر إنشاء الجلسة', 'error');
        }
      } finally { this._setBusy(false); }
    };
    if (this.pageEls.createForm) {
      this.pageEls.createForm.onsubmit = (e) => { e.preventDefault(); return false; };
    }
    if (this.pageEls.createBtn) {
      this.pageEls.createBtn.onclick = handleCreate;
    }

    const handleJoin = async () => {
      console.log('🔵 Join button clicked'); // debug
      const code = (this.pageEls.codeInput?.value || '').trim().toUpperCase();
      if (!code) { UI.showToast('أدخل كود الجلسة', 'warning'); return; }
      if (!this.useFirestore()) { UI.showToast('ميزة الجلسات تحتاج تفعيل Firebase Firestore', 'warning'); return; }
      try {
        this._setBusy(true);
        await this.ensureAuth();
        const u = this.getUser();
        if (!u || !u.id || u.id === 'guest') {
          UI.showToast('سجّل الدخول أو فعّل Anonymous Auth في Firebase', 'warning');
          return;
        }
        await this.joinSession(code);
        UI.showToast('تم الانضمام للجلسة ✨', 'success');
        this._saveActiveCode(code);
        this.goToSessionPage(code);
      } catch (err) {
        console.error(err);
        if (err && (err.code === 'permission-denied' || /insufficient permissions/i.test(err.message || ''))) {
          UI.showToast('صلاحيات Firestore غير كافية. حدّث قواعد الأمان للسماح بالانضمام للجلسات.', 'error');
        } else {
          UI.showToast(err?.message || 'تعذر الانضمام للجلسة', 'error');
        }
      } finally { this._setBusy(false); }
    };
    if (this.pageEls.joinForm) {
      this.pageEls.joinForm.onsubmit = (e) => { e.preventDefault(); return false; };
    }
    if (this.pageEls.joinBtn) {
      this.pageEls.joinBtn.onclick = handleJoin;
    }
    // Force uppercase as user types
    if (this.pageEls.codeInput) {
      this.pageEls.codeInput.addEventListener('input', () => {
        this.pageEls.codeInput.value = this.pageEls.codeInput.value.toUpperCase();
      });
    }

    if (this.pageEls.startBtn) {
      this.pageEls.startBtn.onclick = async () => {
        try {
          this._setBusy(true);
          await this.startSession();
        } catch (e) {
          UI.showToast(e.message || 'تعذر بدء الجلسة', 'error');
        } finally { this._setBusy(false); }
      };
    }

    if (this.pageEls.startBreakBtn) {
      this.pageEls.startBreakBtn.onclick = async () => {
        try {
          this._setBusy(true);
          await this.startBreak();
          UI.showToast('بدأت الاستراحة ☕', 'success');
        } catch (e) {
          UI.showToast(e.message || 'تعذر بدء الاستراحة', 'error');
        } finally { this._setBusy(false); }
      };
    }

    if (this.pageEls.endBreakBtn) {
      this.pageEls.endBreakBtn.onclick = async () => {
        try {
          this._setBusy(true);
          await this.endBreak();
          UI.showToast('استمرت الدراسة 📚', 'success');
        } catch (e) {
          UI.showToast(e.message || 'تعذر إنهاء الاستراحة', 'error');
        } finally { this._setBusy(false); }
      };
    }

    if (this.pageEls.endBtn) {
      this.pageEls.endBtn.onclick = async () => {
        try {
          this._setBusy(true);
          await this.endSession();
        } catch (e) {
          UI.showToast(e.message || 'تعذر إنهاء الجلسة', 'error');
        } finally { this._setBusy(false); }
      };
    }

    if (this.pageEls.leaveBtn) {
      this.pageEls.leaveBtn.onclick = async () => {
        try {
          this._setBusy(true);
          await this.leaveSession();
          UI.showToast('غادرت الجلسة', 'info');
          this._clearActive();
          this._render(null);
        } catch (e) {
          UI.showToast(e.message || 'تعذر المغادرة', 'error');
        } finally { this._setBusy(false); }
      };
    }

    // Auto open if active code stored
    const activeCode = this._getActiveCode();
    if (activeCode) {
      try { await this.open(activeCode); } catch (_) {}
    } else {
      this._render(null);
    }

    // Clean up presence on unload
    window.addEventListener('beforeunload', () => {
      this._cleanupPresence().catch(() => {});
    });
  },

  _sessionsCol() { return window.db.collection('sessions'); },

  _genCode(len = 6) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let c = '';
    for (let i = 0; i < len; i++) c += chars[Math.floor(Math.random() * chars.length)];
    return c;
  },

  _saveActiveCode(code) { localStorage.setItem('ACTIVE_SESSION_CODE', code); },
  _getActiveCode() { return localStorage.getItem('ACTIVE_SESSION_CODE'); },
  _clearActive() { localStorage.removeItem('ACTIVE_SESSION_CODE'); },

  async createSession({ name, hours, breaks, breakDuration }) {
    if (!this.useFirestore()) throw new Error('Firebase غير مفعّل');
    const user = this.getUser();
    if (!user || !user.id || user.id === 'guest') throw new Error('سجّل الدخول أولاً');

    // ensure unique code
    let code = this._genCode();
    let exists = true; let tries = 0;
    while (exists && tries < 5) {
      const doc = await this._sessionsCol().doc(code).get();
      exists = doc.exists; tries++; if (exists) code = this._genCode();
    }

    const now = firebase.firestore.FieldValue.serverTimestamp();
    const totalMinutes = (hours || 3) * 60;
    
    await this._sessionsCol().doc(code).set({
      code,
      name: name || 'جلسة مذاكرة',
      ownerId: user.id,
      ownerName: user.full_name || 'مستخدم',
      durationSec: totalMinutes * 60,
      hours: hours || 3,
      breaks: breaks || 0,
      breaksUsed: 0,
      breakDuration: breakDuration || 15,
      status: 'pending',
      startAt: null,
      onBreak: false,
      breakStartAt: null,
      createdAt: now,
      participantsCount: 0
    });

    // add owner as participant
    await this._sessionsCol().doc(code).collection('participants').doc(user.id).set({
      name: user.full_name || 'مستخدم',
      joinedAt: now,
      lastSeenAt: now
    }, { merge: true });

    return { code };
  },

  async joinSession(code) {
    if (!this.useFirestore()) throw new Error('Firebase غير مفعّل');
    const user = this.getUser();
    if (!user || !user.id || user.id === 'guest') throw new Error('سجّل الدخول أولاً');

    code = (code || '').toUpperCase();
    const ref = this._sessionsCol().doc(code);
    const snap = await ref.get();
    if (!snap.exists) throw new Error('الجلسة غير موجودة');

    const now = firebase.firestore.FieldValue.serverTimestamp();
    await ref.collection('participants').doc(user.id).set({
      name: user.full_name || 'مستخدم',
      joinedAt: now,
      lastSeenAt: now
    }, { merge: true });

    return { code };
  },

  async open(code) {
    if (!this.useFirestore()) throw new Error('Firebase غير مفعّل');
    // unsubscribe previous
    if (this._unsub) { this._unsub(); this._unsub = null; }
    if (this._unsubParticipants) { this._unsubParticipants(); this._unsubParticipants = null; }
    if (this._timer) { clearInterval(this._timer); this._timer = null; }

    const ref = this._sessionsCol().doc(code);
    this._unsub = ref.onSnapshot((doc) => {
      if (!doc.exists) {
        this.current = null;
        this._render(null);
        return;
      }
      this.current = { id: doc.id, code: doc.id, ...doc.data() };
      this._render(this.current);
    });

    this._unsubParticipants = ref.collection('participants').onSnapshot((qs) => {
      const participants = [];
      qs.forEach(d => participants.push({ id: d.id, ...d.data() }));
      if (this.current) {
        this.current.participants = participants;
        this._render(this.current);
      }
    });

    // presence ping
    const user = this.getUser();
    if (user && user.id !== 'guest') {
      const partRef = ref.collection('participants').doc(user.id);
      const updatePresence = () => partRef.set({ lastSeenAt: firebase.firestore.FieldValue.serverTimestamp(), name: user.full_name || 'مستخدم' }, { merge: true });
      await updatePresence();
      this._presenceInterval = setInterval(updatePresence, 60 * 1000);
    }
  },

  async startSession() {
    if (!this.current) throw new Error('لا توجد جلسة مفتوحة');
    const user = this.getUser();
    if (this.current.ownerId !== user.id) throw new Error('فقط صاحب الجلسة يستطيع البدء');
    const ref = this._sessionsCol().doc(this.current.code);
    await ref.update({ status: 'active', startAt: firebase.firestore.FieldValue.serverTimestamp() });
  },

  async endSession() {
    if (!this.current) throw new Error('لا توجد جلسة مفتوحة');
    const user = this.getUser();
    if (this.current.ownerId !== user.id) throw new Error('فقط صاحب الجلسة يستطيع الإنهاء');
    const ref = this._sessionsCol().doc(this.current.code);
    await ref.update({ status: 'ended' });
  },

  async startBreak() {
    if (!this.current) throw new Error('لا توجد جلسة مفتوحة');
    const user = this.getUser();
    if (this.current.ownerId !== user.id) throw new Error('فقط صاحب الجلسة يستطيع بدء الاستراحة');
    if (this.current.status !== 'active') throw new Error('الجلسة يجب أن تكون نشطة');
    
    const breaksUsed = this.current.breaksUsed || 0;
    const totalBreaks = this.current.breaks || 0;
    
    if (breaksUsed >= totalBreaks) {
      throw new Error('تم استخدام جميع الاستراحات');
    }
    
    const ref = this._sessionsCol().doc(this.current.code);
    await ref.update({ 
      onBreak: true,
      breakStartAt: firebase.firestore.FieldValue.serverTimestamp(),
      breaksUsed: breaksUsed + 1
    });
  },

  async endBreak() {
    if (!this.current) throw new Error('لا توجد جلسة مفتوحة');
    const user = this.getUser();
    if (this.current.ownerId !== user.id) throw new Error('فقط صاحب الجلسة يستطيع إنهاء الاستراحة');
    
    const ref = this._sessionsCol().doc(this.current.code);
    await ref.update({ 
      onBreak: false,
      breakStartAt: null
    });
  },

  async leaveSession() {
    if (!this.current) return;
    const user = this.getUser();
    if (!user || user.id === 'guest') return;
    
    const sessionCode = this.current.code;
    const sessionRef = this._sessionsCol().doc(sessionCode);
    const participantRef = sessionRef.collection('participants').doc(user.id);
    
    try {
      // Use a transaction to ensure atomic delete + check
      await window.db.runTransaction(async (transaction) => {
        // Delete participant
        transaction.delete(participantRef);
        
        // Get remaining participants count
        const participantsSnap = await transaction.get(sessionRef.collection('participants'));
        const remainingCount = participantsSnap.docs.filter(d => d.id !== user.id).length;
        
        console.log(`Participants remaining after ${user.id} leaves:`, remainingCount);
        
        // If this was the last participant, delete the session
        if (remainingCount === 0) {
          console.log('Last participant left - deleting session from Firestore');
          transaction.delete(sessionRef);
        }
      });
      
      // Check if we were the last one
      const checkSnap = await sessionRef.get();
      if (!checkSnap.exists) {
        UI.showToast('آخر عضو غادر - تم حذف الجلسة', 'info');
      }
    } catch (e) {
      console.warn('Transaction failed, trying simple delete', e);
      // Fallback: simple delete + check
      await participantRef.delete().catch(() => {});
      
      const participantsSnap = await sessionRef.collection('participants').get();
      if (participantsSnap.empty) {
        console.log('Last participant left - deleting session from Firestore');
        await sessionRef.delete();
        UI.showToast('آخر عضو غادر - تم حذف الجلسة', 'info');
      }
    }
    
    if (this._unsub) { this._unsub(); this._unsub = null; }
    if (this._unsubParticipants) { this._unsubParticipants(); this._unsubParticipants = null; }
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
    if (this._presenceInterval) { clearInterval(this._presenceInterval); this._presenceInterval = null; }
    this.current = null;
  },

  async _cleanupPresence() {
    try { await this.leaveSession(); } catch (_) {}
    if (this._presenceInterval) { clearInterval(this._presenceInterval); this._presenceInterval = null; }
  },

  _formatCountdown(secLeft) {
    if (secLeft < 0) secLeft = 0;
    const h = Math.floor(secLeft / 3600);
    const m = Math.floor((secLeft % 3600) / 60);
    const s = secLeft % 60;
    const pad = (n) => n.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  },

  _render(session) {
    const els = this.pageEls;
    if (!els.currentBox) return;

    if (!session) {
      els.currentBox.classList.add('hidden');
      return;
    }

    // Show block
    els.currentBox.classList.remove('hidden');
    els.codeDisplay.textContent = session.code;
    els.title.textContent = session.name || 'جلسة مذاكرة';
    
    // Display actual owner name from session data (not current user)
    const ownerName = session.ownerName || 'المنشئ';
    els.owner.textContent = ownerName;
    
    const statusText = (session.status === 'active' ? 'قيد الدراسة' : session.status === 'ended' ? 'منتهية' : 'بانتظار البدء');
    if (els.status) els.status.textContent = statusText;
    if (els.statusChip) {
      els.statusChip.textContent = statusText;
      if (session.status === 'active') {
        els.statusChip.style.background = '#e2f7e2';
        els.statusChip.style.color = '#1d7a1d';
      } else if (session.status === 'ended') {
        els.statusChip.style.background = '#f3f4f6';
        els.statusChip.style.color = '#6b7280';
      } else {
        els.statusChip.style.background = '#ffe9c7';
        els.statusChip.style.color = '#b26b00';
      }
    }

    // Owner controls visibility
    const isOwner = this.getUser() && this.getUser().id === session.ownerId;
    const onBreak = session.onBreak || false;
    const breaksUsed = session.breaksUsed || 0;
    const totalBreaks = session.breaks || 0;
    const breaksRemaining = Math.max(0, totalBreaks - breaksUsed);
    
    if (els.startBtn) els.startBtn.style.display = isOwner && session.status !== 'active' && session.status !== 'ended' ? 'inline-flex' : 'none';
    if (els.startBreakBtn) els.startBreakBtn.style.display = isOwner && session.status === 'active' && !onBreak && breaksRemaining > 0 ? 'inline-flex' : 'none';
    if (els.endBreakBtn) els.endBreakBtn.style.display = isOwner && session.status === 'active' && onBreak ? 'inline-flex' : 'none';
    if (els.endBtn) els.endBtn.style.display = isOwner && session.status === 'active' && !onBreak ? 'inline-flex' : 'none';
    
    // Show breaks info if session has breaks
    if (els.breaksInfo && els.breaksRemaining) {
      if (totalBreaks > 0 && session.status === 'active') {
        els.breaksInfo.style.display = 'block';
        els.breaksRemaining.textContent = breaksRemaining;
      } else {
        els.breaksInfo.style.display = 'none';
      }
    }

    // Participants
    if (els.participantsList) {
      els.participantsList.innerHTML = '';
      const list = session.participants || [];
      list.forEach(p => {
        const li = document.createElement('li');
        const name = (p.name || p.id || 'مشارك');
        const initials = name.trim().split(/\s+/).map(x => x[0]).slice(0,2).join('').toUpperCase();
        li.innerHTML = `
          <div style="display:flex; align-items:center; gap:10px;">
            <div style=\"width:34px; height:34px; border-radius:50%; background:#eef2ff; color:#3b82f6; display:flex; align-items:center; justify-content:center; font-weight:bold;\">${initials}</div>
            <div>${name}</div>
          </div>`;
        els.participantsList.appendChild(li);
      });
      if (els.participantsCount) {
        els.participantsCount.textContent = list.length;
      }
    }

    // Countdown
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
    const drawCountdown = () => {
      const onBreak = session.onBreak || false;
      
      // Update label based on break status
      if (els.countdownLabel) {
        if (onBreak) {
          els.countdownLabel.textContent = '⏸️ وقت الاستراحة';
          els.countdown.style.color = '#f59e0b';
        } else {
          els.countdownLabel.textContent = 'العد التنازلي';
          els.countdown.style.color = '';
        }
      }
      
      if (!session.startAt || session.status !== 'active') {
        els.countdown.textContent = UI.formatTime((session.durationSec || 0) / 60);
        return;
      }
      
      // If on break, show break countdown
      if (onBreak && session.breakStartAt) {
        const breakStart = (session.breakStartAt && session.breakStartAt.toDate) ? session.breakStartAt.toDate().getTime() : Date.now();
        const breakDuration = (session.breakDuration || 15) * 60 * 1000;
        const breakEnd = breakStart + breakDuration;
        const left = Math.max(0, Math.floor((breakEnd - Date.now()) / 1000));
        els.countdown.textContent = this._formatCountdown(left);
        
        // Auto end break when time is up
        if (left === 0 && isOwner) {
          this.endBreak().catch(() => {});
        }
        return;
      }
      
      // Normal study countdown
      const startAt = (session.startAt && session.startAt.toDate) ? session.startAt.toDate().getTime() : Date.now();
      const endAt = startAt + (session.durationSec || 0) * 1000;
      const left = Math.max(0, Math.floor((endAt - Date.now()) / 1000));
      els.countdown.textContent = this._formatCountdown(left);
    };
    drawCountdown();
    this._timer = setInterval(drawCountdown, 1000);
    // Wire copy code button (if present)
    const copyBtn = document.getElementById('copy-code-btn');
    if (copyBtn) {
      copyBtn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(session.code);
          UI.showToast('تم نسخ الكود إلى الحافظة', 'success');
        } catch (_) {
          UI.showToast('تعذر نسخ الكود', 'error');
        }
      };
    }
  }
  ,
  _setBusy(isBusy) {
    const disable = (el, b) => { if (el) el.disabled = b; };
    disable(this.pageEls.startBtn, isBusy);
    disable(this.pageEls.startBreakBtn, isBusy);
    disable(this.pageEls.endBreakBtn, isBusy);
    disable(this.pageEls.endBtn, isBusy);
    disable(this.pageEls.leaveBtn, isBusy);
    if (this.pageEls.createForm) this.pageEls.createForm.querySelectorAll('input,button,select').forEach(el => el.disabled = isBusy);
    if (this.pageEls.joinForm) this.pageEls.joinForm.querySelectorAll('input,button,select').forEach(el => el.disabled = isBusy);
  }
  ,
  goToSessionPage(code) {
    try {
      const url = `session.html?code=${encodeURIComponent(code)}`;
      window.location.href = url;
    } catch (e) {
      console.warn('Fallback to SPA navigation', e);
      if (typeof UI?.showPage === 'function') UI.showPage('session-detail-page');
      this.open(code);
    }
  }
};

// Expose to global scope
window.Sessions = Sessions;

console.log('✅ Sessions module loaded');

// Initialize on load for index.html sessions page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    Sessions.load().catch(e => console.warn('Sessions auto-init failed', e));
  });
} else {
  // Already loaded
  Sessions.load().catch(e => console.warn('Sessions auto-init failed', e));
}
