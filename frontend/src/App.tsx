
import { AddPerson } from "./pages/AddPerson"
import { Routes, Route, useParams } from 'react-router-dom';
import Index from "./pages/Index";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Families from "./pages/Families";
import MyProfile from "./pages/MyProfile";
import Workspace from "./pages/Workspace";

function FamilyTreeWrapper() {
  const { id } = useParams<{ id: string }>();
  return <Workspace id={parseInt(id!)} />;
}

const App = () => {
  return (
    <div className="max-w-full min-h-screen poppins flex flex-col ">
      <Navbar />
    <Routes>
      <Route path="/" element={<Index />} />

      <Route >
        <Route path="/add-person" element={<AddPerson />} />
        <Route path="/family" element={<Families />} />
        <Route path="/family/:id" element={<FamilyTreeWrapper/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<MyProfile />} />
      </Route>
    </Routes>

    </div>
  )
}

export default App

