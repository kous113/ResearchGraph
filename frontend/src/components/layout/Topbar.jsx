
import { Search, Bell, ChevronDown, UserRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/topbar.css";

function Topbar() {
  const { user } = useAuth();

  const fullName = user?.fullName || "Researcher";
  const email = user?.email || "Student Account";

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={19} />
        <input
          type="text"
          placeholder="Search papers, topics, or keywords..."
        />
      </div>

      <div className="topbar-actions">
        <button className="notification-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="topbar-divider"></div>

        <button className="topbar-profile">
          <div className="profile-avatar">
            <UserRound size={19} />
          </div>

          <div className="profile-info">
            <span className="profile-name">{fullName}</span>
            <span className="profile-role">{email}</span>
          </div>

          <ChevronDown size={17} />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
