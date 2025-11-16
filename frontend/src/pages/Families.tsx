import FamilyCard from '@/components/family-page/familycard'
import Layout from '@/components/Layout'
import { fetchUserFamiliesAndLengths } from '@/lib/functions'
import { useSidebar } from '@/utils/store'
import { Plus } from 'lucide-react'
import React, {  useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'


const Families = () => {
    const [families, setFamilies] = useState<Family[]>([])
    const [members, setMembers] = useState<(number[])>([])
    const { isOpen } = useSidebar()


    const loadFamilies = useCallback(async () => {
        const data = await fetchUserFamiliesAndLengths(1);

        if (!data) return;

        // data = [families, lengths]
        setFamilies(data[0]);
        setMembers(data[1]);  // lengths
    }, []);


    useEffect(() => {

        loadFamilies()
    }, [])

    return (
        <Layout className='flex flex-col gap-y-5'>
            <h1 className=' text-2xl drop-shadow-sm font-semibold tracking-wide'>Your Families</h1>
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:${isOpen ? "grid-cols-4" : "grid-cols-5"} gap-5 w-full`}>
                {families && families.map((f: Family, key) => (
                    <FamilyCard key={f.id} lastname={f.lastname} id={f.id} memberCount={members[key]} />

                ))}
                <Link to={`/family/${families!.length + 1}`}>
                    <div className='flex cursor-pointer items-center rounded-2xl border-2 border-lime-600 p-4 text-white h-[150px] w-[250px] gap-y-3 shadow-lg justify-center'>
                        <Plus className='text-lime-600 size-6' />
                    </div>
                </Link>
            </div>

        </Layout>
    )
}

export default Families