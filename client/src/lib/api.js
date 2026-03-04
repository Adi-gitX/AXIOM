/**
 * AXIOM API Client
 * Centralized API communication with proper error handling
 */
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Fail-safe API Configuration
const PROD_BACKEND_URL = 'https://axiom-server-three.vercel.app';

export const getApiUrl = () => {
    const configuredUrl = (import.meta.env.VITE_API_URL || '').trim();
    const allowRemoteInDev = String(import.meta.env.VITE_ALLOW_REMOTE_API_IN_DEV || '').toLowerCase() === 'true';

    if (import.meta.env.DEV) {
        if (!configuredUrl) {
            return '';
        }

        const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configuredUrl);
        if (isLocal || allowRemoteInDev) {
            return configuredUrl;
        }

        console.warn(
            'Ignoring remote VITE_API_URL in development. Using local /api proxy. ' +
            'Set VITE_ALLOW_REMOTE_API_IN_DEV=true to force remote API.'
        );
        return '';
    }

    if (configuredUrl) {
        return configuredUrl;
    }

    if (import.meta.env.PROD) {
        console.warn('VITE_API_URL not set. Falling back to default backend:', PROD_BACKEND_URL);
        return PROD_BACKEND_URL;
    }
    return '';
};

const API_URL = getApiUrl();
const AUTH_WAIT_TIMEOUT_MS = 2500;
const DEV_AUTH_EMAIL_HEADER = 'x-axiom-dev-auth-email';
const DEV_AUTH_DEFAULT_EMAIL = 'local-dev@axiom.local';
const DEV_AUTH_FALLBACK_ENABLED = import.meta.env.DEV
    && String(import.meta.env.VITE_DEV_AUTH_FALLBACK || 'true').toLowerCase() === 'true';
const PUBLIC_ROUTE_PREFIXES = [
    '/api/progress/catalog',
    '/api/users/public/',
    '/api/gsoc/timeline',
    '/api/gsoc/orgs',
    '/api/education/catalog',
    '/api/interview/resources',
];
const inflightGetRequests = new Map();
const getResponseCache = new Map();
const GET_RATE_LIMIT_RETRY_MAX = 1;
const GET_RATE_LIMIT_RETRY_DELAY_MS = 600;
const GET_RESPONSE_CACHE_TTL_MS = 30 * 1000;
const GLOBAL_429_BURST_THRESHOLD = 2;
const GLOBAL_429_COOLDOWN_DEFAULT_MS = 1200;
const GLOBAL_429_BURST_WINDOW_MS = 8 * 1000;
const BACKEND_UNAVAILABLE_COOLDOWN_MS = 5000;
const ENABLE_GLOBAL_429_COOLDOWN = import.meta.env.PROD
    || String(import.meta.env.VITE_ENABLE_GLOBAL_429_COOLDOWN || 'false').toLowerCase() === 'true';
const globalRateLimitState = {
    burstCount: 0,
    lastHitAt: 0,
    cooldownUntilMs: 0,
};
const backendUnavailableState = {
    cooldownUntilMs: 0,
};
let authWaitPromise = null;

export const getBrowserTimeZone = () => {
    try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (typeof timeZone === 'string' && timeZone.trim()) {
            return timeZone;
        }
    } catch {
        // no-op
    }
    return 'UTC';
};

/**
 * Base fetch wrapper with error handling
 */
const isLikelyProxyFailureResponse = (url, response, rawBody, payload = {}) => {
    if (!import.meta.env.DEV || response.status < 500) {
        return false;
    }

    const endpoint = String(url || '');
    if (!endpoint.includes('/api/')) {
        return false;
    }

    const contentType = String(response.headers?.get?.('content-type') || '').toLowerCase();
    const jsonMessage = String(payload?.message || payload?.error || '').trim();
    const normalizedBody = String(rawBody || '').trim().toLowerCase();
    const proxyKeywords = ['proxy error', 'econnrefused', 'socket hang up', 'upstream connect error', 'fetch failed'];
    const hasProxyKeyword = proxyKeywords.some((token) => normalizedBody.includes(token) || jsonMessage.toLowerCase().includes(token));

    if (hasProxyKeyword) {
        return true;
    }

    if (!jsonMessage && !normalizedBody) {
        return true;
    }

    return (
        contentType.startsWith('text/plain')
        && normalizedBody === 'internal server error'
    );
};

