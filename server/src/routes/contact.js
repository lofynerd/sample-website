import { Router } from 'express';
import { logger } from '../lib/logs.js';
import { sendMail } from '../lib/mailer.js';
import posthog from '../lib/posthog.js';
import ContactMessage from '../models/ContactMessage.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

// POST /api/v1/contact - persists the message and notifies the house inbox
router.post('/', async (req, res) => {
  const { name, email, message } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
    await ContactMessage.create({ name, email, message });
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to persist contact message', attributes: { error: err.message } });
    return res.status(500).json({ error: 'Could not send your message' });
  }

  posthog?.capture({ distinctId: email, event: 'contact_form_submitted' });

  sendMail({
    to: process.env.EMAIL_USER,
    subject: `New contact message from ${name}`,
    text: `${message}\n\nFrom: ${name} <${email}>`,
    html: `<p>${message}</p><p>From: ${name} &lt;${email}&gt;</p>`,
  }).catch((err) =>
    logger.emit({ severityText: 'error', body: 'failed to send contact notification', attributes: { error: err.message } })
  );

  res.status(201).json({ status: 'received' });
});

// GET /api/v1/contact - admin-only: list contact messages
router.get('/', requireAdmin, async (req, res) => {
  const { limit = 50, offset = 0 } = req.query;

  try {
    const [results, count] = await Promise.all([
      ContactMessage.find()
        .sort('-createdAt')
        .skip(Number(offset))
        .limit(Math.min(Number(limit), 200)),
      ContactMessage.countDocuments(),
    ]);
    res.json({ count, results });
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to list contact messages', attributes: { error: err.message } });
    res.status(500).json({ error: 'Could not fetch messages' });
  }
});

export default router;
