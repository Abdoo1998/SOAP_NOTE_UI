import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
      toggle: () => set((state) => {
        const newIsDark = !state.isDark;
        document.documentElement.classList.toggle('dark', newIsDark);
        return { isDark: newIsDark };
      }),
      setTheme: (isDark) => set(() => {
        document.documentElement.classList.toggle('dark', isDark);
        return { isDark };
      }),
    }),
    {
      name: 'theme-storage',
    }
  )
);