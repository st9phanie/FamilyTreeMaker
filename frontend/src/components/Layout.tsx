import React, { type ReactNode } from 'react'

type Props = {
    children: ReactNode;
    className?: string;
}

const Layout = ({children, className}:Props) => {
    return (
        <div className=
        {`fixed
        top-[60px]
        left-[280px]
        w-[calc(100vw-280px)]
        h-[calc(100vh-60px)]
        bg-white
        overflow-auto
        flex
        py-5
        px-10 ${className}`}
      >
        {children}
        </div>
    )
}

export default Layout