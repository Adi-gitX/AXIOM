import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { progressApi } from '../lib/api';

// Email holder for API calls - will be set by components
let userEmail = null;

export const setUserEmail = (email) => {
  userEmail = email;
};

const useStore = create(
  persist(
    (set, get) => ({
      // --- DSA Tracker State ---
      solvedProblems: [],

      toggleProblem: async (problemId, topicId) => {
        const currentSolved = get().solvedProblems;
        const isSolved = currentSolved.includes(problemId);

        // Optimistic update
        set({
          solvedProblems: isSolved
            ? currentSolved.filter((id) => id !== problemId)
            : [...currentSolved, problemId],
        });

        // Sync with backend if user is logged in
        if (userEmail) {
          try {
            await progressApi.toggleProblem(userEmail, problemId, topicId);
          } catch (err) {
            console.error('Failed to sync problem with backend:', err);
            // Revert on failure
            set({ solvedProblems: currentSolved });
          }
        }
      },

      // Load solved problems from backend
      loadSolvedProblems: async (email) => {
        try {
          const data = await progressApi.getProgress(email);
          set({ solvedProblems: Array.isArray(data.solvedProblems) ? data.solvedProblems : [] });
        } catch (err) {
          console.error('Failed to load solved problems:', err);
        }
      },
    }),
    {
      name: 'axiom-storage',
      partialize: (state) => ({
        solvedProblems: state.solvedProblems,
      }),
    }
  )
);

export default useStore;
