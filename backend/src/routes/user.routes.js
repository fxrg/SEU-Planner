import express from 'express';
import { body } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import { query } from '../database/db.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile with preferences
// @access  Private
router.get('/profile', protect, asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await query(
    `SELECT 
      u.id, u.email, u.full_name, u.notification_time, u.notification_enabled,
      u.timezone, u.study_intensity, u.language, u.created_at,
      m.id as major_id, m.name_ar as major_name_ar, m.name_en as major_name_en,
      c.name_ar as college_name_ar
    FROM users u
    LEFT JOIN majors m ON u.major_id = m.id
    LEFT JOIN colleges c ON m.college_id = c.id
    WHERE u.id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'المستخدم غير موجود',
      message_en: 'User not found'
    });
  }

  res.json({
    success: true,
    data: result.rows[0]
  });
}));

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { full_name, major_id, language } = req.body;

  const updates = [];
  const values = [];
  let paramCount = 1;

  if (full_name) {
    updates.push(`full_name = $${paramCount}`);
    values.push(full_name);
    paramCount++;
  }

  if (major_id) {
    updates.push(`major_id = $${paramCount}`);
    values.push(major_id);
    paramCount++;
  }

  if (language) {
    updates.push(`language = $${paramCount}`);
    values.push(language);
    paramCount++;
  }

  if (updates.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'لا توجد بيانات للتحديث',
      message_en: 'No data to update'
    });
  }

  values.push(userId);

  const result = await query(
    `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`,
    values
  );

  res.json({
    success: true,
    message: 'تم تحديث الملف الشخصي بنجاح',
    message_en: 'Profile updated successfully',
    data: result.rows[0]
  });
}));

// @route   PUT /api/users/preferences
// @desc    Update notification preferences
// @access  Private
router.put('/preferences',
  protect,
  [
    body('notification_time').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
    body('notification_enabled').optional().isBoolean(),
    body('study_intensity').optional().isIn(['light', 'medium', 'intensive'])
  ],
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { notification_time, notification_enabled, timezone, study_intensity } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (notification_time) {
      updates.push(`notification_time = $${paramCount}`);
      values.push(notification_time);
      paramCount++;
    }

    if (typeof notification_enabled === 'boolean') {
      updates.push(`notification_enabled = $${paramCount}`);
      values.push(notification_enabled);
      paramCount++;
    }

    if (timezone) {
      updates.push(`timezone = $${paramCount}`);
      values.push(timezone);
      paramCount++;
    }

    if (study_intensity) {
      updates.push(`study_intensity = $${paramCount}`);
      values.push(study_intensity);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'لا توجد بيانات للتحديث',
        message_en: 'No data to update'
      });
    }

    values.push(userId);

    const result = await query(
      `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`,
      values
    );

    res.json({
      success: true,
      message: 'تم تحديث التفضيلات بنجاح',
      message_en: 'Preferences updated successfully',
      data: result.rows[0]
    });
  })
);

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', protect, asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Get overall stats
  const statsResult = await query(
    `SELECT 
      COUNT(DISTINCT sp.id) as total_plans,
      COUNT(DISTINCT ss.id) as total_sessions,
      COUNT(DISTINCT CASE WHEN ss.is_completed THEN ss.id END) as completed_sessions,
      COALESCE(SUM(CASE WHEN ss.is_completed THEN ss.duration_minutes ELSE 0 END), 0) as total_study_minutes
    FROM study_plans sp
    LEFT JOIN study_sessions ss ON sp.id = ss.plan_id
    WHERE sp.user_id = $1`,
    [userId]
  );

  const stats = statsResult.rows[0];
  stats.completion_rate = stats.total_sessions > 0 
    ? Math.round((stats.completed_sessions / stats.total_sessions) * 100)
    : 0;

  res.json({
    success: true,
    data: stats
  });
}));

export default router;
