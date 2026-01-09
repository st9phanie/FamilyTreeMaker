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

const Navbar = () => {

    

    return (
        <nav className='w-full flex flex-row text-white bg-teal-950 h-[60px] border-b border-gray-200 px-4 items-center justify-between fixed top-0 left-0 '>
            <Link to="/"><p className='md:text-2xl text-xl font-medium'>Cognatus</p></Link>

            <div className='flex'>
                <ul className='flex flex-row gap-x-4 items-center justify-between text-lg font-medium'>
                    <li className=''>
                        <div className='flex grid-cols-2 gap-x-5'>

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