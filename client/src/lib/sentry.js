/**
 * Sentry init for the React frontend.
 *
 * No-op if VITE_SENTRY_DSN is not set — this keeps preview/dev quiet and
 * only fires errors to Sentry once a real DSN is configured.
 *
 * Wire this in main.jsx BEFORE rendering the app so init catches early errors.
 */
import * as Sentry from '@sentry/react';

const DSN = (import.meta.env.VITE_SENTRY_DSN || '').trim();
const ENVIRONMENT = import.meta.env.VITE_SENTRY_ENV || (import.meta.env.PROD ? 'production' : 'development');

let initialized = false;

export const initSentry = () => {
    if (initialized) return;
    if (!DSN) {
        if (import.meta.env.PROD) {
            console.warn('[sentry] VITE_SENTRY_DSN not set — error tracking disabled');
        }
        return;
    }
    Sentry.init({
        dsn: DSN,
        environment: ENVIRONMENT,
        // Performance monitoring kept conservative on free tier (10% sampling).
        tracesSampleRate: 0.1,
        // Send the user-supplied error message + stack, no PII by default.
        sendDefaultPii: false,
        // Don't auto-capture console errors — let our ErrorBoundary report intentionally.
        integrations: [],
    });
    initialized = true;
};

export { Sentry };
