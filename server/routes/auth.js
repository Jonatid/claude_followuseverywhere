import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';
import { sendEmail } from '../utils/email.js';

const router = express.Router();

const buildApiBaseUrl = () => process.env.API_BASE_URL || 'http://localhost:5000';
const buildFrontendBaseUrl = () => process.env.FRONTEND_BASE_URL || 'http://localhost:5173';

const createVerificationToken = async (businessId) => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  await pool.query(
    `INSERT INTO email_verification_tokens (business_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [businessId, token, expiresAt]
  );

  return { token, expiresAt };
};

const createPasswordResetToken = async (businessId) => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

  await pool.query(
    `INSERT INTO password_reset_tokens (business_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [businessId, token, expiresAt]
  );

  return { token, expiresAt };
};

// @route   POST /api/auth/signup
// @desc    Register new business
// @access  Public
router.post(
  '/signup',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty(),
    body('slug').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, slug, tagline, email, password } = req.body;

    try {
      const existingBusiness = await pool.query(
        'SELECT 1 FROM businesses WHERE email = $1 OR slug = $2',
        [email, slug]
      );

      if (existingBusiness.rows.length > 0) {
        return res.status(400).json({
          message: 'Business with this email or slug already exists',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const logo = name.substring(0, 2).toUpperCase();

      const result = await pool.query(
        `INSERT INTO businesses (name, slug, tagline, logo, email, password_hash, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, name, slug, tagline, logo, email, is_verified, is_approved, is_admin`,
        [name, slug, tagline || '', logo, email, passwordHash, false]
      );

      const business = result.rows[0];
      const platforms = [
        'Instagram',
        'TikTok',
        'YouTube',
        'Facebook',
        'X',
        'LinkedIn',
        'Website',
      ];
      const icons = ['📷', '🎵', '▶️', '👍', '✖️', '💼', '🌐'];

      for (let i = 0; i < platforms.length; i += 1) {
        await pool.query(
          `INSERT INTO social_links (business_id, platform, url, icon, display_order)
           VALUES ($1, $2, $3, $4, $5)`,
          [business.id, platforms[i], '', icons[i], i]
        );
      }

      const { token } = await createVerificationToken(business.id);
      const verifyLink = `${buildApiBaseUrl()}/api/auth/verify-email?token=${token}`;

      try {
        await sendEmail({
          to: email,
          subject: 'Verify your Follow Us Everywhere email',
          text: `Verify your account: ${verifyLink}`,
          html: `<p>Verify your account by clicking <a href="${verifyLink}">this link</a>.</p>`,
        });
      } catch (error) {
        console.error('Email send failed', error);
      }

      const payload = { businessId: business.id, isAdmin: business.is_admin };
      const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

      return res.json({ token: authToken, business });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET /api/auth/verify-email
// @desc    Verify business email
// @access  Public
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const result = await pool.query(
      `SELECT evt.business_id, evt.expires_at
       FROM email_verification_tokens evt
       WHERE evt.token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const { business_id: businessId, expires_at: expiresAt } = result.rows[0];

    if (new Date(expiresAt) < new Date()) {
      await pool.query('DELETE FROM email_verification_tokens WHERE token = $1', [token]);
      return res.status(400).json({ message: 'Token has expired' });
    }

    await pool.query('UPDATE businesses SET is_verified = TRUE WHERE id = $1', [businessId]);
    await pool.query('DELETE FROM email_verification_tokens WHERE business_id = $1', [businessId]);

    return res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login business
// @access  Public
router.post(
  '/login',
  [body('email').isEmail(), body('password').exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const result = await pool.query('SELECT * FROM businesses WHERE email = $1', [email]);

      if (result.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const business = result.rows[0];

      if (!business.is_verified) {
        return res.status(403).json({ message: 'Please verify your email before logging in' });
      }

      if (!business.is_approved) {
        return res.status(403).json({ message: 'Account is awaiting approval' });
      }

      const isMatch = await bcrypt.compare(password, business.password_hash);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const socialsResult = await pool.query(
        'SELECT platform, url, icon FROM social_links WHERE business_id = $1 ORDER BY display_order',
        [business.id]
      );

      const payload = { businessId: business.id, isAdmin: business.is_admin };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

      const { password_hash: passwordHash, ...businessData } = business;
      businessData.socials = socialsResult.rows;

      return res.json({ token, business: businessData });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   POST /api/auth/request-password-reset
// @desc    Request password reset email
// @access  Public
router.post('/request-password-reset', [body('email').isEmail()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const result = await pool.query('SELECT id FROM businesses WHERE email = $1', [email]);

    if (result.rows.length > 0) {
      const businessId = result.rows[0].id;
      const { token } = await createPasswordResetToken(businessId);
      const resetLink = `${buildFrontendBaseUrl()}/reset-password?token=${token}`;

      try {
        await sendEmail({
          to: email,
          subject: 'Reset your Follow Us Everywhere password',
          text: `Reset your password: ${resetLink}`,
          html: `<p>Reset your password by clicking <a href="${resetLink}">this link</a>.</p>`,
        });
      } catch (error) {
        console.error('Password reset email failed', error);
      }
    }

    return res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password using token
// @access  Public
router.post(
  '/reset-password',
  [body('token').notEmpty(), body('newPassword').isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, newPassword } = req.body;

    try {
      const result = await pool.query(
        `SELECT business_id, expires_at
         FROM password_reset_tokens
         WHERE token = $1`,
        [token]
      );

      if (result.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      const { business_id: businessId, expires_at: expiresAt } = result.rows[0];

      if (new Date(expiresAt) < new Date()) {
        await pool.query('DELETE FROM password_reset_tokens WHERE token = $1', [token]);
        return res.status(400).json({ message: 'Token has expired' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      await pool.query('UPDATE businesses SET password_hash = $1 WHERE id = $2', [
        passwordHash,
        businessId,
      ]);
      await pool.query('DELETE FROM password_reset_tokens WHERE business_id = $1', [businessId]);

      return res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current business
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, slug, tagline, logo, email, is_verified, is_approved, is_admin FROM businesses WHERE id = $1',
      [req.businessId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const business = result.rows[0];

    const socialsResult = await pool.query(
      'SELECT id, platform, url, icon FROM social_links WHERE business_id = $1 ORDER BY display_order',
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
