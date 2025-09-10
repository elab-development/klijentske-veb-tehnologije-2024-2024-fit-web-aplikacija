import { AppStorage, type AppSnapshot } from './AppStorage';
import { usePlannerStore } from '../store/plannerStore';
import { useJournalStore } from '../store/journalStore';

export const storage = new AppStorage('fitness-planner:v1');

export function hydrateFromStorage() {
  const snap = storage.load();
  if (!snap) return;
  if (snap.plannerDrafts)
    usePlannerStore.setState({ sessions: snap.plannerDrafts });
  if (snap.journalSessions)
    useJournalStore.setState({ sessions: snap.journalSessions });
}

export function startPersistence() {
  let ticking = false;

  const save = () => {
    if (ticking) return;
    ticking = true;
    setTimeout(() => {
      ticking = false;
      const snapshot: Omit<AppSnapshot, 'version'> = {
        plannerDrafts: usePlannerStore.getState().sessions,
        journalSessions: useJournalStore.getState().sessions,
        profile: undefined,
      };
      storage.save(snapshot);
    }, 250);
  };

  const unsubA = usePlannerStore.subscribe(save);
  const unsubB = useJournalStore.subscribe(save);

  save();

  return () => {
    unsubA();
    unsubB();
  };
}