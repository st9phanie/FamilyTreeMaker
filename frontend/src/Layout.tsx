import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="flex flex-row">
            <main className="">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
