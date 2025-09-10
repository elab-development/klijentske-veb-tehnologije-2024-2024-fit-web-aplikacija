import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  FilePlus2,
  NotebookPen,
  Trash2,
} from 'lucide-react';
import WorkoutEditor from '../components/planner/WorkoutEditor';
import { usePlannerStore } from '../store/plannerStore';
import { useJournalStore } from '../store/journalStore';
import type { WorkoutExercise } from '../domain/types';

export default function Planner() {
  const {
    sessions,
    createSession,
    removeSession,
    renameSession,
    setNotes,
    setDuration,
    addExercise,
    updateExercise,
    removeExercise,
  } = usePlannerStore();

  const addCompleted = useJournalStore((s) => s.addCompleted);

  useEffect(() => {
    if (sessions.length === 0) {
      createSession('New Workout');
    }
  }, []);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => {
    if (!selectedId && sessions[0]?.id) setSelectedId(sessions[0].id);
  }, [sessions, selectedId]);

  const selected = sessions.find((s) => s.id === selectedId);

  function finalizeToJournal() {
    if (!selected) return;
    if (selected.items.length === 0) {
      alert('Add at least one exercise row before finalizing.');
      return;
    }
    addCompleted(selected);
    removeSession(selected.id);
    const next = sessions.find((s) => s.id !== selected.id);
    setSelectedId(next?.id ?? null);
  }

  function addManualRow() {
    if (!selected) return;
    const item: WorkoutExercise = {
      exerciseId: Date.now(),
      name: 'New Exercise',
      sets: 3,
      reps: 10,
      weight: 0,
    };
    addExercise(selected.id, item);
  }

  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8  my-10'>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
        <aside className='lg:col-span-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-base font-semibold'>Draft Workouts</h2>
            <button
              type='button'
              onClick={() => {
                const id = createSession('New Workout');
                setSelectedId(id);
              }}
              className='inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-500'
            >
              <FilePlus2 className='h-4 w-4' />
              New
            </button>
          </div>

          <div className='mt-3 space-y-2'>
            {sessions.length === 0 ? (
              <div className='rounded-xl p-6 text-sm text-gray-500 shadow'>
                No drafts yet.
              </div>
            ) : (
              sessions.map((s) => (
                <button
                  type='button'
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={`w-full rounded-xl px-3 py-2 text-left shadow-sm transition hover:shadow ${
                    selectedId === s.id ? 'bg-indigo-50' : 'bg-white'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>{s.title}</span>
                    <span className='text-xs text-gray-500'>
                      {new Date(s.dateISO).toLocaleDateString()}
                    </span>
                  </div>
                  <div className='mt-1 text-xs text-gray-500'>
                    {s.items.length} rows
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <section className='lg:col-span-8'>
          {!selected ? (
            <div className='rounded-xl p-10 text-center text-sm text-gray-500 shadow'>
              Select a draft to edit.
            </div>
          ) : (
            <div className='space-y-6'>
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <input
                  value={selected.title}
                  onChange={(e) => renameSession(selected.id, e.target.value)}
                  className='w-full rounded-xl bg-white px-3 py-2 text-base font-semibold outline-none shadow focus:ring-2 focus:ring-indigo-500/20'
                />
                <div className='flex items-center gap-2'>
                  <div className='flex items-center gap-2 rounded-xl px-3 py-2 text-sm shadow'>
                    <Clock className='h-4 w-4 text-gray-500' />
                    <input
                      type='number'
                      min={0}
                      placeholder='Duration (min)'
                      value={selected.durationMin ?? ''}
                      onChange={(e) =>
                        setDuration(
                          selected.id,
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className='w-28 bg-transparent outline-none'
                    />
                  </div>
                  <button
                    type='button'
                    onClick={finalizeToJournal}
                    className='inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-500'
                    title='Finalize and move to Journal'
                  >
                    <CheckCircle2 className='h-4 w-4' />
                    Finalize
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      if (confirm('Delete this draft?')) {
                        removeSession(selected.id);
                        const next = sessions.find((s) => s.id !== selected.id);
                        setSelectedId(next?.id ?? null);
                      }
                    }}
                    className='inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm text-red-600 transition hover:bg-red-50'
                    title='Delete draft'
                  >
                    <Trash2 className='h-4 w-4' />
                    Delete
                  </button>
                </div>
              </div>

              <div className='rounded-xl p-3 shadow'>
                <div className='flex items-center gap-2 text-sm font-medium'>
                  <NotebookPen className='h-4 w-4 text-gray-500' />
                  Notes
                </div>
                <textarea
                  rows={3}
                  value={selected.notes ?? ''}
                  onChange={(e) => setNotes(selected.id, e.target.value)}
                  className='mt-2 w-full resize-y rounded-lg bg-white p-2 text-sm outline-none shadow focus:ring-2 focus:ring-indigo-500/20'
                  placeholder='Optional notes...'
                />
              </div>

              <WorkoutEditor
                items={selected.items}
                onAdd={addManualRow}
                onUpdate={(idx, patch) =>
                  updateExercise(selected.id, idx, patch)
                }
                onRemove={(idx) => removeExercise(selected.id, idx)}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}