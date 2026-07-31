import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PostHogProvider } from '@posthog/react';
import App from './app/App.jsx';
import ErrorFallback from './ErrorFallback.jsx';
import './styles/globals.css';

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;

if (!posthogKey && import.meta.env.DEV) {
  console.error(
    'VITE_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_KEY is configured'
  );
}

// Central PostHog config: product analytics, web analytics, session replay, error tracking,
// surveys, and the Support widget are all served off this single init call.
const posthogOptions = {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  defaults: '2026-05-30',
  capture_pageview: true,
  capture_pageleave: true,
  capture_exceptions: true,
  disable_session_recording: false,
  disable_surveys: false,
  disable_conversations: false,
  logs: { serviceName: 'maison-delulu-web', environment: import.meta.env.MODE },
  // Lets the backend (posthog-node) correlate its events/logs to this browser session
  tracing_headers: [import.meta.env.VITE_API_HOST ?? 'localhost:4000'],
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PostHogProvider apiKey={posthogKey} options={posthogOptions}>
      <HelmetProvider>
        <BrowserRouter>
          <ErrorFallback>
            <App />
          </ErrorFallback>
        </BrowserRouter>
      </HelmetProvider>
    </PostHogProvider>
  </React.StrictMode>
);
