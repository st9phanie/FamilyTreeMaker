import { Globe, Moon, Sun } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useTheme } from '@/utils/store'

const Navbar = () => {
    const { isDarkMode, toggle } = useTheme()

    const navigate = useNavigate();

    const goToSignup = () => {
        navigate(`/signup`)
    }

    return (
        <nav className='w-full flex flex-row bg-secondary text-primary h-[60px] border-b border-sidebar-border px-10 lg:px-20 items-center justify-between z-100 fixed top-0 left-0 '>
            <Link to="/"><p className='md:text-2xl text-xl font-semibold'>ORIGIN</p></Link>

            <div className='flex flex-row gap-x-3 items-center'>
                <Button onClick={goToSignup} className='rounded-2xl hidden lg:flex'>Sign up</Button>

                {/* <DropdownMenu modal={false}>
                    <DropdownMenuTrigger>
                        <Globe className='size-6 cursor-pointer' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Language</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>English</DropdownMenuItem>
                        <DropdownMenuItem>العربية</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu> */}

                <button onClick={toggle} className='hover:text-primary/80'>
                    {isDarkMode ? <Sun className='size-7 cursor-pointer text-primary' /> : <Moon className='text-primary size-7 cursor-pointer ' />}
                </button>
            </div>

        </nav >
    )
}

export default Navbar