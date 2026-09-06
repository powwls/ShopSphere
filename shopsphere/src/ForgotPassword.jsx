import { useState } from "react";
import { KeyRound, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resetRequested, setResetRequested] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function requestResetCode(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Unable to create reset code.");

      setMessage(data.message);
      setResetRequested(true);
    } catch (requestError) {
      setError(requestError.message || "Unable to create reset code.");
    }
  }

  async function resetPassword(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Unable to reset password.");

      setMessage(`${data.message}. You can now sign in.`);
      setResetToken("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (requestError) {
      setError(requestError.message || "Unable to reset password.");
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-container forgot-password-container">
        <div className="auth-welcome">
          <div className="auth-brand">ShopSphere</div>
          <div className="auth-welcome-content">
            <p className="auth-subtitle">ACCOUNT RECOVERY</p>
            <h1>Get back<br />to shopping.</h1>
            <p>Request a secure reset code and create a new password.</p>
          </div>
        </div>

        <div className="auth-form-section">
          <div className="auth-form-container">
            <h2>Forgot Password?</h2>
            <p className="auth-description">Enter your email to request a reset code.</p>
            {error && <div className="auth-error">{error}</div>}
            {message && <div className="auth-success">{message}</div>}

            <form className="auth-form" onSubmit={requestResetCode}>
              <div className="auth-input-group">
                <label>Email Address</label>
                <div className="auth-input-wrapper">
                  <Mail size={19} />
                  <input type="email" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                </div>
              </div>
              <button type="submit" className="auth-submit-button">
                <KeyRound size={19} /> Request Reset Code
              </button>
            </form>

            {resetRequested && (
              <form className="auth-form reset-password-form" onSubmit={resetPassword}>
                <div className="auth-input-group">
                  <label>Reset Code</label>
                  <div className="auth-input-wrapper">
                    <KeyRound size={19} />
                    <input value={resetToken} onChange={(event) => setResetToken(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Enter the 6-digit code from Gmail" inputMode="numeric" maxLength={6} required />
                  </div>
                </div>
                <div className="auth-input-group">
                  <label>New Password</label>
                  <div className="auth-input-wrapper">
                    <Lock size={19} />
                    <input type={showPassword ? "text" : "password"} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={6} required />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle new password visibility">
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </div>
                <div className="auth-input-group">
                  <label>Confirm Password</label>
                  <div className="auth-input-wrapper">
                    <Lock size={19} />
                    <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={6} required />
                    <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword((value) => !value)} aria-label="Toggle confirmed password visibility">
                      {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="auth-submit-button">Reset Password</button>
              </form>
            )}

            <p className="auth-switch"><Link to="/login">Back to Sign In</Link></p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;
