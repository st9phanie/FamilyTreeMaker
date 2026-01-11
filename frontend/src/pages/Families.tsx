import FamilyCard from "@/components/family-page/familycard";
import Layout from "@/components/family-page/Layout";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createNewFamily, fetchUserFamiliesAndLengths } from "@/lib/functions";
import { supabase } from "@/lib/supabase";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Families = () => {
    const navigate = useNavigate();

    const [families, setFamilies] = useState<Family[]>([]);
    const [members, setMembers] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newName, setNewName] = useState<string>("")

    const loadFamilies = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchUserFamiliesAndLengths();
            if (data) {
                setFamilies(data[0]);
                setMembers(data[1]);
            }
        } catch (err) {
            setError("Failed to load your families. Please try logging in again.");
        } finally {
            setLoading(false);
        }
    }, []);

    const createFamily = async () => {
        if (!newName.trim()) return; // Prevent empty names

        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const response = await createNewFamily({ user_id: user.id, name: newName });
                if (response.status === "success") {
                    setNewName("");
                    navigate(`/family/${response.id}`);
                }
            }
        } catch (err) {
            setError("Failed to create family.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadFamilies();
    }, [loadFamilies]);

    if (loading) return <Layout><div>Loading...</div></Layout>;
    if (error) return <Layout><div className="text-red-500">{error}</div></Layout>;

    return (
        <Layout className="flex flex-col gap-y-5 text-teal-950">
            <h1 className="text-2xl drop-shadow-sm font-semibold tracking-wide">
                Your Families
            </h1>

            <div
                className={`flex h-full  gap-x-5`}
            >
                {families.map((f, index) => (
                    <FamilyCard
                        key={f.id}
                        name={f.name}
                        id={f.id}
                        memberCount={members[index]}
                    />
                ))}

                <div className="flex cursor-pointer items-center border-2 border-teal-950 h-40 w-[250px] shadow-sm justify-center">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" className="flex-1 h-full">
                                <Plus className="text-teal-950 size-6" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New Family</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 mt-3">
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Name</Label>
                                    <Input id="name-1" name="name" value={newName} onChange={(e) => setNewName(e.target.value)} className="rounded-none" defaultValue="Family" required />
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
