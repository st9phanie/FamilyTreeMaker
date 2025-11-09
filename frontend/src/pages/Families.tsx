import Layout from '@/components/Layout'
import { fetchUserFamilies } from '@/lib/functions'
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
        <Layout>
            {families.map((f,key)=>(
                <p key={key}> {f.lastname} </p>
            ))}
        </Layout>
    )
}

export default Families