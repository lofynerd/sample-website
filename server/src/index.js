import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { setupExpressErrorHandler } from 'posthog-node';
import posthog from './lib/posthog.js';
import { initLogs } from './lib/logs.js';
import { connectDB } from './lib/db.js';
import attachPosthogContext from './middleware/posthogContext.js';
import newsletterRouter from './routes/newsletter.js';
import ordersRouter from './routes/orders.js';
import productsRouter from './routes/products.js';
import journalRouter from './routes/journal.js';
import adminRouter from './routes/admin.js';
import subscribersRouter from './routes/subscribers.js';
import contactRouter from './routes/contact.js';
import analyticsRouter from './routes/analytics.js';
import authRouter from './routes/auth.js';
import wishlistRouter from './routes/wishlist.js';
import auditLogRouter from './routes/auditLog.js';

initLogs();
await connectDB();

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json());

// Register request context before routes so events auto-link to the frontend session
attachPosthogContext(app);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/v1/newsletter', newsletterRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/journal', journalRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/subscribers', subscribersRouter);
app.use('/api/v1/contact', contactRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/wishlist', wishlistRouter);
app.use('/api/v1/audit-log', auditLogRouter);

// Register error handler after routes to capture Express errors in PostHog Error Tracking
if (posthog) {
  setupExpressErrorHandler(posthog, app);
}

app.listen(PORT, () => {
  console.log(`Maison Delulu API listening on port ${PORT}`);
});

process.on('SIGTERM', async () => {
  await posthog?.shutdown();
  process.exit(0);
});
