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
      // --- User Profile ---
      user: {
        name: 'Aditya K.',
        role: 'Full Stack Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adi',
        isPro: true
      },

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
          if (data.solvedProblems && data.solvedProblems.length > 0) {
            set({ solvedProblems: data.solvedProblems });
          }
        } catch (err) {
          console.error('Failed to load solved problems:', err);
        }
      },

      // --- Chat State ---
      channels: {
        'general': [
          { id: 1, user: 'Alex', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', content: 'Anyone working on the new React implementation?', time: '10:30 AM' },
          { id: 2, user: 'Sarah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', content: 'Yes! I just pushed the initial commit.', time: '10:32 AM' },
        ],
        'react': [],
        'jobs': [],
        'help': [],
        'voice': []
      },
      addMessage: (channelId, message) => set((state) => ({
        channels: {
          ...state.channels,
          [channelId]: [...(state.channels[channelId] || []), message]
        }
      })),

      // --- Jobs State ---
      savedJobs: [],
      appliedJobs: [],
      saveJob: (jobId) => set((state) => ({
        savedJobs: state.savedJobs.includes(jobId)
          ? state.savedJobs.filter(id => id !== jobId)
          : [...state.savedJobs, jobId]
      })),
      applyToJob: (jobId) => set((state) => ({
        appliedJobs: [...state.appliedJobs, jobId]
      })),
    }),
    {
      name: 'axiom-storage',
      partialize: (state) => ({
        solvedProblems: state.solvedProblems,
        savedJobs: state.savedJobs,
        appliedJobs: state.appliedJobs,
        channels: state.channels,
      }),
    }
  )
);

export default useStore;
