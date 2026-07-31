import { verifyTurnstileToken } from '../lib/turnstile.js';
import { logger } from '../lib/logs.js';

// Verifies the "turnstileToken" field in the request body before letting the route handler run
export async function requireTurnstile(req, res, next) {
  const { turnstileToken } = req.body ?? {};
  const remoteip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.ip;

  const result = await verifyTurnstileToken(turnstileToken, remoteip);

  if (!result.success) {
    logger.emit({
      severityText: 'warn',
      body: 'turnstile verification failed',
      attributes: { errorCodes: result.errorCodes.join(',') },
    });
    return res.status(400).json({ error: 'Captcha verification failed. Please try again.' });
  }

  next();
}
