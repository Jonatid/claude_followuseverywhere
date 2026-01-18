import express from 'express';
import QRCode from 'qrcode';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

const buildFrontendBaseUrl = () => process.env.FRONTEND_BASE_URL || 'http://localhost:5173';

// @route   PUT /api/businesses/me
// @desc    Update own business info
// @access  Private
router.put('/me', auth, async (req, res) => {
  const { name, slug, tagline, logo } = req.body;

  try {
    const result = await pool.query(
      `UPDATE businesses
       SET name = COALESCE($1, name),
           slug = COALESCE($2, slug),
           tagline = COALESCE($3, tagline),
           logo = COALESCE($4, logo),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, name, slug, tagline, logo, email, is_verified, is_approved, is_admin`,
      [name, slug, tagline, logo, req.businessId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Business not found' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/businesses/me
// @desc    Delete own account
// @access  Private
router.delete('/me', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM businesses WHERE id = $1', [req.businessId]);
    return res.json({ message: 'Account deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/businesses/me/qr-code
// @desc    Get QR code for public follow page
// @access  Private
router.get('/me/qr-code', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT slug FROM businesses WHERE id = $1', [
      req.businessId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const { slug } = result.rows[0];
    const publicUrl = `${buildFrontendBaseUrl()}/b/${slug}`;
    const dataUrl = await QRCode.toDataURL(publicUrl);

    return res.json({ url: publicUrl, qrCode: dataUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/businesses/:slug
// @desc    Get public business profile
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const businessResult = await pool.query(
      `SELECT id, name, slug, tagline, logo
       FROM businesses
       WHERE slug = $1 AND is_approved = TRUE AND is_verified = TRUE`,
      [slug]
    );

    if (businessResult.rows.length === 0) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const business = businessResult.rows[0];

    const socialsResult = await pool.query(
      `SELECT platform, url, icon
       FROM social_links
       WHERE business_id = $1 AND url != ''
       ORDER BY display_order`,
      [business.id]
    );

    business.socials = socialsResult.rows;

    return res.json(business);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
