import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      // Set of solved problem IDs
      solvedProblems: [],
      toggleProblem: (id) => set((state) => {
        const isSolved = state.solvedProblems.includes(id);
        return {
          solvedProblems: isSolved 
            ? state.solvedProblems.filter(pid => pid !== id)
            : [...state.solvedProblems, id]
        };
      }),

      // --- Chat State ---
      // Map of channel ID -> Array of messages
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
      name: 'axiom-storage', // unique name
    }
  )
);

export default useStore;
