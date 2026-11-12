
import {
  Upload,
  BrainCircuit,
  Network,
  Lightbulb,
} from "lucide-react";

function ResearchActivity() {
  const activities = [
    {
      id: 1,
      icon: Upload,
      title: "New paper uploaded",
      description: "A Survey on Large Language Models",
      time: "Today, 10:30 AM",
      type: "upload",
    },
    {
      id: 2,
      icon: BrainCircuit,
      title: "Paper analysis completed",
      description: "Deep Learning for Image Classification",
      time: "Today, 9:15 AM",
      type: "analysis",
    },
    {
      id: 3,
      icon: Network,
      title: "New research connections discovered",
      description: "12 relationships identified between papers",
      time: "Yesterday, 4:45 PM",
      type: "connection",
    },
    {
      id: 4,
      icon: Lightbulb,
      title: "Potential research gap identified",
      description: "A recurring limitation was found across 5 papers",
      time: "Yesterday, 2:20 PM",
      type: "gap",
    },
  ];

  return (
    <section className="activity-section">
      <div className="activity-header">
        <h2>Research Activity</h2>
        <p>Recent updates from your workspace</p>
      </div>

      <div className="activity-list">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div className="activity-item" key={activity.id}>
              <div className={`activity-icon activity-${activity.type}`}>
                <Icon size={19} />
              </div>

              <div className="activity-details">
                <h3>{activity.title}</h3>
                <p>{activity.description}</p>
                <span>{activity.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ResearchActivity;
