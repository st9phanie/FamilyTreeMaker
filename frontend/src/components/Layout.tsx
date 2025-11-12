import { useSidebar } from '@/utils/store';
import React, { type ReactNode } from 'react'

type Props = {
    children: ReactNode;
    className?: string;
}

const Layout = ({ children, className }: Props) => {
    const { isOpen } = useSidebar()

    return (
        <div className=
            {`fixed
        top-[60px]
        ${isOpen ? "left-[280px] w-[calc(100vw-280px)]" : "left-[60px] w-[calc(100vw-60px)]"} 
        h-[calc(100vh-60px)]
        bg-white
        overflow-auto
        flex
        py-5
         ${className}`}
        >
            {children}
        </div>
    )
}

export default Layout