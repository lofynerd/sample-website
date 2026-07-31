import { Router } from 'express';
import posthog from '../lib/posthog.js';
import { logger } from '../lib/logs.js';
import { sendMail } from '../lib/mailer.js';

const router = Router();

// POST /api/v1/orders - creates an order and records the purchase event, grouped by collection
router.post('/', (req, res) => {
  const { distinctId, items = [], subtotal, collection, email } = req.body ?? {};

  if (!distinctId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'distinctId and a non-empty items array are required' });
  }

  const orderId = `ord_${Date.now()}`;

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

  if (email) {
    const itemsList = items.map((i) => `${i.quantity ?? 1} x ${i.name ?? i.productId}`).join('<br>');
    sendMail({
      to: email,
      subject: `Your Maison Delulu order ${orderId}`,
      text: `Order ${orderId} confirmed. Subtotal: $${subtotal ?? '0.00'}`,
      html: `<p>Thank you for your order.</p><p><strong>Order ${orderId}</strong></p><p>${itemsList}</p><p>Subtotal: $${subtotal ?? '0.00'}</p>`,
    }).catch((err) =>
      logger.emit({ severityText: 'error', body: 'failed to send order receipt', attributes: { error: err.message } })
    );
  }

  res.status(201).json({ orderId, status: 'created' });
});

export default router;
