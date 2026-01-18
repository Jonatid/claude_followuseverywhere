import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';
import adminOnly from '../middleware/adminOnly.js';

const router = express.Router();

// @route   GET /api/admin/businesses
// @desc    List all businesses
// @access  Admin
router.get('/businesses', auth, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, slug, email, created_at, is_verified, is_approved, is_admin
       FROM businesses
       ORDER BY created_at DESC`
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/businesses/:id/approve
// @desc    Approve or block a business
// @access  Admin
router.put(
  '/businesses/:id/approve',
  [auth, adminOnly, body('is_approved').isBoolean()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { is_approved: isApproved } = req.body;

    try {
      const result = await pool.query(
        `UPDATE businesses
         SET is_approved = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING id, name, slug, email, is_verified, is_approved`,
        [isApproved, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Business not found' });
      }

      return res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
