import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import { loadEnv } from './config/loadEnv.js';

// Route imports
import userRoutes from './routes/userRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import jobsRoutes from './routes/jobsRoutes.js';
import educationRoutes from './routes/educationRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import postsRoutes from './routes/postsRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import ossRoutes from './routes/ossRoutes.js';
import gsocRoutes from './routes/gsocRoutes.js';
import companiesRoutes from './routes/companiesRoutes.js';
import interviewExperienceRoutes from './routes/interviewExperienceRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import submissionsRoutes from './routes/submissionsRoutes.js';
import peerRoutes from './routes/peerRoutes.js';
import judgeRoutes from './routes/judgeRoutes.js';
import publicIngestRoutes from './routes/publicIngestRoutes.js';
import { attachPeerRelay } from './services/peerRelay.js';

// Middleware imports
import { sanitizeBody } from './middleware/validation.js';
import { initSentry, Sentry } from './config/sentry.js';

loadEnv();
initSentry();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const firebaseApiKey = (
    process.env.FIREBASE_API_KEY
    || process.env.VITE_FIREBASE_API_KEY
    || process.env.FIREBASE_WEB_API_KEY
    || ''
).trim();
const devBypassEnabled = !isProduction
    && String(process.env.ALLOW_UNAUTHENTICATED_DEV || 'true').toLowerCase() === 'true';

if (isProduction && !firebaseApiKey) {
    throw new Error(
        'FIREBASE_API_KEY is required in production. Set FIREBASE_API_KEY (or FIREBASE_WEB_API_KEY) before boot.'
    );
}

if (!isProduction) {
    if (devBypassEnabled) {
        console.warn('[auth] Development auth bypass is enabled (ALLOW_UNAUTHENTICATED_DEV=true).');
    }
    if (!firebaseApiKey) {
        console.warn('[auth] Firebase API key is not configured. Token verification will fail when bypass is disabled.');
    }
}

// Security Middleware
app.use(helmet());

const toBool = (value, fallback = false) => {
    if (value === undefined || value === null || value === '') return fallback;
    return ['1', 'true', 'yes', 'on'].includes(String(value).trim().toLowerCase());
};

const devRateLimitEnabled = toBool(process.env.ENABLE_DEV_RATE_LIMIT, false);
const forceDisableRateLimit = toBool(process.env.DISABLE_RATE_LIMIT, false);
const allowLocalRateLimitBypass = toBool(process.env.ALLOW_LOCAL_RATE_LIMIT_BYPASS, true);
const isLoopbackIp = (value = '') => {
    const ip = String(value || '').trim().toLowerCase();
    return (
        ip === '::1'
        || ip === '::ffff:127.0.0.1'
        || ip === '127.0.0.1'
        || ip === 'localhost'
    );
};
const isPrivateLanIp = (value = '') => {
    const ip = String(value || '').trim().toLowerCase();
    return (
        /^::ffff:10\./.test(ip)
        || /^10\./.test(ip)
        || /^::ffff:192\.168\./.test(ip)
        || /^192\.168\./.test(ip)
        || /^::ffff:172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
        || /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
    );
};
const isLocalOrigin = (origin = '') => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
const isLocalHostHeader = (host = '') => /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(String(host || '').trim());
const isLocalTraffic = (req, options = {}) => {
    const allowPrivateLan = options?.allowPrivateLan === true;
    const origin = String(req.headers?.origin || '').trim();
    if (isLocalOrigin(origin)) return true;

    const host = String(req.headers?.host || '').trim();
    if (isLocalHostHeader(host)) return true;

    const requestIp = String(req.ip || '').trim();
    const socketIp = String(req.socket?.remoteAddress || '').trim();
    if (isLoopbackIp(requestIp) || isLoopbackIp(socketIp)) return true;
    if (allowPrivateLan && (isPrivateLanIp(requestIp) || isPrivateLanIp(socketIp))) return true;

    return false;
};

const classifyRateLimitSource = (req) => {
    if (isLocalTraffic(req, { allowPrivateLan: !isProduction })) return 'local';
    if (req.headers?.['x-forwarded-for']) return 'proxy';
    return 'public';
};

const shouldApplyRateLimitGlobally = !forceDisableRateLimit && (isProduction || devRateLimitEnabled);

const shouldSkipRateLimit = (req) => {
    if (forceDisableRateLimit) return true;
    if (!isProduction && !devRateLimitEnabled) return true;

    if (allowLocalRateLimitBypass && isLocalTraffic(req, { allowPrivateLan: !isProduction })) return true;

    // Allow local dev fallback identity header to bypass local throttling even in prod-mode local runs.
    if (
        req.headers?.['x-axiom-dev-auth-email']
        && isLocalTraffic(req, { allowPrivateLan: true })
    ) {
        return true;
    }

    return false;
};
const isReadMethod = (req) => ['GET', 'HEAD', 'OPTIONS'].includes(String(req.method || '').toUpperCase());

const limiterDiagnostics = {
    environment: process.env.NODE_ENV || 'development',
    enabled: shouldApplyRateLimitGlobally,
    forceDisabled: forceDisableRateLimit,
    devRateLimitEnabled,
    allowLocalRateLimitBypass,
    readWindowMs: isProduction ? 15 * 60 * 1000 : 60 * 1000,
    readMax: isProduction ? 600 : 8000,
    writeWindowMs: isProduction ? 15 * 60 * 1000 : 60 * 1000,
    writeMax: isProduction ? 120 : 2000,
};

const createLimiterHandler = (scope) => (req, res, _next, options) => {
    const source = classifyRateLimitSource(req);
    console.warn(`[rate-limit] blocked scope=${scope}`, JSON.stringify({
        method: req.method,
        path: req.originalUrl || req.path,
        source,
        ip: req.ip,
    }));
    res.status(options.statusCode).json({
        status: 'error',
        message: options.message,
    });
};

const readLimiter = rateLimit({
    windowMs: limiterDiagnostics.readWindowMs,
    max: limiterDiagnostics.readMax,
    message: isProduction
        ? 'Too many requests from this IP, please try again later.'
        : 'Too many requests in development. Slow down request spam.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => shouldSkipRateLimit(req) || !isReadMethod(req),
    handler: createLimiterHandler('read'),
});

const writeLimiter = rateLimit({
    windowMs: limiterDiagnostics.writeWindowMs,
    max: limiterDiagnostics.writeMax,
    message: isProduction
        ? 'Too many requests from this IP, please try again later.'
        : 'Too many write requests in development. Slow down request spam.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => shouldSkipRateLimit(req) || isReadMethod(req),
    handler: createLimiterHandler('write'),
});

if (shouldApplyRateLimitGlobally) {
    app.use(readLimiter);
    app.use(writeLimiter);
} else {
    console.warn('[rate-limit] Disabled for local development traffic.');
}

console.info('[rate-limit] startup', JSON.stringify(limiterDiagnostics));

// Performance & Logging
app.use(compression());
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// CORS configuration
//
// Production lockdown: when NODE_ENV=production AND PRODUCTION_FRONTEND_URL is
// set, ONLY that single origin (plus FRONTEND_URLS extras) is allowed. This
// prevents arbitrary previews from talking to the prod API.
const productionPrimary = (process.env.PRODUCTION_FRONTEND_URL || '').trim();

const configuredOrigins = isProduction && productionPrimary


// TODO: Complete implementation in subsequent commits (Stage 1/2)
