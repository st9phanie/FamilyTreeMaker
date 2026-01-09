import { useSidebar } from '@/utils/store';
import { Home, Network, UserPen } from 'lucide-react';
import { Link } from 'react-router-dom'

const links = [
    { link: "/home", title: "Home", icon: (<Home className='size-6 place-self-center' />) },
    { link: "/profile", title: 'My Profile', icon: (<UserPen className='size-6 place-self-center' />) },
    { link: "/family", title: 'Family Trees', icon: (<Network className='size-6 place-self-center' />) },
]

const Sidebar = () => {
    const { isOpen } = useSidebar()


    return (
        <nav className={`h-[calc(100vh-40px)]  border-r border-lime-700 top-[40px] py-5 fixed left-0 ${isOpen ? "w-70 " : "w-15"}`}>
            <ul className={`flex flex-col px-2`}  >
                {links.map((link, key) => (
                    <Link key={key} to={link.link}>
                        <li className='w-full text-lg py-3 px-4 rounded-sm hover:bg-gray-100 '>
                            {isOpen ? link.title : link.icon}
                        </li>
                    </Link>
                ))}

            </ul>
        </nav>
    )
}

export default Sidebar