const requestJson = async (url, config) => {
    let response;
    try {
        response = await fetch(url, config);
    } catch (networkError) {
        const err = new Error('Backend is unreachable. Start the API server on http://localhost:3000 and retry.');
        err.status = 503;
        err.code = 'BACKEND_UNAVAILABLE';
        err.cause = networkError;
        throw err;
    }
    const rawBody = await response.text().catch(() => '');
    let payload = {};
    if (rawBody) {
        try {
            payload = JSON.parse(rawBody);
        } catch {
            payload = {};
        }
    }

    if (!response.ok) {
        const jsonMessage = String(payload?.message || payload?.error || '').trim();
        const fallbackText = !jsonMessage
            ? String(rawBody || '').replace(/\s+/g, ' ').trim().slice(0, 220)
            : '';
        const err = new Error(jsonMessage || fallbackText || `Request failed: ${response.status}`);
        err.status = response.status;
        err.response = payload;
        if (response.status === 429) {
            const retryAfter = String(response.headers.get('Retry-After') || '').trim();
            if (retryAfter) {
                const asSeconds = Number.parseInt(retryAfter, 10);
                if (Number.isFinite(asSeconds) && asSeconds >= 0) {
                    err.retryAfterMs = asSeconds * 1000;
                } else {
                    const asDate = new Date(retryAfter);
                    if (!Number.isNaN(asDate.getTime())) {
                        err.retryAfterMs = Math.max(0, asDate.getTime() - Date.now());
                    }
                }
            }
        }
        const message = String(jsonMessage || fallbackText).toLowerCase();
        if (response.status === 401 && message.includes('missing authorization token')) {
            err.code = 'AUTH_MISSING_TOKEN';
        } else if (response.status === 401 && message.includes('invalid')) {
            err.code = 'AUTH_INVALID_TOKEN';
        } else if (response.status === 403 && message.includes('email mismatch')) {
            err.code = 'AUTH_EMAIL_MISMATCH';
        } else if (
            response.status >= 500
            && (
                message.includes('proxy error')
                || message.includes('econnrefused')
                || message.includes('socket hang up')
                || message.includes('fetch failed')
                || isLikelyProxyFailureResponse(url, response, rawBody, payload)
            )
        ) {
            err.code = 'BACKEND_UNAVAILABLE';
            err.message = 'Backend is unreachable. Start the API server on http://localhost:3000 and retry.';
        }
        throw err;
    }

    return payload;
};

const delayMs = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const nowMs = () => Date.now();

const getBackendUnavailableRemainingMs = () => {
    const remaining = Number(backendUnavailableState.cooldownUntilMs || 0) - nowMs();
    return remaining > 0 ? remaining : 0;
};

const markBackendUnavailable = (retryAfterMs = BACKEND_UNAVAILABLE_COOLDOWN_MS) => {
    const cooldownMs = Math.max(BACKEND_UNAVAILABLE_COOLDOWN_MS, Number.isFinite(retryAfterMs) ? retryAfterMs : 0);
    backendUnavailableState.cooldownUntilMs = Math.max(
        Number(backendUnavailableState.cooldownUntilMs || 0),
        nowMs() + cooldownMs
    );
};

const clearBackendUnavailableCooldown = () => {
    backendUnavailableState.cooldownUntilMs = 0;
};

const getGlobalCooldownRemainingMs = () => {
    const remaining = Number(globalRateLimitState.cooldownUntilMs || 0) - nowMs();
    return remaining > 0 ? remaining : 0;
};

const setGlobalRateLimitCooldown = (retryAfterMs = 0) => {
    const now = nowMs();
    const elapsed = now - Number(globalRateLimitState.lastHitAt || 0);
    const withinBurstWindow = elapsed <= GLOBAL_429_BURST_WINDOW_MS;
    globalRateLimitState.burstCount = withinBurstWindow
        ? globalRateLimitState.burstCount + 1
        : 1;
    globalRateLimitState.lastHitAt = now;

    const cooldownMs = Math.max(
        Number.isFinite(retryAfterMs) ? retryAfterMs : 0,
        globalRateLimitState.burstCount >= GLOBAL_429_BURST_THRESHOLD
            ? GLOBAL_429_COOLDOWN_DEFAULT_MS
            : 0
    );

    if (cooldownMs > 0) {
        globalRateLimitState.cooldownUntilMs = Math.max(
            Number(globalRateLimitState.cooldownUntilMs || 0),
            now + cooldownMs
        );
    }
};

