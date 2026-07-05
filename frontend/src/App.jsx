import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

// Per-job view is rendered inside the JobCard modal pattern (see
// components/JobModal.jsx). No standalone /job/:id route is needed.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
