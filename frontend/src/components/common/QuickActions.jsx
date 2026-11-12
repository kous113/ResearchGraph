
import { Link } from "react-router-dom";
import {
  Upload,
  Network,
  GitCompareArrows,
  Lightbulb,
  ArrowUpRight,
} from "lucide-react";

import "../../styles/dashboard.css";

function QuickActions() {
  const actions = [
    {
      title: "Upload a Paper",
      description: "Add a new research paper to your library.",
      icon: Upload,
      link: "/upload",
      type: "upload",
    },
    {
      title: "Explore Research Graph",
      description: "Discover relationships between your papers.",
      icon: Network,
      link: "/graph",
      type: "graph",
    },
    {
      title: "Compare Papers",
      description: "Compare methodologies and research findings.",
      icon: GitCompareArrows,
      link: "/compare",
      type: "compare",
    },
    {
      title: "Discover Research Gaps",
      description: "Explore potential gaps across your papers.",
      icon: Lightbulb,
      link: "/research-gaps",
      type: "gaps",
    },
  ];

  return (
    <section className="quick-actions-section">
      <div className="quick-actions-header">
        <h2>Quick Actions</h2>
        <p>Jump directly into your research workspace</p>
      </div>

      <div className="quick-actions-grid">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              to={action.link}
              className="quick-action-card"
              key={action.type}
            >
              <div className={`quick-action-icon quick-${action.type}`}>
                <Icon size={22} />
              </div>

              <div className="quick-action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>

              <ArrowUpRight
                size={19}
                className="quick-action-arrow"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default QuickActions;
