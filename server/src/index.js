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
