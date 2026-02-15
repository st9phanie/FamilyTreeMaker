import FamilyCard from "@/components/family-page/familycard";
import Layout from "@/components/family-page/Layout";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createNewFamily, fetchUserFamiliesAndLengths } from "@/lib/functions";
import { supabase } from "@/lib/supabase";
import { useUserState } from "@/utils/store";
import { ArrowDownAz, ArrowDownZa, ChevronDown, Loader2, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface DashboardState {
    families: Family[];
    members: Record<string, number>;
}

const Families = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useUserState();

    const [dashboardData, setDashboardData] = useState<DashboardState>({
        families: [],
        members: {}
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newName, setNewName] = useState<string>("")
    const [sortType, setSortType] = useState<"none" | "asc" | "desc">("none");

    const loadFamilies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await fetchUserFamiliesAndLengths();

            if (!data || !Array.isArray(data) || data.length < 2) {
                setDashboardData({ families: [], members: {} });
                return;
            }

            const [familiesList, membersArray] = data;
            const membersMap: Record<string, number> = {};

            if (Array.isArray(familiesList) && Array.isArray(membersArray)) {
                familiesList.forEach((family, index) => {
                    if (family && family.id) {
                        membersMap[family.id] = membersArray[index] || 0;
                    }
                });

                setDashboardData({
                    families: familiesList,
                    members: membersMap
                });
            }
        } catch (err) {
            console.error("Dashboard Load Error:", err);
            setError("Failed to load families. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    const sortedFamilies = useMemo(() => {
        const families = [...dashboardData.families];

        if (sortType === "asc") {
            return families.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortType === "desc") {
            return families.sort((a, b) => b.name.localeCompare(a.name));
        }

        return families;
    }, [dashboardData.families, sortType]);

    const createFamily = async () => {
        if (!newName.trim()) return;

        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const response = await createNewFamily({ user_id: user.id, name: newName.trim() });
                if (response.status === "success") {
                    setNewName("");
                    navigate(`/family/${response.id}`);
                }
            }
        } catch (err) {
            setError("Failed to create family." + err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (!authLoading) {
            if (user) {
                loadFamilies();
            } else {
                setLoading(false);
            }
        }
    }, [authLoading, user, loadFamilies]);

    if (authLoading || loading) {
        return (
            <Layout>
                <div className='min-h-max fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                    <Loader2 className='animate-spin size-10' />
                </div>
            </Layout>)
    }
    if (error) return <Layout><div className="text-red-500">{error}</div></Layout>;

    return (
        <Layout className="flex flex-col">
            <div className="mb-3 flex flex-row justify-between">

                <h1 className="text-lg drop-shadow-sm font-medium tracking-wide ">
                    Your Families
                </h1>

                <div className=" mr-1">
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger className="flex flex-row items-center gap-x-2 cursor-pointer text-primary">
                            <span>Sort:</span>
                            <span>{sortType === 'asc' ? 'Ascending (A-Z)' : sortType === 'desc' ? 'Descending (Z-A)' : 'None'}</span>
                            <ChevronDown className="size-5" />

                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="mr-6">
                            <DropdownMenuItem onClick={() => setSortType("asc")} className='cursor-pointer'>
                                <ArrowDownAz className="text-primary" />Ascending (A-Z)</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortType("desc")} className="cursor-pointer">
                                <ArrowDownZa className="text-primary" /> Descending (Z-A)</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>

            <div
                className={`grid grid-cols-7 w-full gap-y-10 gap-x-3`}
            >
                {sortedFamilies.map((f) => (
                    <FamilyCard
                        key={f.id}
                        name={f.name}
                        id={f.id}
                        memberCount={dashboardData.members[f.id] || 0}
                        onRefresh={loadFamilies}
                    />
                ))}

                <div className="rounded-lg flex cursor-pointer items-center border-2 border-primary h-35 w-[200px] shadow-sm justify-center">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" className="flex-1 h-full">
                                <Plus className="size-6" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New Family</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 mt-3">
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Name</Label>
                                    <Input id="name-1" name="name" value={newName} onChange={(e) => setNewName(e.target.value)} className="rounded-lg " defaultValue="Family" required />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button onClick={createFamily}>Save</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

            </div>

        </Layout>
    );
};

export default Families;
