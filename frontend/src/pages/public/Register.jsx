
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

import "../../styles/register.css";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser({
        fullName,
        email,
        password,
      });

      login(result);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-info">
        <Link to="/" className="register-brand">
          ResearchGraph
        </Link>

        <div className="register-info-content">
          <h1>Start Your Research Journey</h1>
          <p>
            Create your account and bring your research papers together.
            Explore connections, compare methodologies, and discover
            potential research gaps.
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

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="registerEmail">Email Address</label>
              <input
                type="email"
                id="registerEmail"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <label className="terms-checkbox">
              <input type="checkbox" required />
              <span>
                I agree to the Terms of Service and Privacy Policy.
              </span>
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button
              type="submit"
              className="register-submit-btn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
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
