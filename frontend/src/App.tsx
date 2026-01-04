import { AddPerson } from "./pages/AddPerson";
import { Routes, Route, useParams, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Families from "./pages/Families";
import MyProfile from "./pages/MyProfile";
import Workspace from "./pages/Workspace";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import MainLayout from "./Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function FamilyTreeWrapper() {
  const { id } = useParams<{ id: string }>();
  return <Workspace id={parseInt(id!)} />;
}

const App = () => {
  return (
    <div className="max-w-full min-h-screen poppins flex flex-col">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/add-person" element={<AddPerson />} />
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
