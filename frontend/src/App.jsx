import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Job from "./pages/Job";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/job/:id" element={<Job />} /> */}
      </Routes>
    </BrowserRouter>
  );
}