import {
  Upload,
  BrainCircuit,
  Network,
  Lightbulb,
} from "lucide-react";
import "../../styles/howItWorks.css";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload Papers",
      description:
        "Upload your research papers in PDF format to begin building your research library.",
    },
    {
      number: "02",
      icon: BrainCircuit,
      title: "AI Analysis",
      description:
        "Our AI analyses each paper and extracts its objectives, methodology, findings, and limitations.",
    },
    {
      number: "03",
      icon: Network,
      title: "Discover Connections",
      description:
        "Explore relationships between papers based on their topics, methods, and citations.",
    },
    {
      number: "04",
      icon: Lightbulb,
      title: "Explore Insights",
      description:
        "Compare research papers and discover potential research gaps supported by evidence.",
    },
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-heading">
        <span>HOW IT WORKS</span>
        <h2>From Research Papers to Meaningful Insights</h2>
        <p>
          A simple workflow that helps you understand the bigger picture
          behind academic research.
        </p>
      </div>

      <div className="steps-grid">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <div className="step-card" key={step.number}>
              <span className="step-number">{step.number}</span>

              <div className="step-icon">
                <Icon size={26} />
              </div>

              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default HowItWorks;