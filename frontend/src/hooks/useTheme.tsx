import { create } from 'zustand';
import { useThemeSettings } from './useThemeSettings';

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useTheme = create<ThemeStore>((set) => ({
  isDark: false,
  toggle: () => set((state) => {
    const newIsDark = !state.isDark;
    document.documentElement.classList.toggle('dark', newIsDark);
    return { isDark: newIsDark };
  }),
  setTheme: (isDark) => set(() => {
    document.documentElement.classList.toggle('dark', isDark);
    return { isDark };
  }),
}));

// Initialize theme based on settings
if (typeof window !== 'undefined') {
  const settings = useThemeSettings.getState();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let isDark = false;
  switch (settings.defaultTheme) {
    case 'dark':
      isDark = true;
      break;
    case 'light':
      isDark = false;
      break;
    case 'system':
      isDark = prefersDark;
      break;
  }
  
  useTheme.getState().setTheme(isDark);
  
  // Listen for system theme changes
  if (settings.defaultTheme === 'system') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      useTheme.getState().setTheme(e.matches);
    });
  }
}