import React, { useState } from "react";
import "./Login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Swal from "sweetalert2";

const Login = ({ onSwitch, onLogin }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token based on remember me preference
      if (form.remember) {
        localStorage.setItem('token', data.token);
      } else {
        sessionStorage.setItem('token', data.token);
      }

      // Store user info
      localStorage.setItem('user', JSON.stringify(data.user));

      Swal.fire({
        title: 'Login Successful!',
        text: `Welcome back, ${data.user.name}!`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      onLogin(); // This triggers dashboard view in App.js
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        title: 'Login Failed',
        text: error.message || 'Invalid credentials. Please try again.',
        icon: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <span className="uacs-logo">UACS</span>
      </div>
      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-logo">LOGO</div>
          <div className="login-input-container">
            <FaEnvelope className="login-input-icon" />
            <input
              className="login-input"
              type="email"
              name="email"
              placeholder="School Email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="login-input-container">
            <FaLock className="login-input-icon" />
            <input
              className="login-input"
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>
          <button className="login-btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          <div className="login-signup-link" style={{ marginTop: "1.2rem", textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <span
              onClick={onSwitch}
              style={{
                cursor: "pointer",
                color: "#e51d5e",
                textDecoration: "underline",
                fontWeight: 500,
              }}
            >
              Sign up
            </span>
          </div>
        </form>
      </div>
      <div className="login-accent" />
    </div>
  );
};

export default Login;