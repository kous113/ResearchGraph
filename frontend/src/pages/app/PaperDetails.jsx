
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FileText, ArrowLeft, CalendarDays, Users, BookOpen,
  Target, Lightbulb, FlaskConical, BarChart3,
  AlertTriangle, Quote, Tags, CheckCircle2, LoaderCircle,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { getPaperById } from "../../services/paperService";
import "../../styles/paperDetails.css";

const tabs = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "problem", label: "Research Problem", icon: Target },
  { id: "objectives", label: "Objectives", icon: CheckCircle2 },
  { id: "topics", label: "Topics", icon: Tags },
  { id: "methodology", label: "Methodology", icon: FlaskConical },
  { id: "findings", label: "Findings", icon: BarChart3 },
  { id: "limitations", label: "Limitations", icon: AlertTriangle },
  { id: "references", label: "References", icon: Quote },
];

function PaperDetails() {
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("overview");
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getPaperById(id);
        setPaper(result);
      } catch (err) {
        console.error("Paper details error:", err);
        setError(
          err.response?.data?.message || "Failed to load paper details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [id]);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <Topbar />
        <main className="dashboard-main paper-details-main">
          <p><LoaderCircle size={18} /> Loading paper details...</p>
        </main>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <Topbar />
        <main className="dashboard-main paper-details-main">
          <h2>{error || "Paper not found."}</h2>
          <Link to="/papers" className="paper-details-back">
            <ArrowLeft size={17} /> Back to My Papers
          </Link>
        </main>
      </div>
    );
  }

  const analysis =
    typeof paper.analysis === "string"
      ? JSON.parse(paper.analysis)
      : paper.analysis;

  const renderList = (items, Icon) => (
    <ul className="details-list">
      {(items || []).map((item, index) => (
        <li key={index}>
          <Icon size={19} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="details-content">
            <h2>Paper Summary</h2>
            <p className="details-paragraph">
              {analysis.research_problem || "No summary available."}
            </p>
            <div className="overview-highlight">
              <div className="highlight-icon">
                <Lightbulb size={22} />
              </div>
              <div>
                <h3>Research Overview</h3>
                <p>{analysis.methodology || "No methodology available."}</p>
              </div>
            </div>
          </div>
        );

      case "problem":
        return (
          <div className="details-content">
            <h2>Identified Research Problem</h2>
            <p className="details-paragraph">
              {analysis.research_problem || "Not identified."}
            </p>
        </div>
        );

      case "objectives":
        return (
          <div className="details-content">
            <h2>Research Objectives</h2>
            <p className="details-description">
              Objectives identified from the research paper.
            </p>
            {renderList(analysis.objectives, CheckCircle2)}
          </div>
        );

      case "topics":
        return (
          <div className="details-content">
            <h2>Topics and Keywords</h2>
            <p className="details-description">
              Main research areas and concepts.
            </p>
            <div className="topic-tags">
              {(analysis.topics || []).map((topic, index) => (
                <span key={index}>{topic}</span>
              ))}
            </div>
          </div>
        );

      case "methodology":
        return (
          <div className="details-content">
            <h2>Research Methodology</h2>
            <div className="methodology-grid">
              <div className="methodology-item methodology-wide">
                <span>Methodology</span>
                <h3>{analysis.methodology || "Not identified."}</h3>
              </div>
              <div className="methodology-item methodology-wide">
                <span>Dataset</span>
                <p>{analysis.dataset || "Not identified."}</p>
              </div>
            </div>
          </div>
        );

      case "findings":
        return (
          <div className="details-content">
            <h2>Key Findings</h2>
            <p className="details-description">
              Important observations identified by AI.
            </p>
            {renderList(analysis.findings, CheckCircle2)}
          </div>
        );

      case "limitations":
        return (
          <div className="details-content">
            <h2>Research Limitations</h2>
            <p className="details-description">
              Challenges and limitations identified in the paper.
            </p>
            {renderList(analysis.limitations, AlertTriangle)}
          </div>
        );

      case "references":
        return (
          <div className="details-content">
            <h2>References</h2>
            <ol className="reference-list">
              {(analysis.references || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <Topbar />

      <main className="dashboard-main paper-details-main">
        <Link to="/papers" className="paper-details-back">
          <ArrowLeft size={17} />
          Back to My Papers
        </Link>

        <section className="paper-details-header">
          <div className="paper-details-title-row">
            <div className="paper-details-file-icon">
              <FileText size={27} />
            </div>

            <div className="paper-details-title">
              <div className="paper-details-status">
                <span>
                  <CheckCircle2 size={14} />
                  Analysed
                </span>
                <span className="paper-id">Paper ID: {paper.id}</span>
              </div>

              <h1>{paper.title}</h1>

              <p className="paper-authors">
                <Users size={16} />
                {(analysis.authors || []).join(", ") || "Authors not identified"}
              </p>
            </div>
          </div>

          <div className="paper-details-metadata">
            <div>
              <CalendarDays size={17} />
              <span>
                Published: {analysis.publication_year || "Not available"}
              </span>
            </div>

            <div>
              <FileText size={17} />
              <span>
                Uploaded: {new Date(paper.uploaded_at).toLocaleDateString()}
              </span>
            </div>

            <div>
              <BookOpen size={17} />
              <span>{paper.file_name}</span>
            </div>
          </div>
        </section>

        <section className="paper-analysis-section">
          <div className="paper-analysis-heading">
            <div>
              <h2>Paper Analysis</h2>
              <p>
                Explore the research information extracted from this paper.
              </p>
            </div>
          </div>

          <div className="paper-details-tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  className={`paper-tab ${
                    activeTab === tab.id ? "paper-tab-active" : ""
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={17} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="paper-tab-content">{renderContent()}</div>
        </section>
      </main>
    </div>
  );
}

export default PaperDetails;
