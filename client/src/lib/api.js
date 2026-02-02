/**
 * AXIOM API Client
 * Centralized API communication with proper error handling
 */

// Fail-safe API Configuration
const PROD_BACKEND_URL = 'https://axiom-server-three.vercel.app';

export const getApiUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    if (import.meta.env.PROD) {
        console.warn('VITE_API_URL not set. Falling back to default backend:', PROD_BACKEND_URL);
        return PROD_BACKEND_URL;
    }
    return '';
};

const API_URL = getApiUrl();

/**
 * Base fetch wrapper with error handling
 */
const fetchApi = async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;

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
        const response = await fetch(url, config);

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `Request failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
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

    getCloudinarySignature: () => fetchApi('/api/sign-cloudinary'),
};

// ========================================
// Progress & Dashboard API
// ========================================

export const progressApi = {
    getProgress: (email) => fetchApi(`/api/progress/${encodeURIComponent(email)}`),

    toggleProblem: (email, problemId, topicId) => fetchApi('/api/progress/problem', {
        method: 'POST',
        body: { email, problemId, topicId },
    }),

    getHeatmap: (email, days = 30) =>
        fetchApi(`/api/progress/heatmap/${encodeURIComponent(email)}?days=${days}`),

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

    unsave: (email, jobId) => fetchApi(`/api/jobs/save/${jobId}`, {
        method: 'DELETE',
        body: { email },
    }),

    getSavedIds: (email) => fetchApi(`/api/jobs/saved-ids/${encodeURIComponent(email)}`),

    getSaved: (email) => fetchApi(`/api/jobs/saved/${encodeURIComponent(email)}`),

    apply: (email, jobId, notes) => fetchApi('/api/jobs/apply', {
        method: 'POST',
        body: { email, jobId, notes },
    }),
};

// ========================================
// Education API
// ========================================

export const educationApi = {
    getProgress: (email) => fetchApi(`/api/education/progress/${encodeURIComponent(email)}`),

    markWatched: (email, videoId, topicId) => fetchApi('/api/education/watched', {
        method: 'POST',
        body: { email, videoId, topicId },
    }),

    updateProgress: (email, videoId, topicId, percentage) => fetchApi('/api/education/progress', {
        method: 'POST',
        body: { email, videoId, topicId, percentage },
    }),

    getRecent: (email, limit = 5) =>
        fetchApi(`/api/education/recent/${encodeURIComponent(email)}?limit=${limit}`),
};

// ========================================
// Chat API
// ========================================

export const chatApi = {
    getChannels: () => fetchApi('/api/chat/channels'),

    getMessages: (channelId, limit = 50) =>
        fetchApi(`/api/chat/messages/${channelId}?limit=${limit}`),

    getNewMessages: (channelId, since) =>
        fetchApi(`/api/chat/messages/${channelId}/new?since=${since}`),

    sendMessage: (email, channelId, content, userName, userAvatar) =>
        fetchApi('/api/chat/messages', {
            method: 'POST',
            body: { email, channelId, content, userName, userAvatar },
        }),

    deleteMessage: (id, email) => fetchApi(`/api/chat/messages/${id}`, {
        method: 'DELETE',
        body: { email },
    }),
};

// ========================================
// Posts API
// ========================================

export const postsApi = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchApi(`/api/posts${query ? `?${query}` : ''}`);
    },

    getById: (id) => fetchApi(`/api/posts/${id}`),

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

export default {
    user: userApi,
    progress: progressApi,
    jobs: jobsApi,
    education: educationApi,
    chat: chatApi,
    posts: postsApi,
    settings: settingsApi,
};
