
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Network,
  LayoutDashboard,
  FileText,
  Upload,
  GitBranch,
  GitCompareArrows,
  Lightbulb,
  Settings,
  UserRound,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import "../../styles/sidebar.css";

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.replace("/");
  };

  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-logo">
        <Network size={27} />
        <span>ResearchGraph</span>
      </Link>

      <div className="sidebar-section">
        <p className="sidebar-heading">WORKSPACE</p>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className="sidebar-link">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/papers" className="sidebar-link">
            <FileText size={19} />
            <span>My Papers</span>
          </NavLink>

          <NavLink to="/upload" className="sidebar-link">
            <Upload size={19} />
            <span>Upload Paper</span>
          </NavLink>

          <NavLink to="/graph" className="sidebar-link">
            <GitBranch size={19} />
            <span>Research Graph</span>
          </NavLink>

          <NavLink to="/compare" className="sidebar-link">
            <GitCompareArrows size={19} />
            <span>Compare Papers</span>
          </NavLink>

          <NavLink to="/research-gaps" className="sidebar-link">
            <Lightbulb size={19} />
            <span>Research Gaps</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <p className="sidebar-heading">ACCOUNT</p>

        <NavLink to="/profile" className="sidebar-link">
          <UserRound size={19} />
          <span>My Profile</span>
        </NavLink>

        <NavLink to="/settings" className="sidebar-link">
          <Settings size={19} />
          <span>Settings</span>
        </NavLink>

        <button
          type="button"
          className="sidebar-link sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
