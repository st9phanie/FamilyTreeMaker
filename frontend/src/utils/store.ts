// store.ts
import { fetchFamilyMembers } from '@/lib/functions';
import { supabase } from '@/lib/supabase';
import { create } from 'zustand';
import { persist } from "zustand/middleware";

type SidebarState = {
    isOpen: boolean;
    toggle: () => void;
}

type ThemeState = {
    isDarkMode: boolean;
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

interface UserState {
    user: User | null;
    fetchUser: () => Promise<void>;
    loading: boolean;
    clearUser: () => void;
}

export const useSidebar = create<SidebarState>((set) => ({
    isOpen: true,
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export const useUserState = create<UserState>((set) => ({
    user: null,
    loading: false,

    fetchUser: async () => {
        set({ loading: true });
        try {
            const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

            if (authError || !authUser) {
                set({ user: null, loading: false });
                return;
            }

            const { data: dbUser, error: dbError } = await supabase
                .from('user')
                .select('*')
                .eq('id', authUser.id)
                .maybeSingle();                

            if (dbError) throw dbError;

            set({ user: dbUser, loading: false });
        } catch (error) {
            console.error("Error fetching user:", error);
            set({ user: null, loading: false });
        }
    },

    clearUser: () => set({ user: null }),
}));

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
    familyMembers: [],
    selectedPerson: null,
    loading: true,

    refresh: async (familyId: string) => {
        set({ loading: true });
        try {
            const data = await fetchFamilyMembers(familyId);
            set({ familyMembers: data });

            const current = get().selectedPerson;
            if (current) {
                const updated = data.find((m: Person) => m.id === current.id);
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

export const useTheme = create<ThemeState>()(
    persist((set) => ({
        isDarkMode: false,
        toggle: () => set((state) => ({ isDarkMode: !state.isDarkMode }))
    }),
        {
            name: 'theme-storage',
        }));