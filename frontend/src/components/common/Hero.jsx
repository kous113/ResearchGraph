import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  BrainCircuit,
  Network,
  Microscope,
} from "lucide-react";

import "../../styles/hero.css";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <span className="hero-label">
          RESEARCH INTELLIGENCE PLATFORM
        </span>

        <h1>
          Discover the Connections
          <br />
          Behind Research.
        </h1>

        <p>
          Explore research papers, understand their relationships,
          compare methodologies, and uncover potential research gaps
          with ResearchGraph.
        </p>

        <div className="hero-actions">
          <Link to="/register" className="hero-primary-btn">
            Get Started <ArrowRight size={18} />
          </Link>

          <a href="#features" className="hero-secondary-btn">
            Explore Features
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="graph-card">
          <div className="graph-card-header">
            <div>
              <span className="graph-card-label">RESEARCH NETWORK</span>
              <h3>Paper Connections</h3>
            </div>
            <Network size={22} />
          </div>

          <div className="graph-canvas">
            <svg className="graph-lines" viewBox="0 0 400 300">
              <line x1="200" y1="145" x2="90" y2="65" />
              <line x1="200" y1="145" x2="310" y2="65" />
              <line x1="200" y1="145" x2="85" y2="235" />
              <line x1="200" y1="145" x2="315" y2="235" />
              <line x1="90" y1="65" x2="310" y2="65" />
              <line x1="85" y1="235" x2="315" y2="235" />
            </svg>

            <div className="graph-node center-node">
              <BrainCircuit size={28} />
              <span>AI Research</span>
            </div>

            <div className="graph-node node-one">
              <FileText size={21} />
              <span>Paper 01</span>
            </div>

            <div className="graph-node node-two">
              <Microscope size={21} />
              <span>Paper 02</span>
            </div>

            <div className="graph-node node-three">
              <FileText size={21} />
              <span>Paper 03</span>
            </div>

            <div className="graph-node node-four">
              <FileText size={21} />
              <span>Paper 04</span>
            </div>
          </div>

          <div className="graph-card-footer">
            <span>5 Research Papers</span>
            <span>6 Connections</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;