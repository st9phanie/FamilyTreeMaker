import SearchBar from '@/components/home-page/Searchbar'
import React from 'react'

const Index = () => {
  return (
    <div className='w-full px-20 py-10 min-h-[calc(100vh-60px)] bg-red-200 flex flex-col '>
        <SearchBar onSearchChange={()=>{}} />
        <div className=''>

        </div>
    </div>
  )
}

export default Index