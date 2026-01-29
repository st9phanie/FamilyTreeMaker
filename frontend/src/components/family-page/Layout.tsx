import { type ReactNode } from 'react'

type Props = {
    children: ReactNode;
    className?: string;
}

const Layout = ({ children, className }: Props) => {

    return (
        <div className=
            {`fixed
        top-10 w-full
        h-[calc(100vh-40px)]
        bg-secondary
        text-primary
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