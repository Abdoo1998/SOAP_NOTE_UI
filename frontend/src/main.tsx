import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import './index.css';
import { useTheme } from './hooks/useTheme';

// Initialize theme
const theme = useTheme.getState();
document.documentElement.classList.toggle('dark', theme.isDark);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);