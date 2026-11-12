
import { useEffect, useState } from "react";

import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import StatsCard from "../../components/common/StatsCard";
import RecentPapers from "../../components/common/RecentPapers";
import ResearchActivity from "../../components/common/ResearchActivity";
import QuickActions from "../../components/common/QuickActions";

import {
  getAllPapers,
  getPaperRelationships,
  discoverResearchGaps,
} from "../../services/paperService";

import "../../styles/dashboard.css";

function Dashboard() {
  const [papers, setPapers] = useState([]);
  const [connections, setConnections] = useState(0);
  const [gaps, setGaps] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch actual papers
        const paperData = await getAllPapers();
        setPapers(paperData);

        // Fetch connections and research gaps independently
        const [relationshipResult, gapResult] = await Promise.allSettled([
          getPaperRelationships(),
          paperData.length >= 2
            ? discoverResearchGaps()
            : Promise.resolve({ gaps: [] }),
        ]);

        if (relationshipResult.status === "fulfilled") {
          const relationshipData = relationshipResult.value;

          const relationshipList = Array.isArray(relationshipData)
            ? relationshipData
            : relationshipData?.relationships || [];

          setConnections(relationshipList.length);
        } else {
          console.error(
            "Dashboard connections error:",
            relationshipResult.reason
          );
        }

        if (gapResult.status === "fulfilled") {
          setGaps(gapResult.value?.gaps?.length || 0);
        } else {
          console.error(
            "Dashboard research gaps error:",
            gapResult.reason
          );
        }
      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <Topbar />

      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <div>
            <h1>Dashboard</h1>
            <p>
              Welcome back! Here's an overview of your research workspace.
            </p>
          </div>
        </div>

        <div className="dashboard-stats">
          <StatsCard
            title="Total Papers"
            value={loading ? "..." : String(papers.length)}
            description="Papers in your library"
            type="papers"
          />

          <StatsCard
            title="Analysed Papers"
            value={loading ? "..." : String(papers.length)}
            description="Papers successfully analysed"
            type="analysed"
          />

          <StatsCard
            title="Connections"
            value={loading ? "..." : String(connections)}
            description="Relationships discovered"
            type="connections"
          />

          <StatsCard
            title="Potential Gaps"
            value={loading ? "..." : String(gaps)}
            description="Research opportunities identified"
            type="gaps"
          />
        </div>

        <QuickActions />
        <RecentPapers />
        <ResearchActivity />
      </main>
    </div>
  );
}

export default Dashboard;
