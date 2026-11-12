
import { useState } from "react";
import {
  FileText,
  GitCompareArrows,
  Check,
  X,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import "../../styles/comparePapers.css";

// Mock research papers
// We will replace this with data from PostgreSQL later.
const papers = [
  {
    id: "p1",
    title: "A Survey on Large Language Models",
    authors: "Zhao et al.",
    year: 2023,
    problem: "Understanding the capabilities and limitations of large language models.",
    objectives: "To review LLM architectures, training techniques, applications and challenges.",
    topics: ["Large Language Models", "Natural Language Processing", "Generative AI"],
    methodology: "Comprehensive Literature Survey",
    dataset: "Previously published research papers and benchmark datasets.",
    findings: "LLMs demonstrate strong capabilities across multiple NLP tasks but still face reliability and reasoning challenges.",
    limitations: "High computational requirements, hallucinations and limited interpretability.",
  },
  {
    id: "p2",
    title: "Applications of NLP in Modern Systems",
    authors: "Smith et al.",
    year: 2022,
    problem: "Improving the accuracy and efficiency of natural language processing applications.",
    objectives: "To examine practical NLP applications and evaluate existing language processing techniques.",
    topics: ["Natural Language Processing", "Text Analysis", "Information Extraction"],
    methodology: "Experimental Analysis",
    dataset: "Text datasets collected from multiple NLP application domains.",
    findings: "NLP techniques improve information extraction, classification and automated text processing.",
    limitations: "Performance depends heavily on training data quality and domain-specific language.",
  },
  {
    id: "p3",
    title: "Transformer Architecture and Its Applications",
    authors: "Vaswani et al.",
    year: 2021,
    problem: "Improving sequence modelling and capturing long-range dependencies in deep learning.",
    objectives: "To investigate attention-based architectures and their applications in sequence modelling.",
    topics: ["Transformer Models", "Deep Learning", "Natural Language Processing"],
    methodology: "Transformer Architecture and Attention Mechanisms",
    dataset: "Machine translation and language modelling benchmark datasets.",
    findings: "Attention mechanisms improve sequence modelling and enable parallel processing.",
    limitations: "Large computational requirements and high memory consumption.",
  },
  {
    id: "p4",
    title: "Deep Learning Techniques for Text Analysis",
    authors: "Brown et al.",
    year: 2023,
    problem: "Enhancing automated text analysis and classification accuracy.",
    objectives: "To evaluate deep learning architectures for extracting useful information from text.",
    topics: ["Deep Learning", "Text Analysis", "Text Classification"],
    methodology: "Comparative Experimental Study",
    dataset: "Text classification datasets from different application domains.",
    findings: "Neural network architectures improve text classification and feature extraction.",
    limitations: "Requires large labelled datasets and substantial computational resources.",
  },
  {
    id: "p5",
    title: "A Study on Text Classification Methods",
    authors: "Johnson et al.",
    year: 2020,
    problem: "Improving text classification accuracy across different datasets.",
    objectives: "To compare traditional machine learning and deep learning classification methods.",
    topics: ["Text Classification", "Machine Learning", "Text Analysis"],
    methodology: "Comparative Study",
    dataset: "Benchmark text classification datasets.",
    findings: "Hybrid approaches can improve classification performance in certain scenarios.",
    limitations: "Limited generalization across domains and dependence on dataset characteristics.",
  },
  {
    id: "p6",
    title: "Generative AI and Future Research Directions",
    authors: "Lee et al.",
    year: 2024,
    problem: "Identifying challenges and opportunities in generative artificial intelligence.",
    objectives: "To examine generative AI applications, limitations and future research directions.",
    topics: ["Generative AI", "Large Language Models", "Artificial Intelligence"],
    methodology: "Literature Review",
    dataset: "Published generative AI research and application studies.",
    findings: "Generative AI presents opportunities in content generation, automation and research assistance.",
    limitations: "Hallucination, ethical concerns, bias and reliability remain significant challenges.",
  },
];

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
  const [selectedIds, setSelectedIds] = useState(["p1", "p2"]);

  const selectedPapers = papers.filter((paper) =>
    selectedIds.includes(paper.id)
  );

  const handlePaperSelection = (paperId) => {
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

  const getFieldValue = (paper, key) => {
    const value = paper[key];

    if (Array.isArray(value)) {
      return value.join(", ");
    }

    return value || "Not available";
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
                  disabled={isDisabled}
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

                  <p>{paper.authors} · {paper.year}</p>

                  <span className="compare-card-status">
                    {isSelected ? "Selected" : "Select paper"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="compare-selection-footer">
            <p>
              {selectedIds.length < 2
                ? "Select at least one more paper to start comparing."
                : `${selectedIds.length} papers are ready for comparison.`}
            </p>

            <button
              type="button"
              className="clear-selection-btn"
              onClick={() => setSelectedIds([])}
              disabled={selectedIds.length === 0}
            >
              <X size={16} />
              Clear Selection
            </button>
          </div>
        </section>

        {/* Comparison Table */}
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
