import { Router } from 'express';
import posthog from '../lib/posthog.js';
import { logger } from '../lib/logs.js';
import { sendMail } from '../lib/mailer.js';
import Order from '../models/Order.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { requireAuth, optionalAuth } from '../middleware/requireAuth.js';

const router = Router();

// POST /api/v1/orders - creates an order, persists it, and records the purchase event.
// Attaches userId when the request carries a valid customer session (optional auth).
router.post('/', optionalAuth, async (req, res) => {
  const { distinctId, items = [], subtotal, collection, email } = req.body ?? {};

  if (!distinctId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'distinctId and a non-empty items array are required' });
  }

  const orderId = `ord_${Date.now()}`;

  try {
    await Order.create({
      orderId,
      email: req.user?.email ?? email ?? distinctId,
      distinctId,
      userId: req.user?.sub,
      items,
      subtotal,
      collection,
    });
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to persist order', attributes: { error: err.message } });
    return res.status(500).json({ error: 'Could not save order' });
  }

  posthog?.capture({
    distinctId,
    event: 'order_completed',
    properties: {
      order_id: orderId,
      item_count: items.reduce((sum, i) => sum + (i.quantity ?? 1), 0),
      subtotal,
    },
    // group analytics: attribute this order to its collection, when known
    groups: collection ? { collection } : undefined,
  });

  logger.emit({
    severityText: 'info',
    body: 'order completed',
    attributes: { order_id: orderId, subtotal: subtotal ?? null },
  });

  const recipient = req.user?.email ?? email;
  if (recipient) {
    const itemsList = items.map((i) => `${i.quantity ?? 1} x ${i.name ?? i.productId}`).join('<br>');
    sendMail({
      to: recipient,
      subject: `Your Maison Delulu order ${orderId}`,
      text: `Order ${orderId} confirmed. Subtotal: $${subtotal ?? '0.00'}`,
      html: `<p>Thank you for your order.</p><p><strong>Order ${orderId}</strong></p><p>${itemsList}</p><p>Subtotal: $${subtotal ?? '0.00'}</p>`,
    }).catch((err) =>
      logger.emit({ severityText: 'error', body: 'failed to send order receipt', attributes: { error: err.message } })
    );
  }

  res.status(201).json({ orderId, status: 'created' });
});

// GET /api/v1/orders/mine - customer-only: list the authenticated user's own orders
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const results = await Order.find({ userId: req.user.sub }).sort('-createdAt');
    res.json({ results });
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to list customer orders', attributes: { error: err.message } });
    res.status(500).json({ error: 'Could not fetch orders' });
  }
});

// GET /api/v1/orders - admin-only: list recent orders, supports pagination
router.get('/', requireAdmin, async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;

  try {
    const [results, count] = await Promise.all([
      Order.find()
        .sort('-createdAt')
        .skip(Number(offset))
        .limit(Math.min(Number(limit), 100)),
      Order.countDocuments(),
    ]);
    res.json({ count, results });
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to list orders', attributes: { error: err.message } });
    res.status(500).json({ error: 'Could not fetch orders' });
  }
});

export default router;
