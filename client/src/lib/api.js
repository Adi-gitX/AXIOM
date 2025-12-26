
// Fail-safe API Configuration
// This ensures the app works even if VITE_API_URL is forgotten in Vercel

const PROD_BACKEND_URL = 'https://axiom-server-three.vercel.app';

export const getApiUrl = () => {
    // 1. If explicitly set in Env (Best Practice), use it
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // 2. If in Production and no Env var, fallback to known backend
    if (import.meta.env.PROD) {
        console.warn('VITE_API_URL not set. Falling back to default backend:', PROD_BACKEND_URL);
        return PROD_BACKEND_URL;
    }

    // 3. In Dev, return empty string to use Vite Proxy
    return '';
};
