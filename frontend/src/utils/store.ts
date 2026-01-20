// store.ts
import { fetchFamilyMembers } from '@/lib/functions';
import { create } from 'zustand';

type SidebarState = {
    isOpen: boolean;
    toggle: () => void;
}

interface WorkspaceState {
    familyMembers: Person[];
    selectedPerson: Person | null;
    loading: boolean;

    setFamilyMembers: (members: Person[]) => void;
    setSelectedPerson: (person: Person | null) => void;
    setLoading: (loading: boolean) => void;
    refresh: (familyId: string) => Promise<void>;

    selectPersonById: (id: number) => void;
    clearSelection: () => void;

}

export const useSidebar = create<SidebarState>((set) => ({
    isOpen: true,
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
    familyMembers: [],
    selectedPerson: null,
    loading: true,

    refresh: async (familyId: string) => {
        set({ loading: true });
        try {
            const data = await fetchFamilyMembers(familyId);
            set({ familyMembers: data });

            // Keep the selected person synced if they still exist
            const current = get().selectedPerson;
            if (current) {
                const updated = data.find(m => m.id === current.id);
                set({ selectedPerson: updated || null });
            }
        } finally {
            set({ loading: false });
        }
    },

    setFamilyMembers: (members) => {
        const currentSelected = get().selectedPerson;

        const stillExists = currentSelected
            ? members.find(m => m.id === currentSelected.id)
            : null;

        set({
            familyMembers: members,
            selectedPerson: stillExists || null
        });
    },

    setSelectedPerson: (person) => set({ selectedPerson: person }),

    setLoading: (loading) => set({ loading }),

    selectPersonById: (id) => {
        const person = get().familyMembers.find((m) => m.id === id);
        set({ selectedPerson: person || null });
    },
    clearSelection: () => set({ selectedPerson: null }),
}));
