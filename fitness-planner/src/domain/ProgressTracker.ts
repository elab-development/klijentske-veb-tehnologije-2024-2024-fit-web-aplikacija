import { useMemo } from 'react';
import { usePlannerStore } from '../../store/plannerStore';
import { ProgressTracker } from '../../domain/ProgressTracker';

function getThisWeekRangeISO() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() - diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { start: monday.toISOString(), end: sunday.toISOString() };
}

export default function WeeklyStatsPreview() {
  const sessions = usePlannerStore((s) => s.sessions);

  const { totalSessions, totalVolume, weeklyCount } = useMemo(() => {
    const tracker = new ProgressTracker(sessions);
    const { start, end } = getThisWeekRangeISO();
    return {
      totalSessions: tracker.totalSessions(),
      totalVolume: tracker.totalVolume(),
      weeklyCount: tracker.weeklyCount(start, end),
    };
  }, [sessions]);

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
      <div className='rounded-xl border p-4'>
        <div className='text-sm text-gray-500'>Total Sessions</div>
        <div className='text-2xl font-semibold'>{totalSessions}</div>
      </div>
      <div className='rounded-xl border p-4'>
        <div className='text-sm text-gray-500'>Total Volume (kg·reps)</div>
        <div className='text-2xl font-semibold'>{totalVolume}</div>
      </div>
      <div className='rounded-xl border p-4'>
        <div className='text-sm text-gray-500'>This Week</div>
        <div className='text-2xl font-semibold'>{weeklyCount}</div>
      </div>
    </div>
  );
}