import { HashRouter, Routes, Route } from "react-router-dom";

import TopNav from "./components/TopNav";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Admin from "./pages/Admin/Admin";

export default function App() {
  return (
    <HashRouter>
      <TopNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
}