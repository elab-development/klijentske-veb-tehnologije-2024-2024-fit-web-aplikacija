import { type ChangeEvent } from 'react';
import { Trash2, Plus } from 'lucide-react';
import type { WorkoutExercise } from '../../domain/types';

type Props = {
  items: WorkoutExercise[];
  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<WorkoutExercise>) => void;
  onRemove: (index: number) => void;
};

export default function WorkoutEditor({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: Props) {
  const num = (v: string) => (v === '' ? undefined : Number(v));

  return (
    <div className='space-y-3'>
      <div className='flex justify-end'>
        <button
          type='button'
          onClick={onAdd}
          className='inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500'
        >
          <Plus className='h-4 w-4' />
          Add Exercise Row
        </button>
      </div>

      <div className='overflow-x-auto rounded-xl shadow-sm'>
        <table className='min-w-full text-sm'>
          <thead className='bg-gray-50 text-left'>
            <tr>
              <th className='px-3 py-2 font-semibold'>Exercise name</th>
              <th className='px-3 py-2 font-semibold'>Sets</th>
              <th className='px-3 py-2 font-semibold'>Reps</th>
              <th className='px-3 py-2 font-semibold'>Weight (kg)</th>
              <th className='px-3 py-2'></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className='px-3 py-6 text-center text-gray-500'>
                  No rows yet — add exercises from Explore or insert a manual
                  row.
                </td>
              </tr>
            ) : (
              items.map((it, i) => (
                <tr key={i} className='border-t'>
                  <td className='px-3 py-2'>
                    <input
                      value={it.name}
                      onChange={(e) => onUpdate(i, { name: e.target.value })}
                      className='w-full rounded-lg border border-gray-300 bg-white px-2 py-1 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    />
                  </td>
                  <td className='px-3 py-2'>
                    <input
                      type='number'
                      min={0}
                      value={it.sets}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        onUpdate(i, { sets: num(e.target.value) ?? 0 })
                      }
                      className='w-20 rounded-lg border border-gray-300 bg-white px-2 py-1 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    />
                  </td>
                  <td className='px-3 py-2'>
                    <input
                      type='number'
                      min={0}
                      value={it.reps}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        onUpdate(i, { reps: num(e.target.value) ?? 0 })
                      }
                      className='w-20 rounded-lg border border-gray-300 bg-white px-2 py-1 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    />
                  </td>
                  <td className='px-3 py-2'>
                    <input
                      type='number'
                      min={0}
                      step='0.5'
                      value={it.weight ?? 0}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        onUpdate(i, { weight: num(e.target.value) ?? 0 })
                      }
                      className='w-24 rounded-lg border border-gray-300 bg-white px-2 py-1 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    />
                  </td>
                  <td className='px-3 py-2 text-right'>
                    <button
                      type='button'
                      onClick={() => onRemove(i)}
                      className='inline-flex items-center gap-1 rounded-lg px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950'
                      title='Remove row'
                    >
                      <Trash2 className='h-4 w-4' />
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}