import { Link, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { Dumbbell, Play, PlusCircle, ChevronRight } from 'lucide-react';
import WeeklyStatsPreview from '../components/stats/WeeklyStatsPreviews';
import { usePlannerStore } from '../store/plannerStore';
import { useJournalStore } from '../store/journalStore';
import { ProgressTracker } from '../domain/ProgressTracker';

export default function Dashboard() {
  const navigate = useNavigate();
  const drafts = usePlannerStore((s) => s.sessions);
  const journal = useJournalStore((s) => s.sessions);

  const lastWorkout = journal[0];
  const tracker = useMemo(() => new ProgressTracker(journal), [journal]);

  function quickNewWorkout() {
    navigate(`/planner`);
  }

  return (
    <div className='space-y-10'>
      <section className='bg-gradient-to-b from-indigo-50 to-white'>
        <div className='mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
          <div className='flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <div className='inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-medium text-indigo-700 shadow-sm'>
                <Dumbbell className='h-4 w-4' />
                Fitness made simple
              </div>
              <h1 className='mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
                Plan workouts, explore exercises, track progress.
              </h1>
              <p className='mt-2 max-w-2xl text-sm text-gray-600'>
                Your all-in-one fitness companion — no accounts, no database,
                just instant planning and tracking in your browser.
              </p>
              <div className='mt-4 flex flex-wrap gap-3'>
                <button
                  type='button'
                  onClick={quickNewWorkout}
                  className='inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-500'
                >
                  <PlusCircle className='h-4 w-4' />
                  New Workout
                </button>
                <Link
                  to='/exercises'
                  className='inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50'
                >
                  <Play className='h-4 w-4' />
                  Explore Exercises
                </Link>
              </div>
            </div>

            <div className='w-full max-w-sm rounded-2xl bg-white p-4 shadow'>
              <div className='text-sm text-gray-500'>Snapshot</div>
              <div className='mt-2 grid grid-cols-2 gap-3'>
                <div className='rounded-xl bg-white p-3 text-center shadow-sm'>
                  <div className='text-xs text-gray-500'>Total sessions</div>
                  <div className='mt-1 text-xl font-semibold'>
                    {tracker.totalSessions()}
                  </div>
                </div>
                <div className='rounded-xl bg-white p-3 text-center shadow-sm'>
                  <div className='text-xs text-gray-500'>Total volume</div>
                  <div className='mt-1 text-xl font-semibold'>
                    {tracker.totalVolume()}
                  </div>
                </div>
              </div>
              <Link
                to='/journal'
                className='mt-3 inline-flex items-center justify-center gap-1 text-sm font-medium text-indigo-600 hover:underline'
              >
                View Journal <ChevronRight className='h-4 w-4' />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <WeeklyStatsPreview />
      </section>

      <section className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
          <div className='lg:col-span-7'>
            <div className='rounded-2xl bg-white p-5 shadow'>
              <div className='flex items-center justify-between'>
                <h2 className='text-base font-semibold'>Recent workout</h2>
                <Link
                  to='/journal'
                  className='text-sm font-medium text-indigo-600 hover:underline'
                >
                  See all
                </Link>
              </div>

              {!lastWorkout ? (
                <div className='mt-4 rounded-xl p-8 text-center text-sm text-gray-500 shadow-inner'>
                  No workouts yet — finalize a draft in Planner to see it here.
                </div>
              ) : (
                <div className='mt-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='text-sm text-gray-500'>
                        {new Date(lastWorkout.dateISO).toLocaleString()}
                      </div>
                      <h3 className='text-lg font-semibold'>
                        {lastWorkout.title}
                      </h3>
                    </div>
                    {typeof lastWorkout.durationMin === 'number' && (
                      <div className='rounded-lg border px-3 py-1 text-sm'>
                        {lastWorkout.durationMin} min
                      </div>
                    )}
                  </div>

                  <div className='mt-3 overflow-x-auto'>
                    <table className='min-w-full text-sm'>
                      <thead className='text-left'>
                        <tr className='bg-gray-50'>
                          <th className='px-3 py-2 font-semibold'>Exercise</th>
                          <th className='px-3 py-2 font-semibold'>Sets</th>
                          <th className='px-3 py-2 font-semibold'>Reps</th>
                          <th className='px-3 py-2 font-semibold'>
                            Weight (kg)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {lastWorkout.items.slice(0, 6).map((it, i) => (
                          <tr key={i} className='odd:bg-white even:bg-gray-50'>
                            <td className='px-3 py-2'>{it.name}</td>
                            <td className='px-3 py-2'>{it.sets}</td>
                            <td className='px-3 py-2'>{it.reps}</td>
                            <td className='px-3 py-2'>{it.weight ?? 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {lastWorkout.items.length > 6 && (
                      <div className='mt-2 text-xs text-gray-500'>
                        + {lastWorkout.items.length - 6} more…
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='lg:col-span-5'>
            <div className='rounded-2xl bg-white p-5 shadow'>
              <h2 className='text-base font-semibold'>Quick actions</h2>
              <div className='mt-3 flex flex-wrap gap-3'>
                <button
                  type='button'
                  onClick={quickNewWorkout}
                  className='inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-500'
                >
                  <PlusCircle className='h-4 w-4' />
                  New Workout
                </button>
                <Link
                  to='/planner'
                  className='inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50'
                >
                  <Play className='h-4 w-4' />
                  Go to Planner
                </Link>
              </div>

              <h3 className='mt-6 text-sm font-semibold text-gray-700'>
                Recent drafts
              </h3>
              <div className='mt-2 space-y-2'>
                {drafts.length === 0 ? (
                  <div className='rounded-xl p-6 text-center text-sm text-gray-500 shadow-inner'>
                    No drafts yet.
                  </div>
                ) : (
                  drafts.slice(0, 4).map((d) => (
                    <Link
                      key={d.id}
                      to='/planner'
                      className='flex items-center justify-between rounded-xl px-3 py-2 text-sm shadow-sm transition hover:shadow'
                    >
                      <span className='font-medium'>{d.title}</span>
                      <span className='text-xs text-gray-500'>
                        {new Date(d.dateISO).toLocaleDateString()}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}