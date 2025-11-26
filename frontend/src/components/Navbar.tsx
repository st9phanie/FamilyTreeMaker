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
        <nav className='w-full flex flex-row text-white bg-emerald-700 border-b-2 border-emerald-900 h-[60px] px-4 items-center justify-between fixed top-0 left-0 '>
            <p className='lg:text-2xl text-lg text-white font-bold poppins'>Cognatus</p>

            {/* <div className='flex flex-row items-center space-x-4 '>
                <Sidebar className='size-6' onClick={toggle} />
            </div> */}

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