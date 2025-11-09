import React from 'react'
import { Link } from 'react-router-dom'

const links = [
    { link: "/home", title: "Home" },
    { link: "/my-profile", title: 'My Profile' },
    { link: "/family", title: 'My Family Tree' },
]

const Sidebar = () => {
    return (
        <nav className='h-[calc(100vh-60px)] top-[60px] border-r border-[#7CB937] w-70 py-5 fixed left-0'>
            <ul className='flex flex-col px-10 '>
                {links.map((link, key) => (
                    <Link key={key} to={link.link}>
                        <li  className='w-full text-lg py-2 px-2 rounded-sm hover:bg-gray-100'>
                            {link.title}
                        </li>
                    </Link>
                ))}

            </ul>
        </nav>
    )
}

export default Sidebar