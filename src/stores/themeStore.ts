import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  hydrate: () => void;
}

const STORAGE_KEY = 'app_theme';

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',

  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.classList.toggle('dark', next === 'dark');
    }
    set({ theme: next });
  },

  hydrate: () => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const theme = stored ?? 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  },
}));
