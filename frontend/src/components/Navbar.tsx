import { Moon, Sun, User2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useTheme, useUserState } from '@/utils/store'
import { useEffect, useState } from 'react'

const Navbar = () => {
    const { clearUser, user } = useUserState()

    const [preview, setPreview] = useState<string | null>(user?.photo || null);

    useEffect(() => {

        if (!user?.photo) {
            setPreview(user?.photo || null);
        }
    }, [user?.photo]);


    async function signOut() {
        const { error } = await supabase.auth.signOut()
        clearUser();
        console.log(error);
        navigate("/login");
    }

    const { isDarkMode, toggle } = useTheme()

    const navigate = useNavigate();

    return (
        <nav className='w-full flex flex-row h-10 border-b border-sidebar-border px-5 items-center justify-between fixed top-0 left-0 text-primary bg-secondary'>
            <Link to="/family"><p className='text-lg font-medium cursor-pointer'>ORIGIN</p></Link>

            <div className='flex'>
                <ul className='flex flex-row gap-x-2 items-center justify-between text-lg font-medium'>
                    <li className=''>
                        <div className='flex p-1 hover:bg-teal-700/20 rounded-full'>
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger>
                                    {preview ? <div className='rounded-full cursor-pointer size-6'><img src={preview!} height={24} width={24} className='rounded-full'  /></div> : <User2 className='size-  cursor-pointer  ' />}
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <Link to="/profile">
                                        <DropdownMenuItem className='cursor-pointer'>
                                            Profile
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuItem onClick={signOut} className="text-red-600 focus:text-red-600 focus:bg-red-600/10 cursor-pointer">Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </li>
                    <li>
                        <button onClick={toggle} className='flex p-1 hover:bg-teal-700/20 rounded-full'>
                            {isDarkMode ? <Sun className='size-6 cursor-pointer text-white' /> : <Moon className='text-primary size-6 cursor-pointer ' />}
                        </button>
                    </li>


                </ul>
            </div>
        </nav>
    )
}

export default Navbar