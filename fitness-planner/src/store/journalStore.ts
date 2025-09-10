import { create } from 'zustand';
import type { WorkoutSession } from '../domain/types';

type JournalState = {
  sessions: WorkoutSession[];
  addCompleted: (session: WorkoutSession) => void;
  clearAll: () => void;
};

export const useJournalStore = create<JournalState>((set) => ({
  sessions: [],
  addCompleted: (session) =>
    set((s) => ({ sessions: [session, ...s.sessions] })),
  clearAll: () => set({ sessions: [] }),
}));