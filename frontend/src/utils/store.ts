// store.ts
import { create } from 'zustand';

type SidebarState = {
    isOpen: boolean;
    toggle: () => void;
}

export const useSidebar = create<SidebarState>((set) => ({
    isOpen: true,
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))

