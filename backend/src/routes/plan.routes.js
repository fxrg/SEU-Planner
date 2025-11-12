import express from 'express';
import { body, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import { query, transaction } from '../database/db.js';
import { generateStudyPlan } from '../services/planGenerator.js';

const router = express.Router();

// @route   POST /api/plans/generate
// @desc    Generate study plan for user
// @access  Private
router.post('/generate',
  protect,
  [
    body('course_ids').isArray().withMessage('المواد مطلوبة'),
    body('term_id').isInt().withMessage('الترم مطلوب')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { course_ids, term_id } = req.body;
    const userId = req.user.id;

    // Check if term is active
    const termResult = await query(
      'SELECT * FROM terms WHERE id = $1',
      [term_id]
    );

    if (termResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'الترم غير موجود',
        message_en: 'Term not found'
      });
    }

    const term = termResult.rows[0];
    const today = new Date();
    const openDate = new Date(term.open_date);

    if (!term.is_active || today < openDate) {
      return res.status(403).json({
        success: false,
        message: 'الترم غير متاح حالياً',
        message_en: 'Term is not available yet',
        data: {
          is_locked: true,
          opens_on: term.open_date
        }
      });
    }

    // Generate plan
    const plan = await generateStudyPlan(userId, term_id, course_ids);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء خطة الدراسة بنجاح',
      message_en: 'Study plan generated successfully',
      data: plan
    });
  })
);

// @route   GET /api/plans
// @desc    Get user's study plans
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await query(
    `SELECT 
      sp.id, sp.start_date, sp.end_date, sp.total_study_hours, sp.is_active,
      t.name as term_name, t.term_number,
      COUNT(DISTINCT ss.id) as total_sessions,
      COUNT(DISTINCT CASE WHEN ss.is_completed THEN ss.id END) as completed_sessions
    FROM study_plans sp
    INNER JOIN terms t ON sp.term_id = t.id
    LEFT JOIN study_sessions ss ON sp.id = ss.plan_id
    WHERE sp.user_id = $1
    GROUP BY sp.id, t.name, t.term_number
    ORDER BY sp.created_at DESC`,
    [userId]
  );

  res.json({
    success: true,
    count: result.rows.length,
    data: result.rows
  });
}));

// @route   GET /api/plans/:id
// @desc    Get single plan with details
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const planResult = await query(
    `SELECT sp.*, t.name as term_name, t.exam_date
     FROM study_plans sp
     INNER JOIN terms t ON sp.term_id = t.id
     WHERE sp.id = $1 AND sp.user_id = $2`,
    [id, userId]
  );

  if (planResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'الخطة غير موجودة',
      message_en: 'Plan not found'
    });
  }

  // Get sessions
  const sessionsResult = await query(
    `SELECT 
      ss.*,
      c.code as course_code, c.name_ar as course_name_ar, c.name_en as course_name_en
    FROM study_sessions ss
    INNER JOIN user_courses uc ON ss.user_course_id = uc.id
    INNER JOIN courses c ON uc.course_id = c.id
    WHERE ss.plan_id = $1
    ORDER BY ss.session_date, c.name_ar`,
    [id]
  );

  const plan = planResult.rows[0];
  plan.sessions = sessionsResult.rows;
  plan.total_sessions = sessionsResult.rows.length;
  plan.completed_sessions = sessionsResult.rows.filter(s => s.is_completed).length;
  plan.progress = plan.total_sessions > 0 
    ? Math.round((plan.completed_sessions / plan.total_sessions) * 100) 
    : 0;

  res.json({
    success: true,
    data: plan
  });
}));

// @route   DELETE /api/plans/:id
// @desc    Delete study plan
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const result = await query(
    'DELETE FROM study_plans WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'الخطة غير موجودة',
      message_en: 'Plan not found'
    });
  }

  res.json({
    success: true,
    message: 'تم حذف الخطة بنجاح',
    message_en: 'Plan deleted successfully'
  });
}));

export default router;
