import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { logger } from '../lib/logs.js';

const router = Router();

// Rate limit login attempts to slow down credential brute-forcing
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/v1/admin/login - authenticates the admin using credentials from env vars
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const validUsername = username === process.env.ADMIN_USERNAME;
  const validPassword =
    process.env.ADMIN_PASSWORD_HASH &&
    (await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH));

  if (!validUsername || !validPassword) {
    logger.emit({ severityText: 'warn', body: 'failed admin login attempt', attributes: { username } });
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ role: 'admin', username }, process.env.JWT_SECRET, { expiresIn: '8h' });
  logger.emit({ severityText: 'info', body: 'admin login succeeded', attributes: { username } });

  res.json({ token, expiresIn: '8h' });
});

export default router;
