import { Globe, Sidebar, User2 } from 'lucide-react'
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSidebar } from '@/utils/store'

const Navbar = () => {

    const { toggle } = useSidebar()

    return (
        <nav className='w-full flex flex-row text-white bg-[#7CB937] border-b border-lime-700 h-[60px] px-4 items-center justify-between fixed top-0 left-0 '>

            <div className='flex flex-row items-center space-x-4 '>
                <Sidebar className='size-6' onClick={toggle} />
                <p className='lg:text-2xl text-lg text-white font-bold'>Ansab</p>
            </div>

            <div className='flex'>
                <ul className='flex flex-row gap-x-4 items-center justify-between text-lg font-medium'>
                    <li className=''>
                        <div className='flex grid-cols-2 gap-x-5'>
                            <User2 className='size-6' />

                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger>
                                    <Globe className='size-6' />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Language</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>English</DropdownMenuItem>
                                    <DropdownMenuItem>العربية</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </li>

                </ul>
            </div>
        </nav>
    )
}

export default Navbar