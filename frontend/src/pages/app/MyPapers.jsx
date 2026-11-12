
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Upload,
  Eye,
  Trash2,
  CalendarDays,
  Users,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import PaperFilters from "../../components/common/PaperFilters";

import { getAllPapers, deletePaper } from "../../services/paperService";
import "../../styles/myPapers.css";

function MyPapers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Papers");
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  // Fetch papers from PostgreSQL
  const fetchPapers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllPapers();
      setPapers(data);
    } catch (err) {
      console.error("Fetch papers error:", err);
      setError("Failed to load papers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  // Search and filter
  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
      const analysis =
        typeof paper.analysis === "string"
          ? JSON.parse(paper.analysis)
          : paper.analysis;

      const authors = (analysis?.authors || []).join(", ");

      const matchesSearch =
        paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        authors.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        activeFilter === "All Papers" || activeFilter === "Analysed";

      return matchesSearch && matchesFilter;
    });
  }, [papers, searchTerm, activeFilter]);

  // Delete paper from database
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this paper?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deletePaper(id);

      setPapers((currentPapers) =>
        currentPapers.filter((paper) => paper.id !== id)
      );
    } catch (err) {
      console.error("Delete paper error:", err);
      alert("Failed to delete paper. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <Topbar />

      <main className="dashboard-main my-papers-main">
        <div className="my-papers-heading">
          <div>
            <h1>My Papers</h1>
            <p>Manage and explore your research paper collection.</p>
          </div>

          <Link to="/upload" className="upload-paper-btn">
            <Upload size={18} />
            Upload Paper
          </Link>
        </div>

        <div className="paper-summary">
          <div className="paper-summary-icon">
            <FileText size={23} />
          </div>

          <div>
            <p>Total Papers</p>
            <h2>{papers.length}</h2>
          </div>
        </div>

        <PaperFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <section className="my-papers-table-section">
          <div className="my-papers-table-header">
            <div>
              <h2>All Research Papers</h2>
              <p>
                Showing {filteredPapers.length} of {papers.length} papers
              </p>
            </div>
          </div>

          <div className="papers-table-container">
            <table className="papers-table my-papers-table">
              <thead>
                <tr>
                  <th>Paper Details</th>
                  <th>Authors</th>
                  <th>Upload Date</th>
                  <th>Analysis Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="no-papers">
                      Loading your papers...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="no-papers">
                      {error}
                    </td>
                  </tr>
                ) : filteredPapers.length > 0 ? (
                  filteredPapers.map((paper) => {
                    const analysis =
                      typeof paper.analysis === "string"
                        ? JSON.parse(paper.analysis)
                        : paper.analysis;

                    const authors = (analysis?.authors || []).join(", ");

                    return (
                      <tr key={paper.id}>
                        <td>
                          <div className="paper-title-cell">
                            <div className="paper-file-icon">
                              <FileText size={19} />
                            </div>
                            <span>{paper.title}</span>
                          </div>
                        </td>

                        <td>
                          <div className="paper-metadata">
                            <Users size={15} />
                            {authors || "Not identified"}
                          </div>
                        </td>

                        <td>
                          <div className="paper-metadata">
                            <CalendarDays size={15} />
                            {new Date(paper.uploaded_at).toLocaleDateString()}
                          </div>
                        </td>

                        <td>
                          <span className="paper-status status-analysed">
                            Analysed
                          </span>
                        </td>

                        <td>
                          <div className="paper-actions">
                            <button
                              className="paper-view-btn"
                              title="View paper"
                              onClick={() => navigate(`/papers/${paper.id}`)}
                            >
                              <Eye size={17} />
                            </button>

                            <button
                              className="paper-delete-btn"
                              title="Delete paper"
                              disabled={deletingId === paper.id}
                              onClick={() => handleDelete(paper.id)}
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="no-papers">
                      No papers found. Try changing your search or filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MyPapers;
