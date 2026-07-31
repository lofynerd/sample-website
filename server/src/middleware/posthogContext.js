import { setupExpressRequestContext } from 'posthog-node';
import posthog from '../lib/posthog.js';

// Reads X-POSTHOG-SESSION-ID / X-POSTHOG-DISTINCT-ID sent by the frontend (via tracing_headers)
// so backend events, logs, and exceptions link back to the originating browser session
export default function attachPosthogContext(app) {
  if (!posthog) return;
  setupExpressRequestContext(posthog, app);
}
