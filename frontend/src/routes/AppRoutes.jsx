import { Routes, Route } from "react-router-dom";
import Landing from "../pages/public/Landing";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import Dashboard from "../pages/app/Dashboard";
import MyPapers from "../pages/app/MyPapers";
import UploadPaper from "../pages/app/UploadPaper";
import PaperDetails from "../pages/app/PaperDetails";
import ResearchGraph from "../pages/app/ResearchGraph";
import ComparePapers from "../pages/app/ComparePapers";
import ResearchGaps from "../pages/app/ResearchGaps";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/papers" element={<MyPapers />} />
      <Route path="/upload" element={<UploadPaper />} />
      <Route path="/papers/:id" element={<PaperDetails />} />
      <Route path="/graph" element={<ResearchGraph />} />
      <Route path="/compare" element={<ComparePapers />} />
      <Route path="/research-gaps" element={<ResearchGaps />} />

      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}

export default AppRoutes;