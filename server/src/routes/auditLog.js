import { Router } from 'express';
import AuditLog from '../models/AuditLog.js';
import { logger } from '../lib/logs.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

// GET /api/v1/audit-log - admin-only: list audit log entries, optionally filtered by entity
router.get('/', requireAdmin, async (req, res) => {
  const { entityType, entityId, limit = 50, offset = 0 } = req.query;

  const filter = {};
  if (entityType) filter.entityType = entityType;
  if (entityId) filter.entityId = entityId;

  try {
    const [results, count] = await Promise.all([
      AuditLog.find(filter)
        .sort('-createdAt')
        .skip(Number(offset))
        .limit(Math.min(Number(limit), 200)),
      AuditLog.countDocuments(filter),
    ]);
    res.json({ count, results });
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to list audit log', attributes: { error: err.message } });
    res.status(500).json({ error: 'Could not fetch audit log' });
  }
});

export default router;
