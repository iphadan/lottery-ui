

import { Routes, Route } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel";
import TVScreen from "./pages/TVScreen";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TVScreen />} />
      <Route path="/tv" element={<TVScreen />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
}