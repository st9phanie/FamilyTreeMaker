import { Globe, User2 } from 'lucide-react'
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
    return (
        <nav className='w-full flex flex-row text-white bg-[#7CB937] h-[60px] px-10 items-center justify-between fixed top-0 left-0 '>
            <p className='lg:text-2xl text-lg text-white font-bold'>Ansab</p>
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