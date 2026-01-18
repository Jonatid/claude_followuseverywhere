import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/socials
// @desc    Get social links
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, platform, url, icon, display_order FROM social_links WHERE business_id = $1 ORDER BY display_order',
      [req.businessId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/socials
// @desc    Update social links
// @access  Private
router.put('/', auth, async (req, res) => {
  const { socials } = req.body;

  try {
    for (const social of socials) {
      await pool.query(
        `UPDATE social_links
         SET url = $1, icon = COALESCE($2, icon), display_order = COALESCE($3, display_order)
         WHERE business_id = $4 AND platform = $5`,
        [social.url, social.icon, social.display_order, req.businessId, social.platform]
      );
    }

    const result = await pool.query(
      'SELECT platform, url, icon FROM social_links WHERE business_id = $1 ORDER BY display_order',
      [req.businessId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/socials
// @desc    Add social link
// @access  Private
router.post(
  '/',
  [auth, body('platform').notEmpty(), body('url').isURL()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { platform, url, icon, display_order } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO social_links (business_id, platform, url, icon, display_order)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, platform, url, icon, display_order`,
        [req.businessId, platform, url, icon || '', display_order || 0]
      );

      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE /api/socials/:id
// @desc    Delete social link
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM social_links WHERE id = $1 AND business_id = $2', [
      id,
      req.businessId,
    ]);
    return res.json({ message: 'Social link deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
