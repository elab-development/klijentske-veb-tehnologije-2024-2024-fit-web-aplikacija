import type { Exercise } from '../domain/types';

const BASE = 'https://wger.de/api/v2';

type ExerciseInfo = {
  id: number;
  category: { id: number; name: string } | null;
  muscles: { id: number; name: string; name_en: string; is_front: boolean }[];
  muscles_secondary: {
    id: number;
    name: string;
    name_en: string;
    is_front: boolean;
  }[];
  equipment: { id: number; name: string }[];
  translations: {
    id: number;
    language: number;
    name: string;
    description: string;
  }[];
};

type Paged<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export async function fetchExercisesAPI(params?: {
  search?: string;
  nextUrl?: string | null;
}): Promise<{ items: Exercise[]; nextUrl: string | null }> {
  const url = params?.nextUrl ?? `${BASE}/exerciseinfo/?limit=20`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch exercises (${res.status})`);
  const data = (await res.json()) as Paged<ExerciseInfo>;

  let items: Exercise[] = data.results.map((e) => {
    const en = e.translations.find((t) => t.language === 2);
    return {
      id: e.id,
      name: (en?.name ?? '').trim(),
      category: e.category?.name ?? undefined,
      muscles: e.muscles.map((m) => m.name_en || m.name).filter(Boolean),
      equipment: e.equipment.map((eq) => eq.name),
    };
  });

  if (params?.search?.trim()) {
    const q = params.search.trim().toLowerCase();
    items = items.filter((x) => x.name.toLowerCase().includes(q));
  }

  return { items, nextUrl: data.next };
}