import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import { query } from '../database/db.js';

const router = express.Router();

// @route   GET /api/majors
// @desc    Get all majors with colleges
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const { college_id } = req.query;

  let queryText = `
    SELECT 
      m.id, m.name_ar, m.name_en, m.code,
      c.id as college_id, c.name_ar as college_name_ar, c.name_en as college_name_en
    FROM majors m
    INNER JOIN colleges c ON m.college_id = c.id
  `;
  
  const params = [];
  if (college_id) {
    queryText += ' WHERE m.college_id = $1';
    params.push(college_id);
  }
  
  queryText += ' ORDER BY c.name_ar, m.name_ar';

  const result = await query(queryText, params);

  res.json({
    success: true,
    count: result.rows.length,
    data: result.rows
  });
}));

// @route   GET /api/majors/:id
// @desc    Get single major with courses
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const majorResult = await query(
    `SELECT 
      m.id, m.name_ar, m.name_en, m.code,
      c.id as college_id, c.name_ar as college_name_ar, c.name_en as college_name_en
    FROM majors m
    INNER JOIN colleges c ON m.college_id = c.id
    WHERE m.id = $1`,
    [id]
  );

  if (majorResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'التخصص غير موجود',
      message_en: 'Major not found'
    });
  }

  const coursesResult = await query(
    `SELECT id, code, name_ar, name_en, credit_hours, difficulty_level
     FROM courses
     WHERE major_id = $1
     ORDER BY code`,
    [id]
  );

  res.json({
    success: true,
    data: {
      ...majorResult.rows[0],
      courses: coursesResult.rows,
      total_courses: coursesResult.rows.length
    }
  });
}));

export default router;
