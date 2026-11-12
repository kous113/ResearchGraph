
import { useEffect, useState } from "react";

import {
  FileText,
  GitCompareArrows,
  Check,
  X,
  Sparkles,
  LoaderCircle,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

import {
  getAllPapers,
  comparePapers,
} from "../../services/paperService";

import "../../styles/comparePapers.css";

const comparisonFields = [
  { key: "problem", label: "Research Problem" },
  { key: "objectives", label: "Research Objectives" },
  { key: "topics", label: "Research Topics" },
  { key: "methodology", label: "Methodology" },
  { key: "dataset", label: "Dataset Used" },
  { key: "findings", label: "Key Findings" },
  { key: "limitations", label: "Limitations" },
];

function ComparePapers() {
  const [papers, setPapers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [comparison, setComparison] = useState(null);
  const [comparing, setComparing] = useState(false);
  const [comparisonError, setComparisonError] = useState("");

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllPapers();

        const formattedPapers = data.map((paper) => {
          const analysis =
            typeof paper.analysis === "string"
              ? JSON.parse(paper.analysis)
              : paper.analysis || {};

          return {
            id: String(paper.id),
            title: paper.title,
            authors:
              (analysis.authors || []).join(", ") ||
              "Authors not identified",
            year: analysis.publication_year || "Not identified",
            problem: analysis.research_problem || "Not available",
            objectives: analysis.objectives || [],
            topics: analysis.topics || [],
            methodology: analysis.methodology || "Not available",
            dataset: analysis.dataset || "Not available",
            findings: analysis.findings || [],
            limitations: analysis.limitations || [],
          };
        });

        setPapers(formattedPapers);
        setSelectedIds(
          formattedPapers.slice(0, 2).map((paper) => paper.id)
        );
      } catch (err) {
        console.error("Compare papers error:", err);
        setError("Failed to load research papers.");
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  const selectedPapers = papers.filter((paper) =>
    selectedIds.includes(paper.id)
  );

  const handlePaperSelection = (paperId) => {
    setComparison(null);
    setComparisonError("");

    setSelectedIds((currentIds) => {
      if (currentIds.includes(paperId)) {
        return currentIds.filter((id) => id !== paperId);
      }

      if (currentIds.length >= 3) {
        return currentIds;
      }

      return [...currentIds, paperId];
    });
  };

  const handleCompare = async () => {
    if (selectedIds.length < 2) return;

    try {
      setComparing(true);
      setComparison(null);
      setComparisonError("");

      const result = await comparePapers(
        selectedIds.map(Number)
      );

      setComparison(result);
    } catch (err) {
      console.error("AI comparison error:", err);

      setComparisonError(
        err.response?.data?.message ||
        "Failed to generate AI comparison. Please try again."
      );
    } finally {
      setComparing(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
    setComparison(null);
    setComparisonError("");
  };

  const getFieldValue = (paper, key) => {
    const value = paper[key];

    if (Array.isArray(value)) {
      return value.length ? value.join(", ") : "Not available";
    }

    return value || "Not available";
  };

  const renderList = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return <p>Not available.</p>;
    }

    return (
      <ul className="ai-insight-list">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <Topbar />

      <main className="dashboard-main compare-main">
        <div className="compare-header">
          <div>
            <h1>Compare Papers</h1>
            <p>
              Compare research papers to understand their similarities
              and differences.
            </p>
          </div>
        </div>

        {/* Paper Selection */}
        <section className="compare-selection-section">
          <div className="compare-section-heading">
            <div>
              <h2>Select Research Papers</h2>
              <p>Select at least 2 and up to 3 papers to compare.</p>
            </div>

            <span className="selection-count">
              {selectedIds.length} / 3 Selected
            </span>
          </div>

          {loading ? (
            <p>Loading your research papers...</p>
          ) : error ? (
            <p>{error}</p>
          ) : papers.length === 0 ? (
            <p>
              No research papers found. Upload papers before comparing them.
            </p>
          ) : (
            <div className="compare-paper-grid">
              {papers.map((paper) => {
                const isSelected = selectedIds.includes(paper.id);
                const isDisabled =
                  !isSelected && selectedIds.length >= 3;

                return (
                  <button
                    type="button"
                    key={paper.id}
                    className={`compare-paper-card ${
                      isSelected ? "selected" : ""
                    } ${isDisabled ? "disabled" : ""}`}
                    onClick={() => handlePaperSelection(paper.id)}
                    disabled={isDisabled || comparing}
                  >
                    <div className="compare-card-top">
                      <div className="compare-file-icon">
                        <FileText size={22} />
                      </div>

                      <span
                        className={`compare-select-indicator ${
                          isSelected ? "checked" : ""
                        }`}
                      >
                        {isSelected && <Check size={15} />}
                      </span>
                    </div>

                    <h3>{paper.title}</h3>

                    <p>
                      {paper.authors} · {paper.year}
                    </p>

                    <span className="compare-card-status">
                      {isSelected ? "Selected" : "Select paper"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="compare-selection-footer">
            <p>
              {selectedIds.length < 2
                ? "Select at least two papers to start comparing."
                : `${selectedIds.length} papers are ready for comparison.`}
            </p>

            <button
              type="button"
              className="clear-selection-btn"
              onClick={handleClearSelection}
              disabled={selectedIds.length === 0 || comparing}
            >
              <X size={16} />
              Clear Selection
            </button>
          </div>
        </section>

        {/* Comparison Results */}
        <section className="comparison-results-section">
          <div className="comparison-results-heading">
            <div>
              <h2>Comparison Results</h2>
              <p>
                Side-by-side comparison of the selected research papers.
              </p>
            </div>

            <div className="comparison-heading-icon">
              <GitCompareArrows size={22} />
            </div>
          </div>

          {selectedPapers.length >= 2 ? (
            <>
              <div className="comparison-table-wrapper">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th className="comparison-field-heading">
                        Comparison Criteria
                      </th>

                      {selectedPapers.map((paper) => (
                        <th key={paper.id}>
                          <div className="comparison-paper-heading">
                            <FileText size={19} />

                            <div>
                              <h3>{paper.title}</h3>
                              <p>
                                {paper.authors} · {paper.year}
                              </p>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {comparisonFields.map((field) => (
                      <tr key={field.key}>
                        <td className="comparison-field-name">
                          {field.label}
                        </td>

                        {selectedPapers.map((paper) => (
                          <td key={paper.id}>
                            {getFieldValue(paper, field.key)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="ai-compare-action">
                <button
                  type="button"
                  className="ai-compare-btn"
                  onClick={handleCompare}
                  disabled={comparing}
                >
                  {comparing ? (
                    <>
                      <LoaderCircle className="upload-spinner" size={18} />
                      Analysing Papers...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Generate AI Comparison
                    </>
                  )}
                </button>

                <p>
                  Let AI identify meaningful similarities, differences,
                  and potential research directions.
                </p>
              </div>

              {comparisonError && (
                <p className="ai-comparison-error">
                  {comparisonError}
                </p>
              )}

              {/* AI-generated Insights */}
              {comparison && (
                <div className="ai-comparison-results">
                  <div className="ai-comparison-title">
                    <Sparkles size={23} />
                    <div>
                      <h2>AI Comparison Insights</h2>
                      <p>
                        Generated analysis based on your selected papers.
                      </p>
                    </div>
                  </div>

                  <div className="ai-insight-card">
                    <h3>Comparative Summary</h3>
                    <p>{comparison.summary}</p>
                  </div>

                  <div className="ai-insight-grid">
                    <div className="ai-insight-card">
                      <h3>Similarities</h3>
                      {renderList(comparison.similarities)}
                    </div>

                    <div className="ai-insight-card">
                      <h3>Key Differences</h3>
                      {renderList(comparison.differences)}
                    </div>

                    <div className="ai-insight-card">
                      <h3>Methodology Comparison</h3>
                      <p>{comparison.methodology_comparison}</p>
                    </div>

                    <div className="ai-insight-card">
                      <h3>Findings Comparison</h3>
                      <p>{comparison.findings_comparison}</p>
                    </div>

                    <div className="ai-insight-card">
                      <h3>Limitations Comparison</h3>
                      <p>{comparison.limitations_comparison}</p>
                    </div>

                    <div className="ai-insight-card research-direction-card">
                      <h3>Potential Research Direction</h3>
                      <p>{comparison.potential_research_direction}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="comparison-empty-state">
              <GitCompareArrows size={42} />

              <h3>Select Papers to Compare</h3>

              <p>
                Choose at least two research papers from the section
                above. Their comparison will appear here.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ComparePapers;
