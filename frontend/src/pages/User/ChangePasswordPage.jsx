import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../styles/ForgotPassword.css"; // reuse the same styling

export default function ChangePasswordPage() {
  const { token } = useParams(); // extract reset token from URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Your password has been successfully updated!");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || "Failed to update password.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        {/* Logo */}
        <div className="logo-section">
          <img src="/logo.png" alt="Aurevra Logo" className="auth-logo" />
          <h1 className="brand-name">AUREVRA</h1>
          <p className="brand-subtitle">JEWELRY</p>
        </div>

        {/* Change Password Card */}
        <div className="forgot-password-card">
          <div className="card-header">
            <div className="header-accent"></div>
            <h2>RESET PASSWORD</h2>
          </div>

          <div className="card-body">
            <p className="instruction-text">
              Enter your new password below.
            </p>

            {message && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                {message}
              </div>
            )}

            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "UPDATING..." : "UPDATE PASSWORD"}
              </button>
            </form>

            <div className="back-to-login">
              <Link to="/user/login" className="link-text">
                <i className="fas fa-arrow-left"></i> Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
