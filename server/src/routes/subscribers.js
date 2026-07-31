import { Router } from 'express';
import Subscriber from '../models/Subscriber.js';
import { logger } from '../lib/logs.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

// GET /api/v1/subscribers - admin-only: list newsletter subscribers
router.get('/', requireAdmin, async (req, res) => {
  const { limit = 50, offset = 0 } = req.query;

  try {
    const [results, count] = await Promise.all([
      Subscriber.find()
        .sort('-subscribedAt')
        .skip(Number(offset))
        .limit(Math.min(Number(limit), 200)),
      Subscriber.countDocuments(),
    ]);
    res.json({ count, results });
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to list subscribers', attributes: { error: err.message } });
    res.status(500).json({ error: 'Could not fetch subscribers' });
  }
});

export default router;
