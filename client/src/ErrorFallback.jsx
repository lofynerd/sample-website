import { PostHogErrorBoundary } from '@posthog/react';

// Catches rendering errors, reports them to PostHog Error Tracking, shows a graceful fallback
function FallbackUI() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bone text-ink px-6 text-center">
      <h1 className="font-display text-3xl mb-3">Something went wrong</h1>
      <p className="text-stone text-sm max-w-sm">
        We've been notified and are looking into it. Please refresh the page or try again shortly.
      </p>
    </div>
  );
}

export default function ErrorFallback({ children }) {
  return <PostHogErrorBoundary fallback={<FallbackUI />}>{children}</PostHogErrorBoundary>;
}
