/**
 * Sentry init for the Express backend.
 *
 * No-op if SENTRY_DSN is not set. Returns the Sentry namespace so the caller
 * can attach the request handler / error handler to the app.
 */
import * as Sentry from '@sentry/node';

const DSN = (process.env.SENTRY_DSN || '').trim();
const ENVIRONMENT = process.env.NODE_ENV || 'development';

let initialized = false;

export const initSentry = () => {
    if (initialized) return null;
    if (!DSN) {
        if (ENVIRONMENT === 'production') {
            console.warn('[sentry] SENTRY_DSN not set — server-side error tracking disabled');
        }
        return null;
    }
    Sentry.init({
        dsn: DSN,
        environment: ENVIRONMENT,
        tracesSampleRate: 0.1,
        sendDefaultPii: false,
    });
    initialized = true;
    return Sentry;
};

export { Sentry };
