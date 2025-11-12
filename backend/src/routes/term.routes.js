import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { query } from '../database/db.js';

const router = express.Router();

// @route   GET /api/terms
// @desc    Get all terms
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT id, name, term_number, start_date, exam_date, end_date, 
            open_date, is_active, academic_year
     FROM terms
     ORDER BY term_number`
  );

  res.json({
    success: true,
    data: result.rows
  });
}));

// @route   GET /api/terms/status
// @desc    Check term status (especially term 2)
// @access  Public
router.get('/status', asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT * FROM terms WHERE academic_year = '2025-2026' ORDER BY term_number`
  );

  const term1 = result.rows.find(t => t.term_number === 1);
  const term2 = result.rows.find(t => t.term_number === 2);

  const today = new Date();
  const term2OpenDate = new Date(term2.open_date);
  const daysUntilTerm2 = Math.ceil((term2OpenDate - today) / (1000 * 60 * 60 * 24));

  res.json({
    success: true,
    data: {
      term1: {
        ...term1,
        is_current: term1.is_active,
        days_until_exam: Math.ceil((new Date(term1.exam_date) - today) / (1000 * 60 * 60 * 24))
      },
      term2: {
        ...term2,
        is_locked: !term2.is_active && today < term2OpenDate,
        days_until_open: daysUntilTerm2 > 0 ? daysUntilTerm2 : 0,
        opens_on: term2.open_date
      }
    }
  });
}));

// @route   GET /api/terms/:id
// @desc    Get single term
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await query(
    'SELECT * FROM terms WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'الترم غير موجود',
      message_en: 'Term not found'
    });
  }

  res.json({
    success: true,
    data: result.rows[0]
  });
}));

export default router;
