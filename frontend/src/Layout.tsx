import { Outlet } from "react-router-dom";
import Sidebar from "./components/sidebar";

const Layout = () => {
    return (
        <div className="flex flex-row">
            <Sidebar />
            <main className="">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
