import { BookOpen, Search, GitBranch } from "lucide-react";
import "../../styles/about.css";

function About() {
  return (
    <section className="about" id="about">
      <div className="about-content">
        <span className="about-label">ABOUT RESEARCHGRAPH</span>

        <h2>
          Research Is Connected.
          <br />
          Your Understanding Should Be Too.
        </h2>

        <p>
          ResearchGraph is designed to help students and researchers
          explore academic literature beyond individual research papers.
          Instead of reading papers in isolation, users can understand
          how different studies relate to one another.
        </p>

        <p>
          By analysing research problems, methodologies, findings,
          limitations, and citations, ResearchGraph creates a connected
          view of existing research and helps users explore potential
          directions for future studies.
        </p>
      </div>

      <div className="about-points">
        <div className="about-point">
          <BookOpen size={24} />
          <div>
            <h3>Understand Research</h3>
            <p>Explore the important information hidden inside papers.</p>
          </div>
        </div>

        <div className="about-point">
          <Search size={24} />
          <div>
            <h3>Find Relationships</h3>
            <p>Discover how different research studies are connected.</p>
          </div>
        </div>

        <div className="about-point">
          <GitBranch size={24} />
          <div>
            <h3>Explore New Directions</h3>
            <p>Identify potential research gaps backed by paper evidence.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;