import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { Resource } from '@opentelemetry/resources';
import { logs } from '@opentelemetry/api-logs';

// Ships structured logs to PostHog Logs via OpenTelemetry, correlated to this service
let sdkStarted = false;

export function initLogs() {
  const posthogKey = process.env.POSTHOG_PROJECT_TOKEN;
  if (!posthogKey || sdkStarted) return;

  const host = process.env.POSTHOG_HOST ?? 'https://us.i.posthog.com';
  const sdk = new NodeSDK({
    resource: new Resource({ 'service.name': 'maison-delulu-api' }),
    logRecordProcessor: new BatchLogRecordProcessor(
      new OTLPLogExporter({
        url: `${host}/i/v1/logs`,
        headers: { Authorization: `Bearer ${posthogKey}` },
      })
    ),
  });

  sdk.start();
  sdkStarted = true;
}

// Logger instance used across the app: logger.emit({ severityText, body, attributes })
export const logger = logs.getLogger('maison-delulu-api');
