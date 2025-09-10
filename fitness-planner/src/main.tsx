import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { hydrateFromStorage, startPersistence } from './storage/bootstrap';

hydrateFromStorage();

function StorageBootstrap() {
  useEffect(() => {
    const stop = startPersistence();
    return () => stop();
  }, []);
  return null;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StorageBootstrap />
    <App />
  </StrictMode>
);