const clearGlobalRateLimitCooldownIfIdle = () => {
    if (getGlobalCooldownRemainingMs() > 0) {
        return;
    }
    globalRateLimitState.burstCount = 0;
};

const buildRateLimitError = (message, retryAfterMs = 0, existingError = null) => {
    const waitMs = Math.max(0, Number.isFinite(retryAfterMs) ? retryAfterMs : 0);
    const error = existingError || new Error(message || 'Too many requests from this IP, please try again later.');
    error.status = 429;
    error.code = error.code || 'RATE_LIMIT_COOLDOWN';
    error.retryAfterMs = waitMs;
    error.cooldownUntilMs = nowMs() + waitMs;
    return error;
};

const buildBackendUnavailableError = (retryAfterMs = BACKEND_UNAVAILABLE_COOLDOWN_MS, existingError = null) => {
    const waitMs = Math.max(0, Number.isFinite(retryAfterMs) ? retryAfterMs : BACKEND_UNAVAILABLE_COOLDOWN_MS);
    const error = existingError || new Error('Backend is unreachable. Start the API server on http://localhost:3000 and retry.');
    error.status = 503;
    error.code = 'BACKEND_UNAVAILABLE';
    error.retryAfterMs = waitMs;
    error.cooldownUntilMs = nowMs() + waitMs;
    return error;
};

const shouldSilenceApiConsoleError = (error) => (
    error?.status === 429
    || error?.status === 503
    || error?.code === 'BACKEND_UNAVAILABLE'
    || error?.code === 'AUTH_MISSING_TOKEN'
    || error?.code === 'AUTH_INVALID_TOKEN'
);

const getCachedGetResponse = (requestKey) => {
    if (!requestKey) return null;
    const cached = getResponseCache.get(requestKey);
    if (!cached) return null;
    if ((nowMs() - Number(cached.ts || 0)) > GET_RESPONSE_CACHE_TTL_MS) {
        getResponseCache.delete(requestKey);
        return null;
    }
    return cached.data;
};

const setCachedGetResponse = (requestKey, data) => {
    if (!requestKey) return;
    getResponseCache.set(requestKey, {
        ts: nowMs(),
        data,
    });
};

const waitForAuthUser = async (timeoutMs = AUTH_WAIT_TIMEOUT_MS) => {
    if (auth?.currentUser) {
        return auth.currentUser;
    }

    if (authWaitPromise) {
        return authWaitPromise;
    }

    authWaitPromise = new Promise((resolve) => {
        let settled = false;
        const timeout = setTimeout(() => {
            if (settled) return;
            settled = true;
            try {
                unsubscribe?.();
            } catch {
                // no-op
            }
            resolve(auth?.currentUser || null);
        }, timeoutMs);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (settled) return;
            settled = true;
            clearTimeout(timeout);
            unsubscribe();
            resolve(user || null);
        });
    }).finally(() => {
        authWaitPromise = null;
    });

    return authWaitPromise;
};

const isPublicEndpoint = (endpoint, method) => {
    if (!endpoint.startsWith('/api/')) return true;
    if (method === 'GET' && PUBLIC_ROUTE_PREFIXES.some((prefix) => endpoint.startsWith(prefix))) {
        return true;
    }
    return false;
};

const getRequestEmailHint = (endpoint, options = {}) => {
    const normalize = (value) => String(value || '').trim().toLowerCase();
    const EMAIL_SEGMENT_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const body = options?.body;
    if (body && typeof body === 'object' && !Array.isArray(body)) {
        const bodyEmail = normalize(body.email);
        if (bodyEmail) return bodyEmail;
    }

    if (typeof body === 'string') {
        try {
            const parsed = JSON.parse(body);
            const parsedEmail = normalize(parsed?.email);
            if (parsedEmail) return parsedEmail;
        } catch {
            // no-op
        }
    }

    try {
        const query = endpoint.split('?')[1] || '';
        const params = new URLSearchParams(query);
        const queryEmail = normalize(params.get('email'));
        if (queryEmail) return queryEmail;
    } catch {
        // no-op
    }

    try {
        const path = endpoint.split('?')[0] || '';
        const segments = path.split('/').filter(Boolean);
        for (let i = segments.length - 1; i >= 0; i -= 1) {
            const decoded = normalize(decodeURIComponent(segments[i]));
            if (EMAIL_SEGMENT_RE.test(decoded)) {
                return decoded;
            }
        }
    } catch {
        // no-op
    }

    return '';
};

