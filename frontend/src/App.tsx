
import { AddPerson } from "./pages/AddPerson"
import { Routes, Route } from 'react-router-dom';
import Index from "./pages/Index";
import Tree from "./pages/Tree";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Layout from "./Layout";
import Families from "./pages/Families";


const App = () => {
  return (
    <div className="max-w-full min-h-screen outfit flex flex-col ">
      <Navbar />
    <Routes>
      <Route path="/" element={<Index />} />

      <Route element={<Layout />}>
        <Route path="/add-person" element={<AddPerson />} />
        <Route path="/family" element={<Families />} />
        <Route path="/family-tree" element={<Tree />} />
        <Route path="/home" element={<Home />} />
      </Route>
    </Routes>

    </div>
  )
}

export default App

