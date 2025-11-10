import FamilyCard from '@/components/family-page/familycard'
import Layout from '@/components/Layout'
import { fetchUserFamilies } from '@/lib/functions'
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Families = () => {
    const [families, setFamilies] = useState([])

    const loadFamilies = async () => {
        const data = await fetchUserFamilies(1)
        if (data) setFamilies(data)
        console.log(data)
    }

    useEffect(() => {

        loadFamilies()
    }, [])

    return (
        <Layout className='flex flex-col gap-y-5'>
            <h1 className=' text-2xl drop-shadow-sm font-semibold tracking-wide'>Your Families</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full'>
                {families && families.map((f, key) => (
                    <FamilyCard key={key} lastname={f.lastname} id={f.id} />

                ))}
                    <div className='flex cursor-pointer items-center rounded-2xl border-2 border-lime-600 p-4 text-white h-[150px] w-[250px] gap-y-3 shadow-lg justify-center'>
                        <Plus className='text-lime-600 size-6' />
                    </div>
            </div>

        </Layout>
    )
}

export default Families