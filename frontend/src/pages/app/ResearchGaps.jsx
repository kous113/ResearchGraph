
import { useMemo, useState } from "react";
import {
  Lightbulb,
  Search,
  FileText,
  ArrowUpRight,
  Target,
  BookOpen,
  FlaskConical,
  AlertCircle,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import "../../styles/researchGaps.css";

// Mock research gaps.
// These examples will later be generated from actual paper analysis.
const researchGaps = [
  {
    id: 1,
    title: "Reducing Hallucinations in Large Language Models",
    category: "Large Language Models",
    description:
      "Several papers discuss the limitations of large language models, particularly their tendency to generate inaccurate or unsupported information. More work is needed to improve factual reliability.",
    reason:
      "Existing approaches still struggle to consistently verify generated information, especially in specialized domains.",
    direction:
      "Explore retrieval-augmented generation, external knowledge verification and techniques for measuring factual consistency.",
    papers: [
      "A Survey on Large Language Models",
      "Generative AI and Future Research Directions",
    ],
    limitations: [
      "LLMs may generate incorrect information with high confidence.",
      "Reliability remains challenging in domain-specific applications.",
    ],
    tag: "Reliability",
  },
  {
    id: 2,
    title: "Improving Generalization Across Different Text Domains",
    category: "Natural Language Processing",
    description:
      "Research on text classification shows that models trained on one domain may not perform equally well on another domain.",
    reason:
      "Many approaches depend on domain-specific training data and may lose accuracy when applied to unfamiliar datasets.",
    direction:
      "Investigate domain adaptation, transfer learning and methods that reduce dependence on large labelled datasets.",
    papers: [
      "A Study on Text Classification Methods",
      "Applications of NLP in Modern Systems",
    ],
    limitations: [
      "Limited generalization across different domains.",
      "Performance depends on the quality and availability of labelled data.",
    ],
    tag: "Generalization",
  },
  {
    id: 3,
    title: "Reducing Computational Costs of Transformer Models",
    category: "Deep Learning",
    description:
      "Transformer-based models provide strong performance but can require substantial memory and computational resources.",
    reason:
      "High resource requirements can make it difficult to deploy these models in low-resource environments.",
    direction:
      "Explore model compression, efficient attention mechanisms, quantization and lightweight architectures.",
    papers: [
      "Transformer Architecture and Its Applications",
      "A Survey on Large Language Models",
    ],
    limitations: [
      "High computational and memory requirements.",
      "Deployment can be difficult in resource-constrained environments.",
    ],
    tag: "Efficiency",
  },
  {
    id: 4,
    title: "Improving Interpretability of Deep Learning Models",
    category: "Deep Learning",
    description:
      "Deep learning models can produce accurate predictions, but understanding why a model made a particular decision remains difficult.",
    reason:
      "Limited interpretability can reduce trust and make it harder to identify errors in model predictions.",
    direction:
      "Investigate explainable AI techniques, feature attribution and interpretable model architectures.",
    papers: [
      "Deep Learning Techniques for Text Analysis",
      "A Survey on Large Language Models",
    ],
    limitations: [
      "Limited interpretability of complex neural architectures.",
      "Difficulties explaining individual model predictions.",
    ],
    tag: "Explainability",
  },
];

function ResearchGaps() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedGap, setExpandedGap] = useState(null);

  const categories = [
    "All",
    "Large Language Models",
    "Natural Language Processing",
    "Deep Learning",
  ];

  const filteredGaps = useMemo(() => {
    return researchGaps.filter((gap) => {
      const matchesCategory =
        activeCategory === "All" || gap.category === activeCategory;

      const searchText = searchTerm.toLowerCase();

      const matchesSearch =
        gap.title.toLowerCase().includes(searchText) ||
        gap.description.toLowerCase().includes(searchText) ||
        gap.category.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  const toggleExpanded = (gapId) => {
    setExpandedGap((current) => (current === gapId ? null : gapId));
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <Topbar />

      <main className="dashboard-main research-gaps-main">
        {/* Page Header */}
        <div className="research-gaps-header">
          <div>
            <h1>Research Gaps</h1>
            <p>
              Explore potential research opportunities discovered
              across your research papers.
            </p>
          </div>
        </div>

        {/* Summary */}
        <section className="gap-summary">
          <div className="gap-summary-icon">
            <Lightbulb size={25} />
          </div>

          <div>
            <h2>Discover what's missing in existing research</h2>
            <p>
              Research gaps highlight unresolved problems, recurring
              limitations and areas that may need further investigation.
            </p>
          </div>
        </section>

        {/* Statistics */}
        <section className="gap-stats">
          <div className="gap-stat-card">
            <div className="gap-stat-icon blue">
              <Lightbulb size={21} />
            </div>
            <div>
              <p>Potential Gaps</p>
              <h3>08</h3>
            </div>
          </div>

          <div className="gap-stat-card">
            <div className="gap-stat-icon orange">
              <AlertCircle size={21} />
            </div>
            <div>
              <p>Recurring Limitations</p>
              <h3>14</h3>
            </div>
          </div>

          <div className="gap-stat-card">
            <div className="gap-stat-icon green">
              <FileText size={21} />
            </div>
            <div>
              <p>Papers Analysed</p>
              <h3>18</h3>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="gap-discovery-section">
          <div className="gap-discovery-heading">
            <div>
              <h2>Identified Research Opportunities</h2>
              <p>
                Browse potential gaps and explore their supporting evidence.
              </p>
            </div>
          </div>

          <div className="gap-search-filter">
            <div className="gap-search-box">
              <Search size={19} />
              <input
                type="text"
                placeholder="Search research gaps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="gap-category-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={
                    activeCategory === category ? "active" : ""
                  }
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Research Gap Cards */}
          <div className="research-gap-list">
            {filteredGaps.length > 0 ? (
              filteredGaps.map((gap) => {
                const isExpanded = expandedGap === gap.id;

                return (
                  <article className="research-gap-card" key={gap.id}>
                    <div className="research-gap-card-header">
                      <div className="gap-title-area">
                        <div className="gap-card-icon">
                          <Lightbulb size={22} />
                        </div>

                        <div>
                          <span className="gap-category">
                            {gap.category}
                          </span>
                          <h3>{gap.title}</h3>
                        </div>
                      </div>

                      <span className="gap-type-tag">{gap.tag}</span>
                    </div>

                    <div className="gap-description">
                      <p>{gap.description}</p>
                    </div>

                    <div className="gap-evidence">
                      <div className="gap-evidence-heading">
                        <BookOpen size={17} />
                        <h4>Supporting Papers</h4>
                      </div>

                      <div className="gap-paper-list">
                        {gap.papers.map((paper, index) => (
                          <span key={index}>
                            <FileText size={14} />
                            {paper}
                          </span>
                        ))}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="gap-expanded-details">
                        <div className="gap-detail-block">
                          <h4>
                            <Target size={17} />
                            Why is this a potential gap?
                          </h4>
                          <p>{gap.reason}</p>
                        </div>

                        <div className="gap-detail-block">
                          <h4>
                            <AlertCircle size={17} />
                            Recurring Limitations
                          </h4>

                          <ul>
                            {gap.limitations.map((limitation, index) => (
                              <li key={index}>{limitation}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="gap-detail-block">
                          <h4>
                            <FlaskConical size={17} />
                            Suggested Research Direction
                          </h4>
                          <p>{gap.direction}</p>
                        </div>
                      </div>
                    )}

                    <div className="research-gap-card-footer">
                      <span>
                        <FileText size={15} />
                        {gap.papers.length} supporting papers
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleExpanded(gap.id)}
                      >
                        {isExpanded ? "Show Less" : "Explore Gap"}
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="gap-no-results">
                <Search size={32} />
                <h3>No research gaps found</h3>
                <p>Try another search term or category.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ResearchGaps;
