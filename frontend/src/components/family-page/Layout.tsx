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
        top-[60px] w-full
        h-[calc(100vh-60px)]
        bg-white
        overflow-auto
        flex
        py-3
        px-5
         ${className}`}
        >
            {children}
        </div>
    )
}

export default Layout