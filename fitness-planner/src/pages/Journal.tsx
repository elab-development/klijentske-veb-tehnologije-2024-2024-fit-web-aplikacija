import { useMemo } from 'react';
import { useJournalStore } from '../store/journalStore';
import { ProgressTracker } from '../domain/ProgressTracker';

export default function Journal() {
  const sessions = useJournalStore((s) => s.sessions);

  const stats = useMemo(() => {
    const t = new ProgressTracker(sessions);
    return { totalSessions: t.totalSessions(), totalVolume: t.totalVolume() };
  }, [sessions]);

  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='rounded-xl border p-4'>
          <div className='text-sm text-gray-500'>Total sessions</div>
          <div className='text-2xl font-semibold'>{stats.totalSessions}</div>
        </div>
        <div className='rounded-xl border p-4'>
          <div className='text-sm text-gray-500'>Total volume (kg·reps)</div>
          <div className='text-2xl font-semibold'>{stats.totalVolume}</div>
        </div>
      </div>

      <div className='space-y-3'>
        {sessions.length === 0 ? (
          <div className='rounded-xl border border-dashed p-10 text-center text-sm text-gray-500 dark:border-gray-800'>
            No completed workouts yet. Finalize a draft in Planner to see it
            here.
          </div>
        ) : (
          sessions.map((s) => (
            <div
              key={s.id}
              className='rounded-xl border p-4 dark:border-gray-800'
            >
              <div className='flex items-center justify-between'>
                <h3 className='text-base font-semibold'>{s.title}</h3>
                <span className='text-xs text-gray-500'>
                  {new Date(s.dateISO).toLocaleString()}
                </span>
              </div>
              {s.durationMin && (
                <div className='mt-1 text-xs text-gray-500'>
                  Duration: {s.durationMin} min
                </div>
              )}
              {s.notes && (
                <p className='mt-2 text-sm text-gray-700 dark:text-gray-300'>
                  {s.notes}
                </p>
              )}

              <div className='mt-3 overflow-x-auto'>
                <table className='min-w-full text-sm'>
                  <thead className='bg-gray-50 text-left dark:bg-gray-900/60'>
                    <tr>
                      <th className='px-3 py-2 font-semibold'>Exercise</th>
                      <th className='px-3 py-2 font-semibold'>Sets</th>
                      <th className='px-3 py-2 font-semibold'>Reps</th>
                      <th className='px-3 py-2 font-semibold'>Weight (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.items.map((it, i) => (
                      <tr key={i} className='border-t dark:border-gray-800'>
                        <td className='px-3 py-2'>{it.name}</td>
                        <td className='px-3 py-2'>{it.sets}</td>
                        <td className='px-3 py-2'>{it.reps}</td>
                        <td className='px-3 py-2'>{it.weight ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}