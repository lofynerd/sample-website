import { Router } from 'express';
import posthog from '../lib/posthog.js';
import { logger } from '../lib/logs.js';
import { sendMail } from '../lib/mailer.js';
import Subscriber from '../models/Subscriber.js';

const router = Router();

// POST /api/v1/newsletter/subscribe - persists the subscriber and records the signup event
router.post('/subscribe', async (req, res) => {
  const { email } = req.body ?? {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'A valid email is required' });
  }

  try {
    await Subscriber.findOneAndUpdate(
      { email: email.toLowerCase() },
      { email: email.toLowerCase() },
      { upsert: true, new: true }
    );
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to persist subscriber', attributes: { error: err.message } });
    return res.status(500).json({ error: 'Could not save subscription' });
  }

  posthog?.capture({
    distinctId: email,
    event: 'newsletter_subscribed',
    properties: { $set: { email, newsletter_subscriber: true } },
  });

  logger.emit({
    severityText: 'info',
    body: 'newsletter subscription received',
    attributes: { email_domain: email.split('@')[1] ?? 'unknown' },
  });

  sendMail({
    to: email,
    subject: 'Welcome to Maison Delulu',
    text: 'Thank you for joining the house. Expect journal features, campaign previews, and early access to limited collections.',
    html: '<p>Thank you for joining the house.</p><p>Expect journal features, campaign previews, and early access to limited collections.</p>',
  }).catch((err) =>
    logger.emit({ severityText: 'error', body: 'failed to send welcome email', attributes: { error: err.message } })
  );

  res.status(201).json({ status: 'subscribed' });
});

export default router;
