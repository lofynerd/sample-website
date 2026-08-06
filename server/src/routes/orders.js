import { Router } from 'express';
import posthog from '../lib/posthog.js';
import { logger } from '../lib/logs.js';
import { sendMail } from '../lib/mailer.js';
import Order from '../models/Order.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { requireAuth, optionalAuth } from '../middleware/requireAuth.js';
import { recordAuditLog } from '../lib/auditLog.js';

const router = Router();

// POST /api/v1/orders - creates an order, persists it, and records the purchase event.
// Attaches userId when the request carries a valid customer session (optional auth).
router.post('/', optionalAuth, async (req, res) => {
  const { distinctId, items = [], subtotal, collection, email, customerName, shippingAddress } = req.body ?? {};

  if (!distinctId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'distinctId and a non-empty items array are required' });
  }

  const orderId = `ord_${Date.now()}`;

  try {
    await Order.create({
      orderId,
      email: req.user?.email ?? email ?? distinctId,
      customerName,
      distinctId,
      userId: req.user?.sub,
      items,
      subtotal,
      collection,
      shippingAddress,
      statusHistory: [{ status: 'completed', changedBy: 'system' }],
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

// GET /api/v1/orders - admin-only: list orders, supports pagination and search (order id / email / name)
router.get('/', requireAdmin, async (req, res) => {
  const { limit = 20, offset = 0, search, status } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (search) {
    const pattern = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ orderId: pattern }, { email: pattern }, { customerName: pattern }];
  }

  try {
    const [results, count] = await Promise.all([
      Order.find(filter)
        .sort('-createdAt')
        .skip(Number(offset))
        .limit(Math.min(Number(limit), 100)),
      Order.countDocuments(filter),
    ]);
    res.json({ count, results });
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to list orders', attributes: { error: err.message } });
    res.status(500).json({ error: 'Could not fetch orders' });
  }
});

// GET /api/v1/orders/id/:id - admin-only: retrieve a single order with full detail
router.get('/id/:id', requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to fetch order', attributes: { error: err.message } });
    res.status(500).json({ error: 'Could not fetch order' });
  }
});

// PATCH /api/v1/orders/id/:id/status - admin-only: transitions the order status and appends to its timeline
router.patch('/id/:id/status', requireAdmin, async (req, res) => {
  const { status, note } = req.body ?? {};
  const validStatuses = ['pending', 'completed', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const before = await Order.findById(req.params.id);
    if (!before) return res.status(404).json({ error: 'Order not found' });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        $push: { statusHistory: { status, note, changedBy: req.admin.username } },
      },
      { new: true }
    );

    recordAuditLog({
      entityType: 'order',
      entityId: order._id.toString(),
      entityLabel: order.orderId,
      action: 'update',
      before: { status: before.status },
      after: { status: order.status },
      editedBy: req.admin.username,
    });

    res.json(order);
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to update order status', attributes: { error: err.message } });
    res.status(500).json({ error: 'Could not update order status' });
  }
});

export default router;
