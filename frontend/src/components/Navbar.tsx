import {User2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from 'react-router-dom'

const Navbar = () => {

    return (
        <nav className='w-full flex flex-row text-teal-950 h-10 border-b border-gray-200 px-5 items-center justify-between fixed top-0 left-0 '>
            <Link to="/family"><p className='text-lg font-medium cursor-pointer'>ORIGIN</p></Link>

            <div className='flex'>
                <ul className='flex flex-row gap-x-4 items-center justify-between text-lg font-medium'>
                    <li className=''>
                        <div className='flex grid-cols-2 gap-x-5 p-1 hover:bg-teal-700/20 rounded-full'>
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger>
                                    <User2 className='size-5  cursor-pointer  ' />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className='cursor-pointer'>Profile</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-600/10 cursor-pointer">Logout</DropdownMenuItem>
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