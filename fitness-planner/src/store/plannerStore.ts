import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { WorkoutExercise, WorkoutSession } from '../domain/types';

type PlannerState = {
  sessions: WorkoutSession[];
  createSession: (title: string) => string;
  addExercise: (sessionId: string, item: WorkoutExercise) => void;
  finalizeSession: (
    sessionId: string,
    notes?: string,
    durationMin?: number
  ) => void;
};

export const usePlannerStore = create<PlannerState>((set) => ({
  sessions: [],
  createSession: (title) => {
    const id = nanoid();
    const newS: WorkoutSession = {
      id,
      title,
      dateISO: new Date().toISOString(),
      items: [],
    };
    set((s) => ({ sessions: [newS, ...s.sessions] }));
    return id;
  },
  addExercise: (sessionId, item) => {
    set((s) => ({
      sessions: s.sessions.map((sess) =>
        sess.id === sessionId ? { ...sess, items: [...sess.items, item] } : sess
      ),
    }));
  },
  finalizeSession: (sessionId, notes, durationMin) => {
    set((s) => ({
      sessions: s.sessions.map((sess) =>
        sess.id === sessionId ? { ...sess, notes, durationMin } : sess
      ),
    }));
  },
}));