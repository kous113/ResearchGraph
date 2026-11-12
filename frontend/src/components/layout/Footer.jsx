import { Link } from "react-router-dom";
import { Network } from "lucide-react";
import "../../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <Network size={26} />
            <span>ResearchGraph</span>
          </Link>

          <p>
            Explore academic research, discover connections,
            compare papers, and uncover potential research gaps.
          </p>
        </div>

        <div className="footer-links">
          <h3>Explore</h3>
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About Us</a>
        </div>

        <div className="footer-links">
          <h3>Account</h3>
          <Link to="/login">Login</Link>
          <Link to="/register">Get Started</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ResearchGraph. All rights reserved.</p>
        <p>Built to make research more connected.</p>
      </div>
    </footer>
  );
}

export default Footer;