const getDevAuthBypassHeaders = (endpoint, options = {}) => {
    if (!DEV_AUTH_FALLBACK_ENABLED || !String(endpoint || '').startsWith('/api/')) {
        return {};
    }

    const hintedEmail = String(
        auth?.currentUser?.email
        || getRequestEmailHint(endpoint, options)
        || DEV_AUTH_DEFAULT_EMAIL
    ).trim().toLowerCase();

    if (!hintedEmail) {
        return {};
    }

    return { [DEV_AUTH_EMAIL_HEADER]: hintedEmail };
};

const getAuthHeadersForRequest = async (endpoint, method = 'GET', options = {}) => {
    const devBypassHeaders = getDevAuthBypassHeaders(endpoint, options);

    if (isPublicEndpoint(endpoint, method)) {
        return devBypassHeaders;
    }

    const user = auth?.currentUser || await waitForAuthUser();
    const normalizedEmail = String(
        user?.email
        || getRequestEmailHint(endpoint, options)
        || devBypassHeaders?.[DEV_AUTH_EMAIL_HEADER]
        || ''
    ).trim().toLowerCase();
    const devFallbackHeaders = normalizedEmail
        ? { [DEV_AUTH_EMAIL_HEADER]: normalizedEmail }
        : devBypassHeaders;

    if (user) {
        try {
            const token = await user.getIdToken();
            if (token) {
                return {
                    ...devFallbackHeaders,
                    Authorization: `Bearer ${token}`,
                };
            }
        } catch (firstError) {
            try {
                const refreshed = await user.getIdToken(true);
                if (refreshed) {
                    return {
                        ...devFallbackHeaders,
                        Authorization: `Bearer ${refreshed}`,
                    };
                }
            } catch (secondError) {
                console.warn('Token acquisition failed:', secondError.message || firstError.message);
            }
        }
    }

    if (Object.keys(devFallbackHeaders).length > 0) {
        return devFallbackHeaders;
    }

    const authError = new Error('Authenticated request requires a valid auth token');
    authError.status = 401;
    authError.code = 'AUTH_MISSING_TOKEN';
    throw authError;
};

