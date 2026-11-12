
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";

import CytoscapeComponent from "react-cytoscapejs";

import {
  Network,
  FileText,
  ZoomIn,
  ZoomOut,
  Maximize,
  X,
  BookOpen,
  Target,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

import {
  getAllPapers,
  getPaperRelationships,
} from "../../services/paperService";

import "../../styles/researchGraph.css";

const graphStyles = [
  {
    selector: "node",
    style: {
      label: "data(label)",
      width: 115,
      height: 115,
      "background-color": "#eaf1f8",
      "border-width": 3,
      "border-color": "#4d82b5",
      color: "#16345c",
      "font-size": 11,
      "font-weight": 600,
      "text-wrap": "wrap",
      "text-max-width": 95,
      "text-valign": "center",
      "text-halign": "center",
      "text-margin-y": 0,
    },
  },
  {
    selector: "node:selected",
    style: {
      "background-color": "#d4e7f8",
      "border-color": "#163c65",
      "border-width": 5,
    },
  },
  {
    selector: "edge",
    style: {
      width: 3,
      "curve-style": "bezier",
      "line-color": "#94a3b8",
      "target-arrow-shape": "none",
      opacity: 0.8,
    },
  },
  {
    selector: 'edge[type = "topic"]',
    style: {
      "line-color": "#4387c5",
    },
  },
  {
    selector: 'edge[type = "problem"]',
    style: {
      "line-color": "#2d9b73",
    },
  },
  {
    selector: 'edge[type = "methodology"]',
    style: {
      "line-color": "#d28a37",
    },
  },
];

function ResearchGraph() {
  const [papers, setPapers] = useState([]);
  const [relationships, setRelationships] = useState([]);

  const [selectedPaper, setSelectedPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    topic: true,
    problem: true,
    methodology: true,
  });

  const cyRef = useRef(null);
  const graphPapersRef = useRef([]);

  // Fetch papers and their saved relationships.
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setLoading(true);
        setError("");

        const [paperData, relationshipData] = await Promise.all([
          getAllPapers(),
          getPaperRelationships(),
        ]);

        setPapers(paperData);
        setRelationships(relationshipData);
      } catch (err) {
        console.error("Research graph error:", err);
        setError("Failed to load research graph data.");
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, []);

  // Convert database records into graph nodes.
  const graphPapers = useMemo(() => {
    return papers.map((paper) => {
      const analysis =
        typeof paper.analysis === "string"
          ? JSON.parse(paper.analysis)
          : paper.analysis || {};

      return {
        id: String(paper.id),
        title: paper.title,
        authors: (analysis.authors || []).join(", "),
        year: analysis.publication_year || "Not identified",
        topic: (analysis.topics || []).join(", ") || "Not identified",
        problem: analysis.research_problem || "Not identified",
        methodology: analysis.methodology || "Not identified",
        description:
          analysis.research_problem || "No research problem available.",
        dataset: analysis.dataset || "Not identified",
        findings: analysis.findings || [],
        limitations: analysis.limitations || [],
      };
    });
  }, [papers]);

  // Keep the latest papers available to Cytoscape event handlers.
  graphPapersRef.current = graphPapers;

  // Generate actual graph nodes and edges.
  const elements = useMemo(() => {
    const nodes = graphPapers.map((paper) => ({
      data: {
        id: paper.id,
        label: paper.title,
      },
    }));

    const paperIds = new Set(graphPapers.map((paper) => paper.id));

    const edges = relationships
      .filter(
        (relationship) =>
          filters[relationship.relationship_type] &&
          paperIds.has(String(relationship.source_paper_id)) &&
          paperIds.has(String(relationship.target_paper_id))
      )
      .map((relationship) => ({
        data: {
          id: String(relationship.id),
          source: String(relationship.source_paper_id),
          target: String(relationship.target_paper_id),
          type: relationship.relationship_type,
          description: relationship.description,
        },
      }));

    return [...nodes, ...edges];
  }, [graphPapers, relationships, filters]);

  // Handle node selection.
  const handleGraphReady = useCallback((cy) => {
    if (cyRef.current === cy) return;

    cyRef.current = cy;

    cy.on("tap", "node", (event) => {
      const paperId = event.target.id();

      const paper = graphPapersRef.current.find(
        (item) => item.id === paperId
      );

      setSelectedPaper(paper || null);
    });

    cy.on("tap", (event) => {
      if (event.target === cy) {
        setSelectedPaper(null);
      }
    });
  }, []);

  const toggleFilter = (type) => {
    setFilters((current) => ({
      ...current,
      [type]: !current[type],
    }));
  };

  const handleResetView = () => {
    if (cyRef.current) {
      cyRef.current.fit(undefined, 45);
    }
  };

  const handleZoomIn = () => {
    if (cyRef.current) {
      const cy = cyRef.current;

      cy.zoom({
        level: cy.zoom() * 1.2,
        renderedPosition: {
          x: cy.width() / 2,
          y: cy.height() / 2,
        },
      });
    }
  };

  const handleZoomOut = () => {
    if (cyRef.current) {
      const cy = cyRef.current;

      cy.zoom({
        level: cy.zoom() / 1.2,
        renderedPosition: {
          x: cy.width() / 2,
          y: cy.height() / 2,
        },
      });
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <Topbar />

      <main className="dashboard-main research-graph-main">
        <div className="research-graph-heading">
          <div>
            <h1>Research Graph</h1>
            <p>
              Explore relationships and connections between your research papers.
            </p>
          </div>

          <div className="graph-count">
            <Network size={18} />
            <span>{papers.length} Papers</span>
            <span className="graph-count-divider">|</span>
            <span>{relationships.length} Connections</span>
          </div>
        </div>

        <div className="graph-workspace">
          <section className="graph-panel">
            <div className="graph-panel-header">
              <div>
                <h2>Paper Relationship Network</h2>
                <p>Select any paper node to explore its details.</p>
              </div>

              <div className="graph-controls">
                <button onClick={handleZoomIn} title="Zoom in">
                  <ZoomIn size={18} />
                </button>

                <button onClick={handleZoomOut} title="Zoom out">
                  <ZoomOut size={18} />
                </button>

                <button onClick={handleResetView} title="Fit graph">
                  <Maximize size={17} />
                </button>
              </div>
            </div>

            <div className="graph-canvas">
              {loading ? (
                <p>Loading your research graph...</p>
              ) : error ? (
                <p>{error}</p>
              ) : papers.length === 0 ? (
                <p>Upload research papers to start building your graph.</p>
              ) : (
                <CytoscapeComponent
                  elements={elements}
                  stylesheet={graphStyles}
                  layout={{
                    name: "cose",
                    animate: false,
                    randomize: true,
                    nodeRepulsion: 7000,
                    idealEdgeLength: 170,
                    componentSpacing: 120,
                    padding: 45,
                  }}
                  cy={handleGraphReady}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  minZoom={0.4}
                  maxZoom={2.5}
                />
              )}
            </div>

            <div className="graph-legend">
              <span>
                <i className="legend-dot topic-dot"></i>
                Topic Similarity
              </span>

              <span>
                <i className="legend-dot problem-dot"></i>
                Research Problem
              </span>

              <span>
                <i className="legend-dot methodology-dot"></i>
                Methodology
              </span>
            </div>
          </section>

          <aside className="graph-sidebar">
            <div className="graph-filter-card">
              <h3>Relationship Filters</h3>
              <p>Choose which connections to display.</p>

              <label className="graph-filter-option">
                <input
                  type="checkbox"
                  checked={filters.topic}
                  onChange={() => toggleFilter("topic")}
                />
                <span className="filter-color topic-dot"></span>
                <span>Topic Similarity</span>
              </label>

              <label className="graph-filter-option">
                <input
                  type="checkbox"
                  checked={filters.problem}
                  onChange={() => toggleFilter("problem")}
                />
                <span className="filter-color problem-dot"></span>
                <span>Research Problem</span>
              </label>

              <label className="graph-filter-option">
                <input
                  type="checkbox"
                  checked={filters.methodology}
                  onChange={() => toggleFilter("methodology")}
                />
                <span className="filter-color methodology-dot"></span>
                <span>Methodology</span>
              </label>
            </div>

            <div className="graph-paper-card">
              {selectedPaper ? (
                <>
                  <div className="graph-paper-card-header">
                    <h3>Paper Details</h3>

                    <button
                      onClick={() => setSelectedPaper(null)}
                      title="Close details"
                    >
                      <X size={17} />
                    </button>
                  </div>

                  <div className="graph-paper-icon">
                    <FileText size={23} />
                  </div>

                  <h4>{selectedPaper.title}</h4>

                  <p className="graph-paper-authors">
                    {selectedPaper.authors || "Authors not identified"}
                  </p>

                  <div className="graph-paper-meta">
                    <span>Publication Year</span>
                    <strong>{selectedPaper.year}</strong>
                  </div>

                  <div className="graph-paper-meta">
                    <span>Topic</span>
                    <strong>{selectedPaper.topic}</strong>
                  </div>

                  <div className="graph-paper-meta">
                    <span>Methodology</span>
                    <strong>{selectedPaper.methodology}</strong>
                  </div>

                  <div className="graph-paper-description">
                    <span>Research Problem</span>
                    <p>{selectedPaper.description}</p>
                  </div>

                  <div className="graph-paper-description">
                    <span>Dataset</span>
                    <p>{selectedPaper.dataset}</p>
                  </div>
                </>
              ) : (
                <div className="graph-empty-selection">
                  <div>
                    <BookOpen size={25} />
                  </div>

                  <h3>No Paper Selected</h3>

                  <p>
                    Click on any node in the graph to view its research
                    information.
                  </p>
                </div>
              )}
            </div>

            <div className="graph-help-card">
              <div>
                <Target size={19} />
                <h3>How to Explore</h3>
              </div>

              <p>
                Select a node to inspect a paper. Use the relationship
                filters to focus on specific types of connections.
                You can also zoom and drag nodes around the graph.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default ResearchGraph;
