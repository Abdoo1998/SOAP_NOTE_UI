import React from 'react';
import { Save, Moon, Sun, Monitor, Globe2, Clock } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useThemeSettings } from '../hooks/useThemeSettings';
import { PageTransition } from '../components/transitions/PageTransition';
import { FadeIn } from '../components/transitions/FadeIn';

export function Settings() {
  const {
    defaultTheme,
    language,
    autoSaveInterval,
    setDefaultTheme,
    setLanguage,
    setAutoSaveInterval,
  } = useThemeSettings();

  const { setTheme } = useTheme();

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setDefaultTheme(theme);
    
    // Update the actual theme
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark);
    } else {
      setTheme(theme === 'dark');
    }
  };

  const handleSave = () => {
    // Settings are automatically saved by zustand-persist
    // This is just for user feedback
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    toast.textContent = 'Settings saved successfully';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Customize how the application looks and feels
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            <FadeIn delay={0.1}>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Default Theme
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'dark', label: 'Dark', icon: Moon },
                    { value: 'system', label: 'System', icon: Monitor },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => handleThemeChange(value as 'light' | 'dark' | 'system')}
                      className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        defaultTheme === value
                          ? 'border-hospital-500 bg-hospital-50 dark:bg-hospital-900/20 text-hospital-700 dark:text-hospital-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-hospital-400'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Default Language
                </label>
                <div className="flex items-center gap-2">
                  <Globe2 className="h-5 w-5 text-gray-400" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
                    className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-hospital-500"
                  >
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Auto-save Interval (minutes)
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={autoSaveInterval}
                    onChange={(e) => setAutoSaveInterval(Number(e.target.value))}
                    className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-hospital-500"
                  />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-hospital-500 text-white rounded-lg hover:bg-hospital-600 transition-colors"
                >
                  <Save size={16} />
                  Save Settings
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}