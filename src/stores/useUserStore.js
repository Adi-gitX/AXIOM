import { create } from 'zustand';

export const useUserStore = create((set) => ({
    user: null,
    loading: false,
    error: null,

    setUser: (userData) => set({ user: userData }),

    fetchProfile: async (email) => {
        if (!email) return;
        set({ loading: true, error: null });
        try {
            const response = await fetch(`http://localhost:3000/api/users/${email}`);
            if (response.ok) {
                const data = await response.json();
                set({ user: data, loading: false });
            } else {
                set({ loading: false });
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            set({ error: error.message, loading: false });
        }
    }
}));
