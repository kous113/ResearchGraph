
import { Link } from "react-router-dom";
import "../../styles/login.css";

function Login() {
  return (
    <div className="login-page">
      <div className="login-info">
        <Link to="/" className="login-brand">
          ResearchGraph
        </Link>

        <div className="login-info-content">
          <h1>Welcome Back to ResearchGraph</h1>
          <p>
            Continue exploring academic research, discover
            connections between papers, and uncover potential
            research gaps.
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

          <form className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>

              <Link to="/forgot-password">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="login-submit-btn">
              Sign In
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
