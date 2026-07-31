import { PostHog } from 'posthog-node';

// Single shared PostHog client for backend events, error tracking, and feature flags
const posthogKey = process.env.POSTHOG_PROJECT_TOKEN;

if (!posthogKey) {
  console.warn('POSTHOG_PROJECT_TOKEN is not set, backend events will not be captured');
}

const posthog = posthogKey
  ? new PostHog(posthogKey, {
      host: process.env.POSTHOG_HOST ?? 'https://us.i.posthog.com',
      enableExceptionAutocapture: true,
    })
  : null;

posthog?.on('error', (err) => {
  console.error('PostHog client error', err);
});

export default posthog;
