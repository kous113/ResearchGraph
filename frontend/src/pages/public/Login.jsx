
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

import "../../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginUser({ email, password });
      login(result);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-info">
        <Link to="/" className="login-brand">
          ResearchGraph
        </Link>

        <div className="login-info-content">
          <h1>Welcome Back to ResearchGraph</h1>
          <p>
            Continue exploring academic research, discover connections
            between papers, and uncover potential research gaps.
          </p>
        </div>

        <p className="login-info-footer">
          Making academic research more connected.
        </p>
      </div>

      <div className="login-form-section">
        <div className="login-form-container">
          <h2>Sign In</h2>
          <p className="login-subtitle">
            Enter your credentials to access your account.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>

              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="register-prompt">
            Don't have an account?{" "}
            <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
