
import { useEffect, useMemo, useState } from "react";

import {
  Lightbulb,
  Search,
  FileText,
  ArrowUpRight,
  Target,
  BookOpen,
  FlaskConical,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

import {
  getAllPapers,
  discoverResearchGaps,
} from "../../services/paperService";

import "../../styles/researchGaps.css";

function ResearchGaps() {
  const [gaps, setGaps] = useState([]);
  const [papersAnalyzed, setPapersAnalyzed] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedGap, setExpandedGap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadResearchGaps = async () => {
    try {
      setLoading(true);
      setError("");

      const papers = await getAllPapers();
      setPapersAnalyzed(papers.length);

      if (papers.length < 2) {
        setGaps([]);
        setError("Upload at least 2 research papers to discover potential research gaps.");
        return;
      }

      const result = await discoverResearchGaps();
      setGaps(result.gaps || []);
    } catch (err) {
      setGaps([]);
      setError(
        err.response?.data?.message ||
          "Unable to discover research gaps. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResearchGaps();
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(gaps.map((gap) => gap.category).filter(Boolean)),
    ];
  }, [gaps]);

  const recurringLimitations = useMemo(() => {
    const limitationCounts = {};

    gaps.forEach((gap) => {
      (gap.limitations || []).forEach((limitation) => {
        const key = limitation.trim().toLowerCase();

        if (key) {
          limitationCounts[key] = (limitationCounts[key] || 0) + 1;
        }
      });
    });

    return Object.values(limitationCounts).filter(
      (count) => count > 1
    ).length;
  }, [gaps]);

  const filteredGaps = useMemo(() => {
    return gaps.filter((gap) => {
      const matchesCategory =
        activeCategory === "All" || gap.category === activeCategory;

      const searchText = searchTerm.toLowerCase();

      const matchesSearch =
        (gap.title || "").toLowerCase().includes(searchText) ||
        (gap.description || "").toLowerCase().includes(searchText) ||
        (gap.category || "").toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [gaps, searchTerm, activeCategory]);

  const toggleExpanded = (gapId) => {
    setExpandedGap((current) =>
      current === gapId ? null : gapId
    );
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <Topbar />

      <main className="dashboard-main research-gaps-main">
        <div className="research-gaps-header">
          <div>
            <h1>Research Gaps</h1>
            <p>
              Explore potential research opportunities discovered
              across your research papers.
            </p>
          </div>

          <button
            type="button"
            className="ai-compare-btn"
            onClick={loadResearchGaps}
            disabled={loading}
          >
            <RefreshCw size={17} />
            {loading ? "Analysing Papers..." : "Discover Again"}
          </button>
        </div>

        <section className="gap-summary">
          <div className="gap-summary-icon">
            <Lightbulb size={25} />
          </div>

          <div>
            <h2>Discover what's missing in existing research</h2>
            <p>
              AI analyses unresolved problems, recurring limitations
              and unexplored areas across your uploaded papers to
              suggest potential research directions.
            </p>
          </div>
        </section>

        <section className="gap-stats">
          <div className="gap-stat-card">
            <div className="gap-stat-icon blue">
              <Lightbulb size={21} />
            </div>
            <div>
              <p>Potential Gaps</p>
              <h3>{loading ? "..." : gaps.length}</h3>
            </div>
          </div>

          <div className="gap-stat-card">
            <div className="gap-stat-icon orange">
              <AlertCircle size={21} />
            </div>
            <div>
              <p>Recurring Limitations</p>
              <h3>{loading ? "..." : recurringLimitations}</h3>
            </div>
          </div>

          <div className="gap-stat-card">
            <div className="gap-stat-icon green">
              <FileText size={21} />
            </div>
            <div>
              <p>Papers Analysed</p>
              <h3>{papersAnalyzed}</h3>
            </div>
          </div>
        </section>

        <section className="gap-discovery-section">
          <div className="gap-discovery-heading">
            <div>
              <h2>Identified Research Opportunities</h2>
              <p>
                Explore potential gaps and their supporting evidence.
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

          {loading ? (
            <div className="gap-no-results">
              <RefreshCw size={30} />
              <h3>Analysing your research papers</h3>
              <p>
                AI is examining the papers to identify potential
                research opportunities. This may take a little time.
              </p>
            </div>
          ) : error ? (
            <div className="gap-no-results">
              <AlertCircle size={32} />
              <h3>Research gap discovery unavailable</h3>
              <p>{error}</p>
              <button
                type="button"
                className="ai-compare-btn"
                onClick={loadResearchGaps}
              >
                Try Again
              </button>
            </div>
          ) : filteredGaps.length > 0 ? (
            <div className="research-gap-list">
              {filteredGaps.map((gap, index) => {
                const isExpanded = expandedGap === index;

                return (
                  <article
                    className="research-gap-card"
                    key={`${gap.title}-${index}`}
                  >
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

                      <span className="gap-type-tag">
                        {gap.tag}
                      </span>
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
                        {(gap.papers || []).map((paper, paperIndex) => (
                          <span key={paper.id || paperIndex}>
                            <FileText size={14} />
                            {paper.title}
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
                            {(gap.limitations || []).map(
                              (limitation, limitationIndex) => (
                                <li key={limitationIndex}>
                                  {limitation}
                                </li>
                              )
                            )}
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
                        {(gap.papers || []).length} supporting papers
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleExpanded(index)}
                      >
                        {isExpanded ? "Show Less" : "Explore Gap"}
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="gap-no-results">
              <Search size={32} />
              <h3>No research gaps found</h3>
              <p>
                {gaps.length === 0
                  ? "The uploaded papers did not provide enough evidence to identify potential research gaps."
                  : "Try another search term or category."}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ResearchGaps;