const fetchApi = async (endpoint, options = {}) => {
    const primaryUrl = `${API_URL}${endpoint}`;
    const method = String(options.method || 'GET').toUpperCase();
    const isApiEndpoint = String(endpoint || '').startsWith('/api/');
    const authHeaders = await getAuthHeadersForRequest(endpoint, method, options);

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
            ...options.headers,
        },
        ...options,
    };

    if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
    }

    const requestKey = method === 'GET'
        ? `${primaryUrl}|${String(config?.headers?.[DEV_AUTH_EMAIL_HEADER] || '')}`
        : '';
    let tokenRefreshRetried = false;

    const executeRequestOnce = async () => {
        try {
            return await requestJson(primaryUrl, config);
        } catch (rawError) {
            let error = rawError;

            if (
                !tokenRefreshRetried
                && error?.code === 'AUTH_INVALID_TOKEN'
                && config?.headers?.Authorization
                && auth?.currentUser
            ) {
                tokenRefreshRetried = true;
                try {
                    const refreshedToken = await auth.currentUser.getIdToken(true);
                    if (refreshedToken) {
                        const refreshedConfig = {
                            ...config,
                            headers: {
                                ...config.headers,
                                Authorization: `Bearer ${refreshedToken}`,
                            },
                        };
                        return await requestJson(primaryUrl, refreshedConfig);
                    }
                } catch (tokenRefreshError) {
                    error = tokenRefreshError;
                }
            }

            if (
                import.meta.env.DEV
                && error?.code === 'AUTH_INVALID_TOKEN'
                && config?.headers?.Authorization
                && config?.headers?.[DEV_AUTH_EMAIL_HEADER]
            ) {
                const fallbackConfig = {
                    ...config,
                    headers: {
                        ...config.headers,
                    },
                };
                delete fallbackConfig.headers.Authorization;
                try {
                    return await requestJson(primaryUrl, fallbackConfig);
                } catch {
                    // continue with normal fallback flow below
                }
            }

            // Dev fallback: if configured API host is stale/unreachable, retry through local proxy.
            const shouldRetryLocally = Boolean(
                API_URL &&
                import.meta.env.DEV &&
                endpoint.startsWith('/api/')
            );

            if (shouldRetryLocally) {
                try {
                    return await requestJson(endpoint, config);
                } catch (fallbackErr) {
                    if (!shouldSilenceApiConsoleError(fallbackErr)) {
                        console.error(`API Error (${endpoint}) [primary+fallback]:`, fallbackErr.message);
                    }
                    throw fallbackErr;
                }
            }

            if (!shouldSilenceApiConsoleError(error)) {
                console.error(`API Error (${endpoint}):`, error.message);
            }
            throw error;
        }
    };

    const executeRequest = async () => {
        for (let retryCount = 0; retryCount <= GET_RATE_LIMIT_RETRY_MAX; retryCount += 1) {
            if (isApiEndpoint) {
                const backendCooldownMs = getBackendUnavailableRemainingMs();
                if (backendCooldownMs > 0) {
                    if (method === 'GET') {
                        const cached = getCachedGetResponse(requestKey);
                        if (cached !== null) {
                            return cached;
                        }
                    }
                    throw buildBackendUnavailableError(backendCooldownMs);
                }
            }

            if (method === 'GET') {
                const cooldownRemainingMs = ENABLE_GLOBAL_429_COOLDOWN
                    ? getGlobalCooldownRemainingMs()
                    : 0;
                if (cooldownRemainingMs > 0) {
                    const cached = getCachedGetResponse(requestKey);
                    if (cached !== null) {
                        return cached;
                    }
                    throw buildRateLimitError(
                        'Too many requests from this IP, please try again later.',
                        cooldownRemainingMs
                    );
                }
            }

            try {
                const response = await executeRequestOnce();
                if (isApiEndpoint) {
                    clearBackendUnavailableCooldown();
                }
                if (method === 'GET') {
                    setCachedGetResponse(requestKey, response);
                    clearGlobalRateLimitCooldownIfIdle();
                }
                return response;
            } catch (error) {
                const canRetry429 = (
                    method === 'GET'
                    && error?.status === 429
                    && retryCount < GET_RATE_LIMIT_RETRY_MAX
                );

                if (ENABLE_GLOBAL_429_COOLDOWN && error?.status === 429) {
                    setGlobalRateLimitCooldown(error?.retryAfterMs);
                }

                if (isApiEndpoint && error?.code === 'BACKEND_UNAVAILABLE') {
                    markBackendUnavailable(error?.retryAfterMs);
                }

                if (
                    method === 'GET'
                    && (
                        error?.status === 429
                        || error?.status >= 500
                        || error?.code === 'BACKEND_UNAVAILABLE'
                    )
                ) {
                    const cached = getCachedGetResponse(requestKey);
                    if (cached !== null) {
                        return cached;
                    }
                }

                if (!canRetry429) {
                    if (error?.status === 429) {
                        const retryAfterMs = Math.max(
                            ENABLE_GLOBAL_429_COOLDOWN ? getGlobalCooldownRemainingMs() : 0,
                            Number(error?.retryAfterMs || 0)
                        );
                        throw buildRateLimitError(error?.message, retryAfterMs, error);
                    }
                    throw error;
                }

                const waitMs = Math.max(
                    0,
                    Number.isFinite(error?.retryAfterMs)
                        ? error.retryAfterMs
                        : GET_RATE_LIMIT_RETRY_DELAY_MS
                );
                await delayMs(waitMs);
            }
        }

        throw new Error('Request failed after retry');
    };

    if (!requestKey) {
        return executeRequest();
    }

    if (inflightGetRequests.has(requestKey)) {
        return inflightGetRequests.get(requestKey);
    }

    const inflight = executeRequest().finally(() => {
        inflightGetRequests.delete(requestKey);
    });
    inflightGetRequests.set(requestKey, inflight);
    return inflight;
};

// ========================================
// User Profile API
// ========================================

