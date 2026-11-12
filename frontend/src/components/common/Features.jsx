import {
  FileSearch,
  Network,
  GitCompareArrows,
  Lightbulb,
} from "lucide-react";
import "../../styles/feature.css";

function Features() {
  const features = [
    {
      icon: FileSearch,
      title: "Paper Analysis",
      description:
        "Extract research problems, objectives, methodologies, findings, and limitations from research papers.",
    },
    {
      icon: Network,
      title: "Research Connections",
      description:
        "Discover relationships between research papers through topics, methodologies, and citations.",
    },
    {
      icon: GitCompareArrows,
      title: "Paper Comparison",
      description:
        "Compare multiple research papers to understand their similarities and differences.",
    },
    {
      icon: Lightbulb,
      title: "Research Gap Discovery",
      description:
        "Identify potential research gaps by analysing recurring limitations and unresolved problems.",
    },
  ];

  return (
    <section className="features" id="features">
      <div className="features-heading">
        <span>WHAT RESEARCHGRAPH OFFERS</span>
        <h2>Everything You Need to Explore Research</h2>
        <p>
          Understand research papers beyond their abstracts.
          Discover insights and connections in one place.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div className="feature-card" key={index}>
              <div className="feature-icon">
                <Icon size={26} />
              </div>

              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Features;