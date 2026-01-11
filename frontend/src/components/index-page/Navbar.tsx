import { Globe, User2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'

const Navbar = () => {



    return (
        <nav className='w-full flex flex-row bg-white text-teal-900 h-[60px] border-b border-gray-200 px-20 items-center justify-between fixed top-0 left-0 '>
            <Link to="/"><p className='md:text-2xl text-xl font-semibold'>Dendro</p></Link>

            {/* <div className='flex'>
                <ul className='flex flex-row gap-x-4 items-center justify-between text-lg font-medium'>
                    <li className=''>
                        About
                    </li>
                </ul>
            </div> */}

            <div className='flex flex-row gap-x-3'>
                <Button className='rounded-2xl'>Sign up</Button>

                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger>
                        <Globe className='size-6 cursor-pointer' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Language</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>English</DropdownMenuItem>
                        <DropdownMenuItem>العربية</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

        </nav >
    )
}

export default Navbar