export const userApi = {
    getProfile: (email) => fetchApi(`/api/users/${encodeURIComponent(email)}`),

    getPublicProfile: (username) =>
        fetchApi(`/api/users/public/${encodeURIComponent(username)}`),

    getAtsScore: (email) =>
        fetchApi(`/api/users/ats/${encodeURIComponent(email)}`),

    updateProfile: (data) => fetchApi('/api/users/profile', {
        method: 'POST',
        body: data,
    }),

    updateUsername: (email, username) => fetchApi('/api/users/username', {
        method: 'POST',
        body: { email, username },
    }),

    createOrGet: async (userData) => {
        try {
            return await fetchApi('/api/users', {
                method: 'POST',
                body: userData,
            });
        } catch (err) {
            // Backward compatibility with older backend deployments without POST /api/users.
            if (err?.status === 404 || err?.status === 405) {
                return fetchApi('/api/users/profile', {
                    method: 'POST',
                    body: {
                        email: userData.email,
                        name: userData.name,
                        avatar: userData.avatar,
                        experience: [],
                        skills: [],
                        socials: [],
                    },
                });
            }
            throw err;
        }
    },

    getCloudinarySignature: () => fetchApi('/api/sign-cloudinary'),
};

// ========================================
// Progress & Dashboard API
// ========================================

export const progressApi = {
    getCatalog: () => fetchApi('/api/progress/catalog'),

    getProgress: (email) => fetchApi(`/api/progress/${encodeURIComponent(email)}`),

    toggleProblem: (email, problemId, topicId, tz = getBrowserTimeZone()) => fetchApi('/api/progress/problem', {
        method: 'POST',
        body: { email, problemId, topicId, tz },
    }),

    getHeatmap: async (email, days = 30, tz = getBrowserTimeZone()) => {
        const params = new URLSearchParams({ days: String(days) });
        if (tz) {
            params.set('tz', tz);
        }

        const response = await fetchApi(
            `/api/progress/heatmap/${encodeURIComponent(email)}?${params.toString()}`
        );

        if (Array.isArray(response)) {
            return {
                timezone: tz || 'UTC',
                from: null,
                to: null,
                rows: response,
            };
        }

        return {
            timezone: response?.timezone || tz || 'UTC',
            from: response?.from || null,
            to: response?.to || null,
            rows: Array.isArray(response?.rows) ? response.rows : [],
        };
    },

    logStudyTime: (email, minutes) => fetchApi('/api/progress/study-time', {
        method: 'POST',
        body: { email, minutes },
    }),

    getDashboardStats: (email) =>
        fetchApi(`/api/progress/dashboard/${encodeURIComponent(email)}`),

    getDailyFocus: (email, limit = 3, tz = getBrowserTimeZone()) => {
        const params = new URLSearchParams({ limit: String(limit) });
        if (tz) {
            params.set('tz', tz);
        }
        return fetchApi(`/api/progress/focus/${encodeURIComponent(email)}?${params.toString()}`);
    },

    getProblemMeta: (email, sheetId = '') => {
        const params = new URLSearchParams();
        if (sheetId) {
            params.set('sheetId', sheetId);
        }
        const query = params.toString();
        return fetchApi(`/api/progress/problem-meta/${encodeURIComponent(email)}${query ? `?${query}` : ''}`);
    },

    saveProblemMeta: (payload) => fetchApi('/api/progress/problem-meta', {
        method: 'POST',
        body: {
            tz: getBrowserTimeZone(),
            ...payload,
        },
    }),

    getReviewQueue: (email, params = {}) => {
        const search = new URLSearchParams();
        if (params.sheetId) search.set('sheetId', params.sheetId);
        if (params.limit) search.set('limit', String(params.limit));
        if (params.daysAhead !== undefined) search.set('daysAhead', String(params.daysAhead));
        search.set('tz', params.tz || getBrowserTimeZone());
        const query = search.toString();
        return fetchApi(`/api/progress/review/${encodeURIComponent(email)}${query ? `?${query}` : ''}`);
    },

    completeReview: (payload) => fetchApi('/api/progress/review/complete', {
        method: 'POST',
        body: {
            tz: getBrowserTimeZone(),
            ...payload,
        },
    }),
};

// ========================================
// Jobs API
// ========================================

