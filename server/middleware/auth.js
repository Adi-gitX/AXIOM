const FIREBASE_LOOKUP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:lookup';
const DEV_AUTH_EMAIL_HEADER = 'x-axiom-dev-auth-email';

const getFirebaseApiKey = () => (
    process.env.FIREBASE_API_KEY
    || process.env.VITE_FIREBASE_API_KEY
    || process.env.FIREBASE_WEB_API_KEY
    || ''
).trim();

const parseBearerToken = (headerValue = '') => {
    const value = String(headerValue || '');
    if (!value.toLowerCase().startsWith('bearer ')) return '';
    return value.slice(7).trim();
};

const parseDevAuthEmail = (req) => (
    String(req?.headers?.[DEV_AUTH_EMAIL_HEADER] || '').trim().toLowerCase()
);

const toBoolean = (value, fallback = false) => {
    if (value === undefined || value === null || value === '') {
        return fallback;
    }
    return ['1', 'true', 'yes', 'on'].includes(String(value).trim().toLowerCase());
};

const isLoopbackIp = (value = '') => {
    const ip = String(value || '').trim().toLowerCase();
    return (
        ip === '::1'
        || ip === '::ffff:127.0.0.1'
        || ip === '127.0.0.1'
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

const isLocalOrigin = (origin = '') => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(String(origin || '').trim());
const isLocalHostHeader = (host = '') => /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(String(host || '').trim());

const isLocalRequest = (req) => (
    isLocalOrigin(req?.headers?.origin)
    || isLocalHostHeader(req?.headers?.host)
    || isLoopbackIp(req?.ip)
    || isLoopbackIp(req?.socket?.remoteAddress)
    || isPrivateLanIp(req?.ip)
    || isPrivateLanIp(req?.socket?.remoteAddress)
);

const applyAuthenticatedEmail = (req, email) => {
    if (!email) {
        req.authEmail = null;
        return;
    }
    if (req.body && typeof req.body === 'object') {
        req.body.email = email;
    }
    req.authEmail = email;
};

const handleDevAuthFallback = ({ req, res, next, requestedEmail }) => {
    const devHeaderEmail = parseDevAuthEmail(req);

    if (isDevHeaderFallbackEnabled(req) && devHeaderEmail) {
        if (requestedEmail && requestedEmail !== devHeaderEmail) {
            res.status(403).json({ error: 'Email mismatch for authenticated request' });
            return true;
        }
        applyAuthenticatedEmail(req, devHeaderEmail);
        next();
        return true;
    }

    if (isDevBypassEnabled(req)) {
        const fallbackEmail = requestedEmail || devHeaderEmail || null;
        applyAuthenticatedEmail(req, fallbackEmail);
        next();
        return true;
    }

    return false;
};

const extractRequestedEmail = (req) => {
    const bodyEmail = req?.body?.email;
    const paramEmail = req?.params?.email;
    const queryEmail = req?.query?.email;
    return String(bodyEmail || paramEmail || queryEmail || '').trim().toLowerCase();
};

const isDevBypassEnabled = (req) => {
    if (process.env.ALLOW_UNAUTHENTICATED_DEV !== undefined) {
        return toBoolean(process.env.ALLOW_UNAUTHENTICATED_DEV, false);
    }

    if (process.env.NODE_ENV !== 'production') {
        return true;
    }

    return toBoolean(process.env.ALLOW_LOCAL_AUTH_FALLBACK, true) && isLocalRequest(req);
};

const isDevHeaderFallbackEnabled = (req) => {
    if (process.env.ALLOW_DEV_AUTH_HEADER !== undefined) {
        return toBoolean(process.env.ALLOW_DEV_AUTH_HEADER, false);
    }

    if (process.env.NODE_ENV !== 'production') {
        return true;
    }

    return toBoolean(process.env.ALLOW_LOCAL_AUTH_FALLBACK, true) && isLocalRequest(req);
};

const tokenCache = new Map();
const TOKEN_CACHE_TTL_MS = 60 * 1000;

const verifyFirebaseToken = async (idToken) => {
    const cached = tokenCache.get(idToken);
    if (cached && (Date.now() - cached.ts) < TOKEN_CACHE_TTL_MS) {
        return cached.email;
    }

    const apiKey = getFirebaseApiKey();
    if (!apiKey) {
        throw new Error('Firebase API key is not configured for token verification');
    }

    const response = await fetch(`${FIREBASE_LOOKUP_URL}?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
        const details = await response.text().catch(() => '');
        throw new Error(`Token verification failed (${response.status}): ${details.slice(0, 160)}`);
    }

    const payload = await response.json();
    const email = String(payload?.users?.[0]?.email || '').trim().toLowerCase();
    if (!email) {
        throw new Error('Verified token did not include an email');
    }

    tokenCache.set(idToken, { email, ts: Date.now() });
    return email;
};

export const requireVerifiedUser = async (req, res, next) => {
    const requestedEmail = extractRequestedEmail(req);

    try {
        const token = parseBearerToken(req.headers?.authorization);

        if (!token) {
            const handledByFallback = handleDevAuthFallback({
                req,
                res,
                next,
                requestedEmail,
            });
            if (handledByFallback) {
                return;
            }

            return res.status(401).json({ error: 'Missing authorization token' });
        }

        const verifiedEmail = await verifyFirebaseToken(token);

        if (requestedEmail && requestedEmail !== verifiedEmail) {
            return res.status(403).json({ error: 'Email mismatch for authenticated request' });
        }

        applyAuthenticatedEmail(req, verifiedEmail);

        return next();
    } catch (err) {
        console.error('requireVerifiedUser error:', err.message);
        const handledByFallback = handleDevAuthFallback({
            req,
            res,
            next,
            requestedEmail,
        });
        if (handledByFallback) {
            console.warn('requireVerifiedUser fallback used after token verification failure');
            return;
        }
        return res.status(401).json({ error: 'Invalid or expired authorization token' });
    }
};

export default {
    requireVerifiedUser,
};
