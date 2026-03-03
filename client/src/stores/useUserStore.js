import { create } from 'zustand';
import { userApi } from '../lib/api';

const PROFILE_CACHE_TTL_MS = 30 * 1000;
const inFlightProfilePromiseByEmail = new Map();

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    error: null,
    profileFetchedAtByEmail: {},

    setUser: (userData) => set({ user: userData }),
    clearUser: () => set({
        user: null,
        error: null,
        loading: false,
        profileFetchedAtByEmail: {},
    }),

    fetchProfile: async (email, options = {}) => {
        const normalizedEmail = normalizeEmail(email);
        if (!normalizedEmail) {
            set({ user: null, loading: false, error: null });
            return null;
        }

        const force = options?.force === true;
        const state = get();
        const lastFetchedAt = Number(state.profileFetchedAtByEmail?.[normalizedEmail] || 0);
        const cachedUserEmail = normalizeEmail(state.user?.email);
        const isCacheFresh = !force && (Date.now() - lastFetchedAt) < PROFILE_CACHE_TTL_MS;

        if (isCacheFresh && cachedUserEmail === normalizedEmail && state.user) {
            return state.user;
        }

        if (inFlightProfilePromiseByEmail.has(normalizedEmail)) {
            return inFlightProfilePromiseByEmail.get(normalizedEmail);
        }

        set({ loading: true, error: null });

        const promise = (async () => {
            try {
                const data = await userApi.getProfile(normalizedEmail);
                if (data) {
                    set((prev) => ({
                        user: data,
                        loading: false,
                        error: null,
                        profileFetchedAtByEmail: {
                            ...(prev.profileFetchedAtByEmail || {}),
                            [normalizedEmail]: Date.now(),
                        },
                    }));
                    return data;
                }
                set({ loading: false, error: null });
                return null;
            } catch (error) {
                if (error?.status === 401 || error?.status === 403 || error?.status === 404) {
                    set({ user: null, error: null, loading: false });
                    return null;
                }

                if (error?.status === 429 || error?.code === 'BACKEND_UNAVAILABLE' || error?.status === 503) {
                    const latestState = get();
                    const staleUser = latestState.user;
                    if (normalizeEmail(staleUser?.email) === normalizedEmail && staleUser) {
                        set({ loading: false, error: null });
                        return staleUser;
                    }
                    set({ loading: false, error: null });
                    return null;
                }

                console.error('Failed to fetch profile:', error);
                set({ error: error.message, loading: false });
                return null;
            } finally {
                inFlightProfilePromiseByEmail.delete(normalizedEmail);
            }
        })();

        inFlightProfilePromiseByEmail.set(normalizedEmail, promise);
        return promise;
    }
}));
