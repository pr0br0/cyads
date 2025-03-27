import * as Sentry from '@sentry/nextjs';
import { replayIntegration } from '@sentry/browser';
import { browserTracingIntegration } from '@sentry/browser';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  debug: false,
  integrations: [
    replayIntegration(),
    browserTracingIntegration()
  ]
});
