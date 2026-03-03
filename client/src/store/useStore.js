import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { progressApi } from '../lib/api';

// Email holder for API calls - will be set by components
let userEmail = null;

const sanitizeSolvedProblems = (value) => (
  Array.from(
    new Set((Array.isArray(value) ? value : [])
      .map((item) => String(item || '').trim())
      .filter(Boolean))
  )
);

export const setUserEmail = (email) => {
  userEmail = email;
};

const useStore = create(
  persist(
    (set, get) => ({
      // --- DSA Tracker State ---
      solvedProblems: [],
      dsaMutationVersion: 0,

      toggleProblem: async (problemId, topicId) => {
        const normalizedProblemId = String(problemId || '').trim();
        if (!normalizedProblemId) return;

        const currentSolved = sanitizeSolvedProblems(get().solvedProblems);
        const nextSolvedSet = new Set(currentSolved);
        const isSolved = nextSolvedSet.has(normalizedProblemId);

        // Optimistic update
        if (isSolved) {
          nextSolvedSet.delete(normalizedProblemId);
        } else {
          nextSolvedSet.add(normalizedProblemId);
        }

        set({
          solvedProblems: Array.from(nextSolvedSet),
        });

        const bumpMutationVersion = () => {
          set((state) => ({ dsaMutationVersion: state.dsaMutationVersion + 1 }));
        };

        // Sync with backend if user is logged in
        if (userEmail) {
          try {
            const result = await progressApi.toggleProblem(userEmail, normalizedProblemId, topicId);
            if (result?.problemId && result.problemId !== normalizedProblemId) {
              set((state) => {
                const syncedSet = new Set(sanitizeSolvedProblems(state.solvedProblems));
                syncedSet.delete(normalizedProblemId);
                if (result.solved) {
                  syncedSet.add(result.problemId);
                } else {
                  syncedSet.delete(result.problemId);
                }
                return {
                  solvedProblems: Array.from(syncedSet),
                };
              });
            }
            bumpMutationVersion();
          } catch (err) {
            console.error('Failed to sync problem with backend:', err);
            // Revert on failure
            set({ solvedProblems: currentSolved });
          }
        } else {
          bumpMutationVersion();
        }
      },

      // Load solved problems from backend
      loadSolvedProblems: async (email) => {
        try {
          const data = await progressApi.getProgress(email);
          set({ solvedProblems: sanitizeSolvedProblems(data.solvedProblems) });
          return data;
        } catch (err) {
          console.error('Failed to load solved problems:', err);
          return null;
        }
      },
    }),
    {
      name: 'axiom-storage',
      partialize: (state) => ({
        solvedProblems: sanitizeSolvedProblems(state.solvedProblems),
      }),
    }
  )
);

export default useStore;
