// src/store/exercisesStore.ts
import { create } from 'zustand';
import type { Exercise } from '../domain/types';
import { fetchExercisesAPI } from '../api/wger';

type ExercisesState = {
  items: Exercise[];
  loading: boolean;
  error?: string;
  search: string;
  nextUrl: string | null;

  setSearch: (q: string) => void;
  fetchFirstPage: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
};

export const useExercisesStore = create<ExercisesState>((set, get) => ({
  items: [],
  loading: false,
  error: undefined,
  search: '',
  nextUrl: null,

  setSearch: (q) => set({ search: q }),

  fetchFirstPage: async () => {
    const { search } = get();
    set({ loading: true, error: undefined, items: [], nextUrl: null });
    try {
      const { items, nextUrl } = await fetchExercisesAPI({ search });
      set({ items, loading: false, nextUrl });
    } catch (e: any) {
      set({ loading: false, error: e?.message ?? 'Failed to load exercises' });
    }
  },

  fetchNextPage: async () => {
    const { loading, nextUrl, search, items } = get();
    if (loading || !nextUrl) return;
    set({ loading: true, error: undefined });
    try {
      const { items: more, nextUrl: newNext } = await fetchExercisesAPI({
        nextUrl,
        search,
      });

      const seen = new Set(items.map((i) => i.id));
      const merged = [...items];
      for (const m of more) if (!seen.has(m.id)) merged.push(m);

      set({ items: merged, loading: false, nextUrl: newNext });
    } catch (e: any) {
      set({ loading: false, error: e?.message ?? 'Failed to load more' });
    }
  },
}));