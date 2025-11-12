import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import { query } from '../database/db.js';

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { unread_only } = req.query;

  let queryText = `
    SELECT id, title, message, notification_type, is_read, created_at
    FROM notifications
    WHERE user_id = $1
  `;

  if (unread_only === 'true') {
    queryText += ' AND is_read = false';
  }

  queryText += ' ORDER BY created_at DESC LIMIT 50';

  const result = await query(queryText, [userId]);

  res.json({
    success: true,
    count: result.rows.length,
    data: result.rows
  });
}));

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', protect, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const result = await query(
    'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *',
    [id, userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'الإشعار غير موجود',
      message_en: 'Notification not found'
    });
  }

  res.json({
    success: true,
    data: result.rows[0]
  });
}));

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', protect, asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await query(
    'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
    [userId]
  );

  res.json({
    success: true,
    message: 'تم تحديد جميع الإشعارات كمقروءة',
    message_en: 'All notifications marked as read'
  });
}));

export default router;
