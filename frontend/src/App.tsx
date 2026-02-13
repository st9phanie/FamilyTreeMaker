import { Routes, Route, useParams, Navigate, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import Families from "./pages/Families";
import MyProfile from "./pages/MyProfile";
import Workspace from "./pages/Workspace";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import MainLayout from "./Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useTheme } from "./utils/store";
import { useEffect, useState } from "react";
import { useUserState } from '@/utils/store'
import { supabase } from "./lib/supabase";

function FamilyTreeWrapper() {
  const { id } = useParams<{ id: string }>();
  return <Workspace id={id!} />;
}

const App = () => {

  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsResetting(true);
        navigate("/profile?reset=true");
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  const isDarkMode = useTheme((state) => state.isDarkMode);

  useEffect(() => {
    const root = window.document.documentElement;


    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const { fetchUser, clearUser } = useUserState();

  useEffect(() => {
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        fetchUser();
      }
      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true);
      }

      else if (event === "SIGNED_OUT") {
        clearUser();
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUser, clearUser]);

  return (
    <div className="max-w-full min-h-screen poppins flex flex-col">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Index />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/family" element={<Families />} />
            <Route path="/family/:id" element={<FamilyTreeWrapper />} />
            <Route path="/profile" element={<MyProfile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div >
  );
};

export default App;
