
import { Link } from "react-router-dom";
import "../../styles/register.css";

function Register() {
  return (
    <div className="register-page">
      <div className="register-info">
        <Link to="/" className="register-brand">
          ResearchGraph
        </Link>

        <div className="register-info-content">
          <h1>Start Your Research Journey</h1>
          <p>
            Create your account and bring your research papers
            together. Explore connections, compare methodologies,
            and discover potential research gaps.
          </p>
        </div>

        <p className="register-info-footer">
          Making academic research more connected.
        </p>
      </div>

      <div className="register-form-section">
        <div className="register-form-container">
          <h2>Create Account</h2>
          <p className="register-subtitle">
            Enter your details to get started with ResearchGraph.
          </p>

          <form
            className="register-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="registerEmail">Email Address</label>
              <input
                type="email"
                id="registerEmail"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="registerPassword">Password</label>
              <input
                type="password"
                id="registerPassword"
                placeholder="Create a password"
                minLength="8"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Re-enter your password"
                minLength="8"
                required
              />
            </div>

            <label className="terms-checkbox">
              <input type="checkbox" required />
              <span>
                I agree to the Terms of Service and Privacy Policy.
              </span>
            </label>

            <button type="submit" className="register-submit-btn">
              Create Account
            </button>
          </form>

          <p className="login-prompt">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
