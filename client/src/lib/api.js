/**
 * AXIOM API Client
 * Centralized API communication with proper error handling
 */

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
const requestJson = async (url, config) => {
    const response = await fetch(url, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const err = new Error(error.message || `Request failed: ${response.status}`);
        err.status = response.status;
        err.response = error;
        throw err;
    }

    return response.json();
};

const fetchApi = async (endpoint, options = {}) => {
    const primaryUrl = `${API_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
    }

    try {
        return await requestJson(primaryUrl, config);
    } catch (error) {
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
                console.error(`API Error (${endpoint}) [primary+fallback]:`, fallbackErr.message);
                throw fallbackErr;
            }
        }

        console.error(`API Error (${endpoint}):`, error.message);
        throw error;
    }
};

// ========================================
// User Profile API
// ========================================

export const userApi = {
    getProfile: (email) => fetchApi(`/api/users/${encodeURIComponent(email)}`),

    updateProfile: (data) => fetchApi('/api/users/profile', {
        method: 'POST',
        body: data,
    }),

    createOrGet: async (userData) => {
        try {
            return await fetchApi('/api/users', {
                method: 'POST',
                body: userData,
            });
        } catch (err) {
            // Backward compatibility with older backend deployments without POST /api/users.
            if (err?.status === 404 || err?.status >= 500) {
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
    getChannels: () => fetchApi('/api/chat/channels'),

    createChannel: (name, description, email) => fetchApi('/api/chat/channels', {
        method: 'POST',
        body: { name, description, email },
    }),

    getMessages: (channelId, limit = 50) =>
        fetchApi(`/api/chat/messages/${channelId}?limit=${limit}`),

    getNewMessages: (channelId, since) =>
        fetchApi(`/api/chat/messages/${channelId}/new?since=${since}`),

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
};
