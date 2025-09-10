import { Link } from 'react-router-dom';
import { Dumbbell, Twitter, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className='border-t border-gray-200/60 bg-white dark:border-gray-800/60 dark:bg-gray-950'>
      <div className='mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          <div>
            <div className='flex items-center gap-2'>
              <Dumbbell className='h-5 w-5 text-indigo-600 dark:text-indigo-400' />
              <span className='text-base font-semibold text-gray-900 dark:text-gray-100'>
                FitTrack
              </span>
            </div>
            <p className='mt-3 text-sm text-gray-600 dark:text-gray-400'>
              Plan workouts, explore exercises, and track progress — all in one
              place.
            </p>
          </div>

          <div>
            <h3 className='text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-100'>
              Navigate
            </h3>
            <ul className='mt-3 space-y-2 text-sm'>
              <li>
                <Link
                  to='/'
                  className='text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400'
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to='/exercises'
                  className='text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400'
                >
                  Exercises
                </Link>
              </li>
              <li>
                <Link
                  to='/planner'
                  className='text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400'
                >
                  Planner
                </Link>
              </li>
              <li>
                <Link
                  to='/journal'
                  className='text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400'
                >
                  Journal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-100'>
              Resources
            </h3>
            <ul className='mt-3 space-y-2 text-sm'>
              <li>
                <a
                  href='https://wger.de/en/software/api'
                  target='_blank'
                  rel='noreferrer'
                  className='text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400'
                >
                  Wger API
                </a>
              </li>
              <li>
                <a
                  href='https://tailwindcss.com/docs'
                  target='_blank'
                  rel='noreferrer'
                  className='text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400'
                >
                  Tailwind Docs
                </a>
              </li>
              <li>
                <a
                  href='https://reactrouter.com/'
                  target='_blank'
                  rel='noreferrer'
                  className='text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400'
                >
                  React Router
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-100'>
              Stay in touch
            </h3>
            <div className='mt-3 flex gap-3'>
              <a
                href='#'
                aria-label='Twitter'
                className='rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-indigo-400'
              >
                <Twitter className='h-5 w-5' />
              </a>
              <a
                href='#'
                aria-label='GitHub'
                className='rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-indigo-400'
              >
                <Github className='h-5 w-5' />
              </a>
            </div>
          </div>
        </div>

        <div className='mt-8 border-t border-gray-200/60 pt-6 text-sm text-gray-600 dark:border-gray-800/60 dark:text-gray-400'>
          © {new Date().getFullYear()} FitTrack. All rights reserved.
        </div>
      </div>
    </footer>
  );
}