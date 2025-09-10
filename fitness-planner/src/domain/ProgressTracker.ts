import { type WorkoutSession } from './types';

export class ProgressTracker {
  private readonly sessions: WorkoutSession[];

  constructor(sessions: WorkoutSession[] = []) {
    this.sessions = sessions;
  }

  totalSessions(): number {
    return this.sessions.length;
  }

  totalVolume(): number {
    return this.sessions.reduce((sum, s) => {
      const sessionVolume = s.items.reduce((acc, it) => {
        const w = it.weight ?? 0;
        return acc + w * it.reps * it.sets;
      }, 0);
      return sum + sessionVolume;
    }, 0);
  }

  bestForExercise(exerciseName: string): number {
    const target = exerciseName.trim().toLowerCase();
    let best = 0;
    for (const s of this.sessions) {
      for (const it of s.items) {
        if (it.name.trim().toLowerCase() === target) {
          best = Math.max(best, it.weight ?? 0);
        }
      }
    }
    return best;
  }

  weeklyCount(weekStartISO: string, weekEndISO: string): number {
    const start = new Date(weekStartISO).getTime();
    const end = new Date(weekEndISO).getTime();
    if (Number.isNaN(start) || Number.isNaN(end)) return 0;

    return this.sessions.filter((s) => {
      const t = new Date(s.dateISO).getTime();
      return t >= start && t <= end;
    }).length;
  }
}
