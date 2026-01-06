import FamilyCard from "@/components/family-page/familycard";
import Layout from "@/components/family-page/Layout";
import { fetchUserFamiliesAndLengths } from "@/lib/functions";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Families = () => {
    const [families, setFamilies] = useState<Family[]>([]);
    const [members, setMembers] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

                <Link to="/family/new">
                    <div className="flex cursor-pointer items-center border-2 border-teal-950 p-4 h-40 w-[250px] shadow-lg justify-center">
                        <Plus className="text-teal-950 size-6" />
                    </div>
                </Link>
            </div>
        </Layout>
    );
};

export default Families;
