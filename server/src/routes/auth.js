import { Router } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import posthog from '../lib/posthog.js';
import { logger } from '../lib/logs.js';
import { sendMail } from '../lib/mailer.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireTurnstile } from '../middleware/requireTurnstile.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

function signCustomerToken(user) {
  return jwt.sign({ role: 'customer', sub: user._id.toString(), email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}

function publicUser(user) {
  return { id: user._id, email: user.email, name: user.name, isEmailVerified: user.isEmailVerified };
}

// POST /api/v1/auth/register - creates an account and sends a verification email
router.post('/register', authLimiter, requireTurnstile, async (req, res) => {
  const { email, password, name } = req.body ?? {};

  if (!email || !password || password.length < 8) {
    return res.status(400).json({ error: 'Email and a password of at least 8 characters are required' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash,
    name,
    emailVerificationToken,
    emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  const verifyUrl = `${process.env.CLIENT_URL ?? 'http://localhost:5173'}/verify-email?token=${emailVerificationToken}`;
  sendMail({
    to: user.email,
    subject: 'Verify your Maison Delulu account',
    text: `Welcome to Maison Delulu. Verify your email: ${verifyUrl}`,
    html: `<p>Welcome to Maison Delulu.</p><p><a href="${verifyUrl}">Verify your email</a></p>`,
  }).catch((err) =>
    logger.emit({ severityText: 'error', body: 'failed to send verification email', attributes: { error: err.message } })
  );

  posthog?.capture({ distinctId: user.email, event: 'user_registered', properties: { $set: { email: user.email, name } } });
  logger.emit({ severityText: 'info', body: 'user registered', attributes: { email: user.email } });

  const token = signCustomerToken(user);
  res.status(201).json({ token, user: publicUser(user) });
});

// GET /api/v1/auth/verify-email - confirms the account using the emailed token
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Missing verification token' });

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: new Date() },
  }).select('+emailVerificationToken +emailVerificationExpires');

  if (!user) return res.status(400).json({ error: 'Invalid or expired verification link' });

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.json({ status: 'verified' });
});

// POST /api/v1/auth/login - authenticates a customer
router.post('/login', authLimiter, requireTurnstile, async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  const valid = user && (await bcrypt.compare(password, user.passwordHash));

  if (!valid) {
    logger.emit({ severityText: 'warn', body: 'failed customer login attempt', attributes: { email } });
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = signCustomerToken(user);
  posthog?.capture({ distinctId: user.email, event: 'user_logged_in' });

  res.json({ token, user: publicUser(user) });
});

// GET /api/v1/auth/me - returns the current authenticated user
router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.sub);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(publicUser(user));
});

// POST /api/v1/auth/forgot-password - emails a password reset link if the account exists
router.post('/forgot-password', authLimiter, async (req, res) => {
  const { email } = req.body ?? {};
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const user = await User.findOne({ email: email.toLowerCase() });

  // Always return success to avoid leaking which emails have accounts
  if (!user) return res.json({ status: 'if that email exists, a reset link has been sent' });

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL ?? 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  sendMail({
    to: user.email,
    subject: 'Reset your Maison Delulu password',
    text: `Reset your password: ${resetUrl} (expires in 1 hour)`,
    html: `<p>Reset your password using the link below. This link expires in 1 hour.</p><p><a href="${resetUrl}">Reset password</a></p>`,
  }).catch((err) =>
    logger.emit({ severityText: 'error', body: 'failed to send reset email', attributes: { error: err.message } })
  );

  logger.emit({ severityText: 'info', body: 'password reset requested', attributes: { email: user.email } });
  res.json({ status: 'if that email exists, a reset link has been sent' });
});

// POST /api/v1/auth/reset-password - sets a new password using a valid reset token
router.post('/reset-password', authLimiter, async (req, res) => {
  const { token, password } = req.body ?? {};

  if (!token || !password || password.length < 8) {
    return res.status(400).json({ error: 'Token and a password of at least 8 characters are required' });
  }

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) return res.status(400).json({ error: 'Invalid or expired reset link' });

  user.passwordHash = await bcrypt.hash(password, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  logger.emit({ severityText: 'info', body: 'password reset completed', attributes: { email: user.email } });
  posthog?.capture({ distinctId: user.email, event: 'password_reset_completed' });

  res.json({ status: 'password updated' });
});

export default router;
