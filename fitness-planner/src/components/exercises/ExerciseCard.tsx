import { Plus } from 'lucide-react';
import type { Exercise } from '../../domain/types';

type Props = { exercise: Exercise; onAdd?: (exercise: Exercise) => void };

export default function ExerciseCard({ exercise, onAdd }: Props) {
  return (
    <div className='flex min-h-[180px] flex-col justify-between rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md'>
      <div>
        <h3 className='line-clamp-2 text-base font-semibold text-gray-900'>
          {exercise.name || 'Unnamed exercise'}
        </h3>
        <div className='mt-2 flex flex-wrap gap-2 text-xs text-gray-500 '>
          {exercise.category && (
            <span className='rounded-full bg-gray-100 px-2 py-1'>
              Cat: {exercise.category}
            </span>
          )}
          {exercise.muscles.length > 0 && (
            <span className='rounded-full bg-gray-100 px-2 py-1'>
              Muscles: {exercise.muscles.slice(0, 2).join(', ')}
              {exercise.muscles.length > 2 ? '…' : ''}
            </span>
          )}
          {exercise.equipment && exercise.equipment.length > 0 && (
            <span className='rounded-full bg-gray-100 px-2 py-1'>
              Equip: {exercise.equipment.slice(0, 2).join(', ')}
              {exercise.equipment.length > 2 ? '…' : ''}
            </span>
          )}
        </div>
      </div>

      <div className='mt-4'>
        <button
          onClick={() => onAdd?.(exercise)}
          className='inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50'
        >
          <Plus className='h-4 w-4' />
          Add to Planner
        </button>
      </div>
    </div>
  );
}
