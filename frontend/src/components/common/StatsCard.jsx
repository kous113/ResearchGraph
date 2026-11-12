
import {
  FileText,
  BrainCircuit,
  Network,
  Lightbulb,
} from "lucide-react";

import "../../styles/dashboard.css";

const icons = {
  papers: FileText,
  analysed: BrainCircuit,
  connections: Network,
  gaps: Lightbulb,
};

function StatsCard({ title, value, description, type }) {
  const Icon = icons[type];

  return (
    <div className={`stats-card stats-${type}`}>
      <div className="stats-card-top">
        <div>
          <p className="stats-title">{title}</p>
          <h2>{value}</h2>
        </div>

        <div className="stats-icon">
          <Icon size={23} />
        </div>
      </div>

      <p className="stats-description">{description}</p>
    </div>
  );
}

export default StatsCard;
