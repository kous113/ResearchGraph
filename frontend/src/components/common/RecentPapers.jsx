
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowUpRight } from "lucide-react";

import { getAllPapers } from "../../services/paperService";

function RecentPapers() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPapers = async () => {
      try {
        const data = await getAllPapers();
        setPapers(data.slice(0, 4));
      } catch (error) {
        console.error("Recent papers error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPapers();
  }, []);

  return (
    <section className="recent-papers-section">
      <div className="section-header">
        <div>
          <h2>Recent Papers</h2>
          <p>Your recently uploaded research papers</p>
        </div>

        <Link to="/papers" className="view-all-link">
          View All <ArrowUpRight size={17} />
        </Link>
      </div>

      <div className="papers-table-container">
        <table className="papers-table">
          <thead>
            <tr>
              <th>Paper</th>
              <th>Authors</th>
              <th>Upload Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="no-papers">
                  Loading recent papers...
                </td>
              </tr>
            ) : papers.length > 0 ? (
              papers.map((paper) => {
                const analysis =
                  typeof paper.analysis === "string"
                    ? JSON.parse(paper.analysis)
                    : paper.analysis;

                const authors = (analysis?.authors || []).join(", ");

                return (
                  <tr key={paper.id}>
                    <td>
                      <Link
                        to={`/papers/${paper.id}`}
                        className="paper-title-cell"
                      >
                        <div className="paper-file-icon">
                          <FileText size={19} />
                        </div>
                        <span>{paper.title}</span>
                      </Link>
                    </td>

                    <td>{authors || "Not identified"}</td>

                    <td>
                      {new Date(paper.uploaded_at).toLocaleDateString()}
                    </td>

                    <td>
                      <span className="paper-status status-analysed">
                        Analysed
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="no-papers">
                  No papers uploaded yet. Upload your first research paper!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RecentPapers;
