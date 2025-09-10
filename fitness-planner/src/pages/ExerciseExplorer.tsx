import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Plus, Loader2, RotateCcw } from 'lucide-react';
import ExerciseCard from '../components/exercises/ExerciseCard';
import { useExercisesStore } from '../store/exercisesStore';
import { usePlannerStore } from '../store/plannerStore';
import type { Exercise, WorkoutExercise } from '../domain/types';

export default function ExerciseExplorer() {
  const {
    items,
    loading,
    error,
    search,
    setSearch,
    fetchFirstPage,
    fetchNextPage,
    nextUrl,
    categories,
    equipment,
    muscles,
    taxLoading,
    taxError,
    loadTaxonomies,
  } = useExercisesStore();

  const createSession = usePlannerStore((s) => s.createSession);
  const addExercise = usePlannerStore((s) => s.addExercise);

  const [lastSessionId, setLastSessionId] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState(search ?? '');

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [cat, setCat] = useState<string>('');
  const [equip, setEquip] = useState<string>('');
  const [muscleSel, setMuscleSel] = useState<string[]>([]);

  useEffect(() => {
    loadTaxonomies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSearch(localSearch);
    fetchFirstPage();
  }

  function handleAdd(exercise: Exercise) {
    let sessionId = lastSessionId;
    if (!sessionId) {
      sessionId = createSession(
        `Imported – ${new Date().toLocaleDateString()}`
      );
      setLastSessionId(sessionId);
    }
    const item: WorkoutExercise = {
      exerciseId: exercise.id,
      name: exercise.name,
      sets: 3,
      reps: 10,
      weight: 0,
    };
    addExercise(sessionId, item);
  }

  function resetFilters() {
    setCat('');
    setEquip('');
    setMuscleSel([]);
  }

  const visibleItems = useMemo(() => {
    const byCat = (e: Exercise) => (cat ? e.category === cat : true);
    const byEquip = (e: Exercise) =>
      equip ? (e.equipment ?? []).includes(equip) : true;
    const byMuscles = (e: Exercise) =>
      muscleSel.length === 0
        ? true
        : muscleSel.every((m) => (e.muscles ?? []).includes(m));
    return items.filter((e) => byCat(e) && byEquip(e) && byMuscles(e));
  }, [items, cat, equip, muscleSel]);

  const headerHint = useMemo(() => {
    const count = visibleItems.length;
    if (count) return `Showing ${count}${nextUrl ? '+' : ''} results`;
    if (localSearch || cat || equip || muscleSel.length)
      return 'No matches for current search/filters — try adjusting or Load more.';
    return 'Type a keyword and press Search';
  }, [visibleItems.length, nextUrl, localSearch, cat, equip, muscleSel]);

  return (
    <div className='space-y-6'>
      <section className='sticky top-[4rem] z-10 bg-white/80 backdrop-blur shadow-sm'>
        <div className='mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8'>
          <form
            onSubmit={handleSubmit}
            className='flex flex-col gap-3 sm:flex-row sm:items-center'
          >
            <div className='relative flex-1'>
              <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
              <input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder='Search exercises…'
                autoComplete='off'
                className='w-full rounded-xl bg-white py-2 pl-9 pr-3 text-sm outline-none shadow transition placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/20'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-500 disabled:opacity-60'
            >
              {loading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Search className='h-4 w-4' />
              )}
              Search
            </button>

            <button
              type='button'
              onClick={() => setFiltersOpen((v) => !v)}
              className='inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50'
            >
              <Filter className='h-4 w-4' />
              Filters
            </button>
          </form>

          <div
            className={`overflow-hidden transition-[max-height] duration-300 ${
              filtersOpen ? 'max-h-80' : 'max-h-0'
            }`}
            aria-hidden={!filtersOpen}
          >
            <div className='mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3'>
              <div>
                <label className='block text-xs font-medium text-gray-600'>
                  Category
                </label>
                <select
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  className='mt-1 w-full rounded-xl bg-white px-2 py-2 text-sm outline-none shadow focus:ring-2 focus:ring-indigo-500/20'
                >
                  <option value=''>All categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-xs font-medium text-gray-600'>
                  Equipment
                </label>
                <select
                  value={equip}
                  onChange={(e) => setEquip(e.target.value)}
                  className='mt-1 w-full rounded-xl bg-white px-2 py-2 text-sm outline-none shadow focus:ring-2 focus:ring-indigo-500/20'
                >
                  <option value=''>Any equipment</option>
                  {equipment.map((e) => (
                    <option key={e.id} value={e.name}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-xs font-medium text-gray-600'>
                  Muscles (hold Ctrl/Cmd for multiple)
                </label>
                <select
                  multiple
                  value={muscleSel}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions).map(
                      (o) => o.value
                    );
                    setMuscleSel(selected);
                  }}
                  className='mt-1 h-[42px] w-full rounded-xl bg-white px-2 py-2 text-sm outline-none shadow focus:ring-2 focus:ring-indigo-500/20'
                >
                  {muscles.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='mt-3 flex items-center justify-between'>
              <p className='text-xs text-gray-500'>
                {taxLoading
                  ? 'Loading filter lists…'
                  : taxError
                  ? 'Couldn’t load filters. You can still search.'
                  : 'Filters are optional and applied locally.'}
              </p>
              {(cat || equip || muscleSel.length > 0) && (
                <button
                  type='button'
                  onClick={resetFilters}
                  className='inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline'
                  title='Clear filters'
                >
                  <RotateCcw className='h-3.5 w-3.5' />
                  Reset filters
                </button>
              )}
            </div>
          </div>

          <p className='mt-2 text-xs text-gray-500'>{headerHint}</p>
        </div>
      </section>

      <div className='mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8'>
        {error && (
          <div className='rounded-xl bg-red-50 p-3 text-sm text-red-700 shadow'>
            {error}
          </div>
        )}

        <section aria-live='polite'>
          {loading && items.length === 0 ? (
            <SkeletonGrid />
          ) : visibleItems.length === 0 ? (
            <EmptyState
              hasFilters={!!(cat || equip || muscleSel.length)}
              canLoadMore={!!nextUrl}
              onLoadMore={fetchNextPage}
              loading={loading}
            />
          ) : (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
              {visibleItems.map((ex) => (
                <ExerciseCard key={ex.id} exercise={ex} onAdd={handleAdd} />
              ))}
            </div>
          )}
        </section>

        {visibleItems.length > 0 && (
          <div className='flex items-center justify-center'>
            {nextUrl ? (
              <button
                type='button'
                onClick={fetchNextPage}
                disabled={loading}
                className='inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50'
              >
                {loading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Plus className='h-4 w-4' />
                )}
                {loading ? 'Loading…' : 'Load more'}
              </button>
            ) : (
              <p className='text-sm text-gray-500'>You’ve reached the end.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className='mx-auto max-w-7xl'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className='animate-pulse rounded-xl bg-white p-4 shadow'>
            <div className='h-5 w-3/5 rounded bg-gray-200' />
            <div className='mt-3 flex gap-2'>
              <div className='h-5 w-20 rounded-full bg-gray-200' />
              <div className='h-5 w-24 rounded-full bg-gray-200' />
            </div>
            <div className='mt-6 h-9 w-full rounded-xl bg-gray-200' />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  hasFilters,
  canLoadMore,
  onLoadMore,
  loading,
}: {
  hasFilters: boolean;
  canLoadMore: boolean;
  onLoadMore: () => void;
  loading: boolean;
}) {
  return (
    <div className='mx-auto max-w-7xl'>
      <div className='flex flex-col items-center justify-center rounded-xl p-10 text-center shadow'>
        <p className='text-sm text-gray-600'>
          {hasFilters
            ? 'No results for the current filters.'
            : 'No exercises found. Try a different keyword (e.g., press, row, curl).'}
        </p>
        {hasFilters && canLoadMore && (
          <button
            type='button'
            disabled={loading}
            onClick={onLoadMore}
            className='mt-3 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50'
          >
            {loading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Plus className='h-4 w-4' />
            )}
            {loading ? 'Loading…' : 'Load more'}
          </button>
        )}
      </div>
    </div>
  );
}