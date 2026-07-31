import { Router } from 'express';
import Order from '../models/Order.js';
import Subscriber from '../models/Subscriber.js';
import Product from '../models/Product.js';
import { logger } from '../lib/logs.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { runHogQL, isPosthogQueryConfigured } from '../lib/posthogQuery.js';

const router = Router();

// GET /api/v1/analytics/business - admin-only: revenue, orders, subscribers from our own data
router.get('/business', requireAdmin, async (req, res) => {
  try {
    const [orderCount, subscriberCount, productCount, revenueAgg, topProducts, ordersByDay] =
      await Promise.all([
        Order.countDocuments(),
        Subscriber.countDocuments(),
        Product.countDocuments(),
        Order.aggregate([{ $group: { _id: null, total: { $sum: '$subtotal' } } }]),
        Order.aggregate([
          { $unwind: '$items' },
          {
            $group: {
              _id: '$items.name',
              quantity: { $sum: '$items.quantity' },
              revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
            },
          },
          { $sort: { quantity: -1 } },
          { $limit: 5 },
        ]),
        Order.aggregate([
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              count: { $sum: 1 },
              revenue: { $sum: '$subtotal' },
            },
          },
          { $sort: { _id: 1 } },
          { $limit: 30 },
        ]),
      ]);

    res.json({
      orderCount,
      subscriberCount,
      productCount,
      totalRevenue: revenueAgg[0]?.total ?? 0,
      topProducts: topProducts.map((p) => ({ name: p._id, quantity: p.quantity, revenue: p.revenue })),
      ordersByDay: ordersByDay.map((d) => ({ date: d._id, count: d.count, revenue: d.revenue })),
    });
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to compute business analytics', attributes: { error: err.message } });
    res.status(500).json({ error: 'Could not compute analytics' });
  }
});

// GET /api/v1/analytics/posthog - admin-only: live PostHog metrics (requires personal API key)
router.get('/posthog', requireAdmin, async (req, res) => {
  if (!isPosthogQueryConfigured) {
    return res.status(501).json({
      error:
        'PostHog Query API is not configured. Set POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID to enable live PostHog metrics.',
    });
  }

  try {
    const [pageviews, uniqueVisitors, topPages, topEvents, exceptions] = await Promise.all([
      runHogQL(
        "select count() from events where event = '$pageview' and timestamp > now() - interval 30 day",
        'pageviews last 30d'
      ),
      runHogQL(
        "select count(distinct person_id) from events where timestamp > now() - interval 30 day",
        'unique visitors last 30d'
      ),
      runHogQL(
        "select properties.$pathname as path, count() as views from events where event = '$pageview' and timestamp > now() - interval 30 day group by path order by views desc limit 10",
        'top pages last 30d'
      ),
      runHogQL(
        "select event, count() as total from events where timestamp > now() - interval 30 day group by event order by total desc limit 10",
        'top events last 30d'
      ),
      runHogQL(
        "select count() from events where event = '$exception' and timestamp > now() - interval 30 day",
        'exceptions last 30d'
      ),
    ]);

    res.json({
      pageviews: pageviews.results?.[0]?.[0] ?? 0,
      uniqueVisitors: uniqueVisitors.results?.[0]?.[0] ?? 0,
      topPages: topPages.results?.map(([path, views]) => ({ path, views })) ?? [],
      topEvents: topEvents.results?.map(([event, total]) => ({ event, total })) ?? [],
      exceptionCount: exceptions.results?.[0]?.[0] ?? 0,
    });
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to query posthog', attributes: { error: err.message } });
    res.status(502).json({ error: 'Could not fetch PostHog metrics' });
  }
});

export default router;
