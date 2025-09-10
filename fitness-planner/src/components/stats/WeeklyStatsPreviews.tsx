import { useMemo } from 'react';
import { CalendarDays, BarChart2, Flame } from 'lucide-react';
import { ProgressTracker } from '../../domain/ProgressTracker';
import { useJournalStore } from '../../store/journalStore';

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

  return { start: monday.toISOString(), end: sunday.toISOString(), monday };
}

export default function WeeklyStatsPreviews() {
  const sessions = useJournalStore((s) => s.sessions);

  const { weekCount, weekVolume, streakDays } = useMemo(() => {
    const { start, end, monday } = getThisWeekRangeISO();
    const tracker = new ProgressTracker(sessions);

    const weekCount = tracker.weeklyCount(start, end);
    const weekVolume = sessions
      .filter((s) => {
        const t = new Date(s.dateISO).getTime();
        return t >= new Date(start).getTime() && t <= new Date(end).getTime();
      })
      .reduce((sum, s) => {
        const v = s.items.reduce(
          (acc, it) => acc + (it.weight ?? 0) * it.reps * it.sets,
          0
        );
        return sum + v;
      }, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const trainedDays = new Set<number>();
    sessions.forEach((s) => {
      const d = new Date(s.dateISO);
      d.setHours(0, 0, 0, 0);
      if (d >= monday && d <= today) trainedDays.add(d.getTime());
    });
    let streak = 0;
    const cursor = new Date(today);
    while (cursor >= monday) {
      const key = new Date(cursor);
      key.setHours(0, 0, 0, 0);
      if (trainedDays.has(key.getTime())) streak++;
      else break;
      cursor.setDate(cursor.getDate() - 1);
    }

    return { weekCount, weekVolume, streakDays: streak };
  }, [sessions]);

  const cards = [
    {
      icon: <CalendarDays className='h-5 w-5 text-indigo-600' />,
      label: 'Sessions this week',
      value: weekCount,
    },
    {
      icon: <BarChart2 className='h-5 w-5 text-indigo-600' />,
      label: 'Weekly volume (kg·reps)',
      value: weekVolume,
    },
    {
      icon: <Flame className='h-5 w-5 text-indigo-600' />,
      label: 'Current streak (days)',
      value: streakDays,
    },
  ];

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
      {cards.map((c, i) => (
        <div key={i} className='rounded-xl bg-white p-4 shadow'>
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            {c.icon}
            <span>{c.label}</span>
          </div>
          <div className='mt-2 text-2xl font-semibold'>{c.value}</div>
        </div>
      ))}
    </div>
  );
}