export const jobsApi = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchApi(`/api/jobs${query ? `?${query}` : ''}`);
    },

    getById: (id) => fetchApi(`/api/jobs/${id}`),

    save: (email, jobId) => fetchApi('/api/jobs/save', {
        method: 'POST',
        body: { email, jobId },
    }),

    unsave: (email, jobId) =>
        fetchApi(`/api/jobs/save/${jobId}?email=${encodeURIComponent(email)}`, {
            method: 'DELETE',
            body: { email },
        }),

    getSavedIds: (email) => fetchApi(`/api/jobs/saved-ids/${encodeURIComponent(email)}`),

    getSaved: (email) => fetchApi(`/api/jobs/saved/${encodeURIComponent(email)}`),

    apply: (email, jobId, notes) => fetchApi('/api/jobs/apply', {
        method: 'POST',
        body: { email, jobId, notes },
    }),

    getApplied: (email) => fetchApi(`/api/jobs/applied/${encodeURIComponent(email)}`),
};

// ========================================
// Education API
// ========================================

export const educationApi = {
    getCatalog: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchApi(`/api/education/catalog${query ? `?${query}` : ''}`);
    },

    getProgress: (email) => fetchApi(`/api/education/progress/${encodeURIComponent(email)}`),

    markWatched: (email, videoId, topicId) => fetchApi('/api/education/watched', {
        method: 'POST',
        body: { email, videoId, topicId },
    }),

    updateProgress: (email, videoId, topicId, percentageOrPayload) => {
        const payload = (percentageOrPayload && typeof percentageOrPayload === 'object')
            ? {
                percentage: percentageOrPayload.progress ?? percentageOrPayload.percentage ?? 0,
                completed: percentageOrPayload.completed,
            }
            : { percentage: percentageOrPayload };

        return fetchApi('/api/education/progress', {
            method: 'POST',
            body: { email, videoId, topicId, ...payload },
        });
    },

    getRecent: (email, limit = 5) =>
        fetchApi(`/api/education/recent/${encodeURIComponent(email)}?limit=${limit}`),
};

// ========================================
// Chat API
// ========================================

export const chatApi = {
    getChannels: (email = '') => fetchApi(`/api/chat/channels${email ? `?email=${encodeURIComponent(email)}` : ''}`),

    getOnlineUsers: () => fetchApi('/api/chat/online'),

    createChannel: (name, description, email, isPrivate = false) => fetchApi('/api/chat/channels', {
        method: 'POST',
        body: { name, description, email, isPrivate },
    }),

    getMessages: (channelId, limit = 50, email = '') =>
        fetchApi(`/api/chat/messages/${channelId}?limit=${limit}${email ? `&email=${encodeURIComponent(email)}` : ''}`),

    getNewMessages: (channelId, since, email = '') =>
        fetchApi(`/api/chat/messages/${channelId}/new?since=${since}${email ? `&email=${encodeURIComponent(email)}` : ''}`),

    sendMessage: (email, channelId, content, userName, userAvatar) =>
        fetchApi('/api/chat/messages', {
            method: 'POST',
            body: { email, channelId, content, userName, userAvatar },
        }),

    deleteMessage: (id, email) =>
        fetchApi(`/api/chat/messages/${id}?email=${encodeURIComponent(email)}`, {
            method: 'DELETE',
            body: { email },
        }),

    getChannelMembers: (channelId) =>
        fetchApi(`/api/chat/channels/${encodeURIComponent(channelId)}/members`),

    inviteChannelMember: (channelId, memberEmail) =>
        fetchApi(`/api/chat/channels/${encodeURIComponent(channelId)}/invite`, {
            method: 'POST',
            body: { memberEmail },
        }),

    removeChannelMember: (channelId, memberEmail) =>
        fetchApi(`/api/chat/channels/${encodeURIComponent(channelId)}/members/remove`, {
            method: 'POST',
            body: { memberEmail },
        }),
};

// ========================================
// OSS API
// ========================================

