import { create } from 'zustand';
import type { Exercise } from '../domain/types';
import {
  fetchExercisesAPI,
  fetchCategoriesAPI,
  fetchEquipmentAPI,
  fetchMusclesAPI,
} from '../api/wger';

type Named = { id: number; name: string };

type ExercisesState = {
  items: Exercise[];
  nextUrl: string | null;

  loading: boolean;
  error?: string;

  search: string;
  setSearch: (q: string) => void;

  categories: Named[];
  equipment: Named[];
  muscles: Named[];
  taxLoading: boolean;
  taxError?: string;
  loadTaxonomies: () => Promise<void>;

  fetchFirstPage: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
};

export const useExercisesStore = create<ExercisesState>((set, get) => ({
  items: [],
  nextUrl: null,

  loading: false,
  error: undefined,

  search: '',
  setSearch: (q) => set({ search: q }),

  categories: [],
  equipment: [],
  muscles: [],
  taxLoading: false,
  taxError: undefined,
  loadTaxonomies: async () => {
    const { taxLoading, categories, equipment, muscles } = get();
    if (taxLoading || (categories.length && equipment.length && muscles.length))
      return;

    set({ taxLoading: true, taxError: undefined });
    try {
      const [cats, eq, mus] = await Promise.all([
        fetchCategoriesAPI(),
        fetchEquipmentAPI(),
        fetchMusclesAPI(),
      ]);
      set({
        taxLoading: false,
        categories: cats,
        equipment: eq,
        muscles: mus,
      });
    } catch (e: any) {
      set({
        taxLoading: false,
        taxError: e?.message ?? 'Failed to load taxonomies',
      });
    }
  },

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