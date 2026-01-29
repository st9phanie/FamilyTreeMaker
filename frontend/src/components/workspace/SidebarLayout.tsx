import { type ReactNode } from 'react'

type Props = {
    children: ReactNode;
    className?: string;
}

const SidebarLayout = ({ children, className }: Props) => {
    return (
        <div className=
            {`w-[360px] h-[calc(100vh-40px)] bg-secondary text-primary border-r border-sidebar-border px-5 flex flex-col top-[40px] fixed py-10 justify-between
         ${className}`}
        >
            {children}

        </div>
    )
}

export default SidebarLayout