export const ossApi = {
    getGithubConnectUrl: (email) =>
        fetchApi(`/api/oss/github/connect-url?email=${encodeURIComponent(email)}`),

    getGithubProfile: (email) =>
        fetchApi(`/api/oss/github/profile/${encodeURIComponent(email)}`),

    getSyncStatus: (email) =>
        fetchApi(`/api/oss/sync-status/${encodeURIComponent(email)}`),

    syncContributions: (email) =>
        fetchApi(`/api/oss/sync/${encodeURIComponent(email)}`, {
            method: 'POST',
            body: { email },
        }),

    getContributions: (email) =>
        fetchApi(`/api/oss/contributions/${encodeURIComponent(email)}`),

    getActivity: (email, days = 365) =>
        fetchApi(`/api/oss/activity/${encodeURIComponent(email)}?days=${days}`),

    getIssueRecommendation: (email) =>
        fetchApi(`/api/oss/issue/${encodeURIComponent(email)}`),

    disconnectGithub: (email) =>
        fetchApi('/api/oss/github/disconnect', {
            method: 'POST',
            body: { email },
        }),
};

// ========================================
// GSOC API
// ========================================

export const gsocApi = {
    getTimeline: () => fetchApi('/api/gsoc/timeline'),

    getOrgs: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchApi(`/api/gsoc/orgs${query ? `?${query}` : ''}`);
    },

    getReadiness: (email) =>
        fetchApi(`/api/gsoc/readiness/${encodeURIComponent(email)}`),

    getReminders: (email, includeDismissed = false) =>
        fetchApi(`/api/gsoc/reminders/${encodeURIComponent(email)}?includeDismissed=${includeDismissed ? 'true' : 'false'}`),

    dismissReminder: (email, milestoneId) =>
        fetchApi('/api/gsoc/reminders/dismiss', {
            method: 'POST',
            body: { email, milestoneId },
        }),

    restoreReminder: (email, milestoneId) =>
        fetchApi('/api/gsoc/reminders/restore', {
            method: 'POST',
            body: { email, milestoneId },
        }),
};

// ========================================
// Posts API
// ========================================

export const postsApi = {
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const endpoint = `/api/posts${query ? `?${query}` : ''}`;

        try {
            return await fetchApi(endpoint);
        } catch (err) {
            // Compatibility retry: older backend versions can fail when `email` hydration is requested.
            if (params.email) {
                const retryParams = { ...params };
                delete retryParams.email;
                const retryQuery = new URLSearchParams(retryParams).toString();
                return fetchApi(`/api/posts${retryQuery ? `?${retryQuery}` : ''}`);
            }
            throw err;
        }
    },

    getById: (id) => fetchApi(`/api/posts/${id}`),

    create: (postData) => fetchApi('/api/posts', {
        method: 'POST',
        body: postData,
    }),

    getUserInteractions: (email) =>
        fetchApi(`/api/posts/interactions/${encodeURIComponent(email)}`),

    vote: (id, email, voteType) => fetchApi(`/api/posts/${id}/vote`, {
        method: 'POST',
        body: { email, voteType },
    }),

    toggleSave: (id, email) => fetchApi(`/api/posts/${id}/save`, {
        method: 'POST',
        body: { email },
    }),

    getComments: (id) => fetchApi(`/api/posts/${id}/comments`),

    addComment: (id, email, content, userName, userAvatar) =>
        fetchApi(`/api/posts/${id}/comments`, {
            method: 'POST',
            body: { email, content, userName, userAvatar },
        }),
};

// ========================================
// Settings API
// ========================================

export const settingsApi = {
    get: (email) => fetchApi(`/api/settings/${encodeURIComponent(email)}`),

    update: (email, settings) => fetchApi('/api/settings', {
        method: 'POST',
        body: { email, ...settings },
    }),

    updateNotifications: (email, notifications) => fetchApi('/api/settings/notifications', {
        method: 'POST',
        body: { email, notifications },
    }),

    updateTheme: (email, theme) => fetchApi('/api/settings/theme', {
        method: 'POST',
        body: { email, theme },
    }),
};

// ========================================
// Interview API
// ========================================

export const interviewApi = {
    getResources: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchApi(`/api/interview/resources${query ? `?${query}` : ''}`);
    },

    getProgress: (email) => fetchApi(`/api/interview/progress/${encodeURIComponent(email)}`),

    setCompleted: (resourceId, email, completed = true, notes = null) =>
        fetchApi(`/api/interview/resources/${resourceId}/complete`, {
            method: 'POST',
            body: { email, completed, notes },
        }),
};

export default {
    user: userApi,
    progress: progressApi,
    jobs: jobsApi,
    education: educationApi,
    chat: chatApi,
    posts: postsApi,
    settings: settingsApi,
    interview: interviewApi,
    oss: ossApi,
    gsoc: gsocApi,
};
