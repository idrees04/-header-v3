import { create } from 'zustand';
import type { SidebarState } from '@/types';

const STORAGE_KEY = 'sidebar_collapsed';

export const useSidebarStore = create<SidebarState>((set) => ({
  collapsed: typeof window !== 'undefined'
    ? localStorage.getItem(STORAGE_KEY) === 'true'
    : false,

  toggleCollapsed: () =>
    set((state) => {
      const next = !state.collapsed;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, String(next));
      }
      return { collapsed: next };
    }),

  setCollapsed: (collapsed: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    }
    set({ collapsed });
  },
}));
