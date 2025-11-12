import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { query } from '../database/db.js';

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses (with filters)
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const { major_id, search } = req.query;

  let queryText = `
    SELECT 
      c.id, c.code, c.name_ar, c.name_en, c.credit_hours, c.difficulty_level,
      m.id as major_id, m.name_ar as major_name_ar, m.code as major_code
    FROM courses c
    INNER JOIN majors m ON c.major_id = m.id
    WHERE 1=1
  `;
  
  const params = [];
  let paramCount = 1;

  if (major_id) {
    queryText += ` AND c.major_id = $${paramCount}`;
    params.push(major_id);
    paramCount++;
  }

  if (search) {
    queryText += ` AND (c.name_ar ILIKE $${paramCount} OR c.name_en ILIKE $${paramCount} OR c.code ILIKE $${paramCount})`;
    params.push(`%${search}%`);
    paramCount++;
  }

  queryText += ' ORDER BY c.code';

  const result = await query(queryText, params);

  res.json({
    success: true,
    count: result.rows.length,
    data: result.rows
  });
}));

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await query(
    `SELECT 
      c.id, c.code, c.name_ar, c.name_en, c.credit_hours, c.difficulty_level,
      m.id as major_id, m.name_ar as major_name_ar, m.code as major_code
    FROM courses c
    INNER JOIN majors m ON c.major_id = m.id
    WHERE c.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'المقرر غير موجود',
      message_en: 'Course not found'
    });
  }

  res.json({
    success: true,
    data: result.rows[0]
  });
}));

export default router;
