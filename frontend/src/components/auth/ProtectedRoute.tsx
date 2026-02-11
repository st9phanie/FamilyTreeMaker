import { Navigate, Outlet } from "react-router-dom";
import { useUserState } from "@/utils/store";
import { Loader2 } from "lucide-react";

const ProtectedRoute = () => {
    const { user, loading } = useUserState();

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-teal-600" />
            </div>
        );
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;