import type { WorkoutSession, UserProfile } from '../domain/types';

export type AppSnapshot = {
  version: number;
  plannerDrafts: WorkoutSession[];
  journalSessions: WorkoutSession[];
  profile?: UserProfile | null;
};

export class AppStorage {
  private key: string;
  private currentVersion = 1;

  constructor(key = 'fitness-app:v1') {
    this.key = key;
  }

  private hasLS() {
    try {
      return typeof window !== 'undefined' && !!window.localStorage;
    } catch {
      return false;
    }
  }

  load(): AppSnapshot | null {
    if (!this.hasLS()) return null;
    const raw = localStorage.getItem(this.key);
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return null;
      const version = typeof data.version === 'number' ? data.version : 0;
      const plannerDrafts = Array.isArray(data.plannerDrafts)
        ? data.plannerDrafts
        : [];
      const journalSessions = Array.isArray(data.journalSessions)
        ? data.journalSessions
        : [];
      const profile = data.profile ?? null;
      return { version, plannerDrafts, journalSessions, profile };
    } catch {
      return null;
    }
  }

  save(snap: Omit<AppSnapshot, 'version'>): void {
    if (!this.hasLS()) return;
    const payload: AppSnapshot = { version: this.currentVersion, ...snap };
    try {
      localStorage.setItem(this.key, JSON.stringify(payload));
    } catch {}
  }

  export(): string {
    const data = this.load() ?? {
      version: this.currentVersion,
      plannerDrafts: [],
      journalSessions: [],
      profile: null,
    };
    return JSON.stringify(data, null, 2);
  }

  import(json: string): AppSnapshot | null {
    try {
      const parsed = JSON.parse(json);
      if (!parsed || typeof parsed !== 'object') return null;
      const version =
        typeof parsed.version === 'number'
          ? parsed.version
          : this.currentVersion;
      const plannerDrafts = Array.isArray(parsed.plannerDrafts)
        ? parsed.plannerDrafts
        : [];
      const journalSessions = Array.isArray(parsed.journalSessions)
        ? parsed.journalSessions
        : [];
      const profile = parsed.profile ?? null;
      const snap: AppSnapshot = {
        version,
        plannerDrafts,
        journalSessions,
        profile,
      };
      this.save({ plannerDrafts, journalSessions, profile });
      return snap;
    } catch {
      return null;
    }
  }

  clear(): void {
    if (!this.hasLS()) return;
    localStorage.removeItem(this.key);
  }
}