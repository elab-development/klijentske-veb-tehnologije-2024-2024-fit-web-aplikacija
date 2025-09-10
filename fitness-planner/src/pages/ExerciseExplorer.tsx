import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Plus, Loader2 } from 'lucide-react';
import ExerciseCard from '../components/exercises/ExerciseCard';
import { useExercisesStore } from '../store/exercisesStore';
import { usePlannerStore } from '../store/plannerStore';
import type { Exercise, WorkoutExercise } from '../domain/types';

// tiny debounce hook to avoid hammering API while typing
function useDebounced<T>(value: T, ms = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

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
  } = useExercisesStore();

  const createSession = usePlannerStore((s) => s.createSession);
  const addExercise = usePlannerStore((s) => s.addExercise);

  const [lastSessionId, setLastSessionId] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState(search ?? '');
  const debouncedSearch = useDebounced(localSearch, 400);

  // fetch on mount and when debounced search changes
  useEffect(() => {
    setSearch(debouncedSearch);
    fetchFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

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

  const headerHint = useMemo(
    () =>
      items.length
        ? `Showing ${items.length}${nextUrl ? '+' : ''} results`
        : debouncedSearch
        ? 'No results yet — try a broader search'
        : 'Type to search exercises (e.g., bench, squat, pull)',
    [items.length, debouncedSearch, nextUrl]
  );

  return (
    <div className='max-w-7xl mx-auto px-6 xl:px-0 space-y-6'>
      <section className='sticky top-[4rem] z-10 -mx-4 border-b bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/70 sm:-mx-6 lg:-mx-8'>
        <div className='mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
            <div className='relative flex-1'>
              <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
              <input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder='Search exercises…'
                className='w-full rounded-xl border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-800 dark:bg-gray-900'
              />
            </div>

            <button
              type='button'
              className='inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100'
              disabled
              title='More filters coming soon'
            >
              <Filter className='h-4 w-4' />
              Filters
            </button>

            <button
              onClick={fetchFirstPage}
              disabled={loading}
              className='inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60'
            >
              {loading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Search className='h-4 w-4' />
              )}
              Search
            </button>
          </div>

          <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
            {headerHint}
          </p>
        </div>
      </section>

      {error && (
        <div className='rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950'>
          {error}
        </div>
      )}

      <section aria-live='polite'>
        {loading && items.length === 0 ? (
          <SkeletonGrid />
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
            {items.map((ex) => (
              <ExerciseCard key={ex.id} exercise={ex} onAdd={handleAdd} />
            ))}
          </div>
        )}
      </section>

      {items.length > 0 && (
        <div className='flex items-center justify-center'>
          {nextUrl ? (
            <button
              onClick={fetchNextPage}
              disabled={loading}
              className='inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100'
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
  );
}

function SkeletonGrid() {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className='animate-pulse rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900'
        >
          <div className='h-5 w-3/5 rounded bg-gray-200 dark:bg-gray-800' />
          <div className='mt-3 flex gap-2'>
            <div className='h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-800' />
            <div className='h-5 w-24 rounded-full bg-gray-200 dark:bg-gray-800' />
          </div>
          <div className='mt-6 h-9 w-full rounded-xl bg-gray-200 dark:bg-gray-800' />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className='flex flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center dark:border-gray-800'>
      <p className='text-sm text-gray-600 dark:text-gray-400'>
        No exercises found. Try a different keyword (e.g.,{' '}
        <span className='font-medium'>press</span>,{' '}
        <span className='font-medium'>row</span>,{' '}
        <span className='font-medium'>curl</span>).
      </p>
    </div>
  );
}