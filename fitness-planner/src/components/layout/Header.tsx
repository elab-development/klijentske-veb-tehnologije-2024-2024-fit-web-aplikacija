import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Dumbbell } from 'lucide-react';

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Dumbbell } from 'lucide-react';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    let mounted = true;
    const belgradeLoc = { lat: 44.7872, lon: 20.4573 };
    const fetchTemp = async (lat: number, lon: number) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        if (!res.ok) return;
        const data = await res.json();
        const t = data?.current_weather?.temperature;
        if (mounted && typeof t === 'number') setTemp(Math.round(t));
      } catch {}
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchTemp(pos.coords.latitude, pos.coords.longitude),
        () => fetchTemp(belgradeLoc.lat, belgradeLoc.lon),
        { maximumAge: 600000, timeout: 5000 }
      );
    } else {
      fetchTemp(belgradeLoc.lat, belgradeLoc.lon);
    }
    return () => {
      mounted = false;
    };
  }, []);

  const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/exercises', label: 'Exercises' },
    { to: '/planner', label: 'Planner' },
    { to: '/journal', label: 'Journal' },
    { to: '/insights', label: 'Insights' },
  ];

  return (
    <header className='sticky top-0 z-40 w-full bg-white/80 backdrop-blur shadow-sm'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        <Link
          to='/'
          className='flex items-center gap-2'
          aria-label='FitTrack Home'
        >
          <Dumbbell className='h-6 w-6 text-indigo-600' />
          <span className='text-lg font-semibold tracking-tight text-gray-900'>
            FitTrack
          </span>
        </Link>

        <nav className='hidden md:flex md:items-center md:gap-6'>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded text-sm font-medium transition-colors hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                  isActive ? 'text-indigo-600' : 'text-gray-700'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className='hidden items-center gap-3 md:flex'>
          <Link
            to='/planner'
            className='inline-flex items-center rounded-xl border border-transparent bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50'
          >
            New Workout
          </Link>
          {temp !== null && (
            <span className='text-sm font-semibold text-gray-700'>
              {temp}°C
            </span>
          )}
        </div>

        <button
          type='button'
          className='inline-flex items-center justify-center rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 md:hidden'
          aria-controls='mobile-menu'
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className='sr-only'>Open main menu</span>
          {open ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
        </button>
      </div>

      <div
        id='mobile-menu'
        className={`overflow-hidden transition-[max-height] duration-300 md:hidden ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <nav className='space-y-1 px-4 pb-4 sm:px-6'>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-100 ${
                  isActive ? 'text-indigo-600' : 'text-gray-700'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className='mt-2 flex items-center justify-between gap-3'>
            <Link
              to='/planner'
              onClick={() => setOpen(false)}
              className='inline-flex flex-1 items-center justify-center rounded-xl border border-transparent bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500'
            >
              New Workout
            </Link>
            {temp !== null && (
              <span className='min-w-[3rem] text-center text-sm font-semibold text-gray-700'>
                {temp}°
              </span>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

  const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/exercises', label: 'Exercises' },
    { to: '/planner', label: 'Planner' },
    { to: '/journal', label: 'Journal' },
  ];

  return (
    <header className='sticky top-0 z-40 w-full border-b border-gray-200/60 bg-white/80 backdrop-blur dark:border-gray-800/60 dark:bg-gray-950/70'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        <Link
          to='/'
          className='flex items-center gap-2'
          aria-label='FitTrack Home'
        >
          <Dumbbell className='h-6 w-6 text-indigo-600 dark:text-indigo-400' />
          <span className='text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100'>
            FitTrack
          </span>
        </Link>

        <nav className='hidden md:flex md:items-center md:gap-6'>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 rounded 
                ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className='hidden md:block'>
          <Link
            to='/planner'
            className='inline-flex items-center rounded-xl border border-transparent bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50'
          >
            New Workout
          </Link>
        </div>

        <button
          type='button'
          className='inline-flex items-center justify-center rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden'
          aria-controls='mobile-menu'
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className='sr-only'>Open main menu</span>
          {open ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
        </button>
      </div>

      <div
        id='mobile-menu'
        className={`md:hidden transition-[max-height] duration-300 overflow-hidden ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <nav className='space-y-1 px-4 pb-4 sm:px-6'>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-gray-800 
                ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to='/planner'
            onClick={() => setOpen(false)}
            className='mt-2 inline-flex w-full items-center justify-center rounded-xl border border-transparent bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500'
          >
            New Workout
          </Link>
        </nav>
      </div>
    </header>
  );
}