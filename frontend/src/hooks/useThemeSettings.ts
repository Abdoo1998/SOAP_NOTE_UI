import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useTheme } from './useTheme';

interface ThemeSettings {
  defaultTheme: 'light' | 'dark' | 'system';
  language: 'en' | 'ar';
  autoSaveInterval: number;
  setDefaultTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (lang: 'en' | 'ar') => void;
  setAutoSaveInterval: (interval: number) => void;
}

export const useThemeSettings = create<ThemeSettings>()(
  persist(
    (set) => ({
      defaultTheme: 'system',
      language: 'en',
      autoSaveInterval: 5,
      setDefaultTheme: (theme) => {
        set({ defaultTheme: theme });
      },
      setLanguage: (lang) => set({ language: lang }),
      setAutoSaveInterval: (interval) => set({ autoSaveInterval: interval }),
    }),
    {
      name: 'theme-settings',
    }
  )
);