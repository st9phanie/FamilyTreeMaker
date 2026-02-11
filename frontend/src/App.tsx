import { Routes, Route, useParams, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Families from "./pages/Families";
import MyProfile from "./pages/MyProfile";
import Workspace from "./pages/Workspace";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import MainLayout from "./Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useTheme } from "./utils/store";
import { useEffect } from "react";
import { useUserState } from '@/utils/store'

function FamilyTreeWrapper() {
  const { id } = useParams<{ id: string }>();
  return <Workspace id={id!} />;
}

const App = () => {

  const isDarkMode = useTheme((state) => state.isDarkMode);

  useEffect(() => {
    const root = window.document.documentElement;


    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const { fetchUser } = useUserState();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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
