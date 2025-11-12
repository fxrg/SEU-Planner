import express from 'express';
import { format } from 'date-fns';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import { query } from '../database/db.js';

const router = express.Router();

// @route   GET /api/sessions/today
// @desc    Get today's study sessions
// @access  Private
router.get('/today', protect, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const today = format(new Date(), 'yyyy-MM-dd');

  const result = await query(
    `SELECT 
      ss.id, ss.session_date, ss.start_time, ss.duration_minutes, 
      ss.session_type, ss.is_completed, ss.notes,
      c.code as course_code, c.name_ar as course_name_ar, 
      c.name_en as course_name_en, c.difficulty_level,
      sp.id as plan_id
    FROM study_sessions ss
    INNER JOIN user_courses uc ON ss.user_course_id = uc.id
    INNER JOIN courses c ON uc.course_id = c.id
    INNER JOIN study_plans sp ON ss.plan_id = sp.id
    WHERE sp.user_id = $1 
      AND ss.session_date = $2
    ORDER BY ss.start_time, c.name_ar`,
    [userId, today]
  );

  const sessions = result.rows;
  const completed = sessions.filter(s => s.is_completed).length;
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration_minutes, 0);
  const completedMinutes = sessions
    .filter(s => s.is_completed)
    .reduce((sum, s) => sum + s.duration_minutes, 0);

  res.json({
    success: true,
    data: {
      date: today,
      sessions,
      summary: {
        total_sessions: sessions.length,
        completed_sessions: completed,
        pending_sessions: sessions.length - completed,
        total_minutes: totalMinutes,
        completed_minutes: completedMinutes,
        remaining_minutes: totalMinutes - completedMinutes,
        progress: sessions.length > 0 ? Math.round((completed / sessions.length) * 100) : 0
      }
    }
  });
}));

// @route   GET /api/sessions/week
// @desc    Get this week's sessions
// @access  Private
router.get('/week', protect, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Sunday
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6); // Saturday

  const result = await query(
    `SELECT 
      ss.id, ss.session_date, ss.duration_minutes, ss.is_completed,
      c.name_ar as course_name_ar, c.name_en as course_name_en
    FROM study_sessions ss
    INNER JOIN user_courses uc ON ss.user_course_id = uc.id
    INNER JOIN courses c ON uc.course_id = c.id
    INNER JOIN study_plans sp ON ss.plan_id = sp.id
    WHERE sp.user_id = $1 
      AND ss.session_date BETWEEN $2 AND $3
    ORDER BY ss.session_date`,
    [userId, format(weekStart, 'yyyy-MM-dd'), format(weekEnd, 'yyyy-MM-dd')]
  );

  res.json({
    success: true,
    data: {
      week_start: format(weekStart, 'yyyy-MM-dd'),
      week_end: format(weekEnd, 'yyyy-MM-dd'),
      sessions: result.rows
    }
  });
}));

// @route   PUT /api/sessions/:id/complete
// @desc    Mark session as completed
// @access  Private
router.put('/:id/complete', protect, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  const userId = req.user.id;

  // Verify ownership
  const checkResult = await query(
    `SELECT ss.id 
     FROM study_sessions ss
     INNER JOIN study_plans sp ON ss.plan_id = sp.id
     WHERE ss.id = $1 AND sp.user_id = $2`,
    [id, userId]
  );

  if (checkResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'الجلسة غير موجودة',
      message_en: 'Session not found'
    });
  }

  const result = await query(
    `UPDATE study_sessions 
     SET is_completed = true, completed_at = NOW(), notes = $1
     WHERE id = $2
     RETURNING *`,
    [notes || null, id]
  );

  res.json({
    success: true,
    message: 'تم تحديد الجلسة كمكتملة',
    message_en: 'Session marked as completed',
    data: result.rows[0]
  });
}));

// @route   PUT /api/sessions/:id/uncomplete
// @desc    Mark session as not completed
// @access  Private
router.put('/:id/uncomplete', protect, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const checkResult = await query(
    `SELECT ss.id 
     FROM study_sessions ss
     INNER JOIN study_plans sp ON ss.plan_id = sp.id
     WHERE ss.id = $1 AND sp.user_id = $2`,
    [id, userId]
  );

  if (checkResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'الجلسة غير موجودة',
      message_en: 'Session not found'
    });
  }

  const result = await query(
    `UPDATE study_sessions 
     SET is_completed = false, completed_at = NULL
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  res.json({
    success: true,
    message: 'تم إلغاء إتمام الجلسة',
    message_en: 'Session marked as incomplete',
    data: result.rows[0]
  });
}));

// @route   GET /api/sessions/calendar
// @desc    Get sessions for calendar view
// @access  Private
router.get('/calendar', protect, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res.status(400).json({
      success: false,
      message: 'تاريخ البداية والنهاية مطلوبان',
      message_en: 'Start and end dates are required'
    });
  }

  const result = await query(
    `SELECT 
      ss.id, ss.session_date, ss.duration_minutes, ss.session_type, ss.is_completed,
      c.code, c.name_ar, c.name_en, c.difficulty_level
    FROM study_sessions ss
    INNER JOIN user_courses uc ON ss.user_course_id = uc.id
    INNER JOIN courses c ON uc.course_id = c.id
    INNER JOIN study_plans sp ON ss.plan_id = sp.id
    WHERE sp.user_id = $1 
      AND ss.session_date BETWEEN $2 AND $3
    ORDER BY ss.session_date`,
    [userId, start_date, end_date]
  );

  // Group by date
  const calendar = {};
  result.rows.forEach(session => {
    const date = session.session_date;
    if (!calendar[date]) {
      calendar[date] = [];
    }
    calendar[date].push(session);
  });

  res.json({
    success: true,
    data: calendar
  });
}));

export default router;
