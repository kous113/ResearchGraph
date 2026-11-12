
import { Search, SlidersHorizontal } from "lucide-react";

function PaperFilters({
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
}) {
  const filters = ["All Papers", "Analysed", "Processing", "Failed"];

  return (
    <div className="paper-filters">
      <div className="paper-search">
        <Search size={19} />
        <input
          type="text"
          placeholder="Search by paper title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="paper-filter-options">
        <SlidersHorizontal size={18} />

        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${
              activeFilter === filter ? "filter-active" : ""
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PaperFilters;
