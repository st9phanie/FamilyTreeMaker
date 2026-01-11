import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        // 1. Check current session immediately
        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
        };

        initAuth();

        // 2. Listen for any changes (Login, Logout, Token Refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
        });

        // 3. Cleanup the listener when component unmounts
        return () => subscription.unsubscribe();
    }, []);

    // While checking, show nothing (or a loading spinner)
    if (isAuthenticated === null) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;