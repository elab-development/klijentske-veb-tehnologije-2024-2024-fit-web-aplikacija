import { useMemo } from 'react';
import { useJournalStore } from '../store/journalStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

import WeeklyStatsPreviews from '../components/stats/WeeklyStatsPreviews';

export default function Insights() {
  const sessions = useJournalStore((s) => s.sessions);

  const volumePerSession = useMemo(() => {
    const arr = sessions
      .map((s) => {
        const volume = s.items.reduce(
          (acc, it) => acc + (it.weight ?? 0) * it.reps * it.sets,
          0
        );
        const d = new Date(s.dateISO);
        const label = d.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        });
        return { id: s.id, date: label, volume, t: d.getTime() };
      })
      .sort((a, b) => a.t - b.t);
    return arr.slice(-10);
  }, [sessions]);

  const byWeekday = useMemo(() => {
    const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = new Array(7).fill(0);
    sessions.forEach((s) => {
      const d = new Date(s.dateISO);
      counts[d.getDay()]++;
    });
    return names.map((name, i) => ({ day: name, sessions: counts[i] }));
  }, [sessions]);

  return (
    <div className='mx-auto my-4 max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8'>
      <WeeklyStatsPreviews />

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
        <div className='rounded-2xl bg-white p-5 shadow lg:col-span-7'>
          <h2 className='text-base font-semibold'>Recent volume trend</h2>
          {volumePerSession.length === 0 ? (
            <div className='mt-4 rounded-xl p-8 text-center text-sm text-gray-500 shadow-inner'>
              No data yet — finalize a workout to see the chart.
            </div>
          ) : (
            <div className='mt-4 h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={volumePerSession}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type='monotone'
                    dataKey='volume'
                    stroke='#4f46e5'
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className='rounded-2xl bg-white p-5 shadow lg:col-span-5'>
          <h2 className='text-base font-semibold'>Workouts by weekday</h2>
          {sessions.length === 0 ? (
            <div className='mt-4 rounded-xl p-8 text-center text-sm text-gray-500 shadow-inner'>
              No data yet — finalize a workout to see the chart.
            </div>
          ) : (
            <div className='mt-4 h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={byWeekday}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='day' />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey='sessions' fill='#4f46e5' />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}