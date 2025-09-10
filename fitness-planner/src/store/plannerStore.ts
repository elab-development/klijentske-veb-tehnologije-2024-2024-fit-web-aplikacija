import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { WorkoutExercise, WorkoutSession } from '../domain/types';

type PlannerState = {
  sessions: WorkoutSession[];
  createSession: (title: string) => string;
  removeSession: (sessionId: string) => void;

  renameSession: (sessionId: string, title: string) => void;
  setNotes: (sessionId: string, notes: string) => void;
  setDuration: (sessionId: string, durationMin?: number) => void;

  addExercise: (sessionId: string, item: WorkoutExercise) => void;
  updateExercise: (
    sessionId: string,
    idx: number,
    patch: Partial<WorkoutExercise>
  ) => void;
  removeExercise: (sessionId: string, idx: number) => void;

  getSession: (sessionId: string) => WorkoutSession | undefined;
};

export const usePlannerStore = create<PlannerState>((set, get) => ({
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

  removeSession: (sessionId) =>
    set((s) => ({ sessions: s.sessions.filter((x) => x.id !== sessionId) })),

  renameSession: (sessionId, title) =>
    set((s) => ({
      sessions: s.sessions.map((sess) =>
        sess.id === sessionId ? { ...sess, title } : sess
      ),
    })),

  setNotes: (sessionId, notes) =>
    set((s) => ({
      sessions: s.sessions.map((sess) =>
        sess.id === sessionId ? { ...sess, notes } : sess
      ),
    })),

  setDuration: (sessionId, durationMin) =>
    set((s) => ({
      sessions: s.sessions.map((sess) =>
        sess.id === sessionId ? { ...sess, durationMin } : sess
      ),
    })),

  addExercise: (sessionId, item) =>
    set((s) => ({
      sessions: s.sessions.map((sess) =>
        sess.id === sessionId ? { ...sess, items: [...sess.items, item] } : sess
      ),
    })),

  updateExercise: (sessionId, idx, patch) =>
    set((s) => ({
      sessions: s.sessions.map((sess) => {
        if (sess.id !== sessionId) return sess;
        const items = [...sess.items];
        items[idx] = { ...items[idx], ...patch };
        return { ...sess, items };
      }),
    })),

  removeExercise: (sessionId, idx) =>
    set((s) => ({
      sessions: s.sessions.map((sess) => {
        if (sess.id !== sessionId) return sess;
        return { ...sess, items: sess.items.filter((_, i) => i !== idx) };
      }),
    })),

  getSession: (sessionId) => get().sessions.find((s) => s.id === sessionId),
}));