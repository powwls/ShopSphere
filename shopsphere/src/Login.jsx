import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const USERS_KEY = "shopsphereUsers";
const CURRENT_USER_KEY = "shopsphereCurrentUser";

function Login({ setCurrentUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password.");
      }

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data));
      setCurrentUser(data);
      navigate("/");
    } catch (error) {
      setError(error.message || "Invalid email or password.");
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-container">
        <div className="auth-welcome">
          <div className="auth-brand">ShopSphere</div>

          <div className="auth-welcome-content">
            <p className="auth-subtitle">WELCOME BACK</p>
            <h1>
              Shop smarter.
              <br />
              Live better.
            </h1>
            <p>
              Sign in to continue shopping, manage your orders, wishlist,
              and account.
            </p>
          </div>
        </div>

        <div className="auth-form-section">
          <div className="auth-form-container">
            <h2>Welcome Back!</h2>
            <p className="auth-description">Sign in to your ShopSphere account.</p>

            {error && <div className="auth-error">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-input-group">
                <label>Email Address</label>
                <div className="auth-input-wrapper">
                  <Mail size={19} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label>Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={19} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <div className="auth-options">
                <Link to="/forgot-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="auth-submit-button">
                <LogIn size={19} />
                Sign In
              </button>
            </form>

            <p className="auth-switch">
              Don&apos;t have an account?
              <Link to="/signup">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;