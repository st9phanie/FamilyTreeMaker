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
        <nav className='w-full flex flex-row text-emerald-900 bg-white h-[60px] shadow-sm shadow-emerald-900/20 px-4 items-center justify-between fixed top-0 left-0 '>
            <p className='md:text-3xl text-2xl text-emerald-900 fdl tracking-widest font-medium'>Cognatus</p>

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