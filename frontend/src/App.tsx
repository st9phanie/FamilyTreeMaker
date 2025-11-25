
import { AddPerson } from "./pages/AddPerson"
import { Routes, Route, useParams } from 'react-router-dom';
import Index from "./pages/Index";
import Tree from "./pages/Tree";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Layout from "./Layout";
import Families from "./pages/Families";
import MyProfile from "./pages/MyProfile";

function FamilyTreeWrapper() {
  const { id } = useParams<{ id: string }>();
  return <Tree id={parseInt(id!)} />;
}

const App = () => {
  return (
    <div className="max-w-full min-h-screen outfit flex flex-col ">
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

