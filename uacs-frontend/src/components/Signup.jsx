import React, { useState } from "react";
import uacsUndraw from "../assets/uacs_undraw.svg";
import "./Signup.css";
import Swal from "sweetalert2";
import { 
  FaUser, 
  FaEnvelope, 
  FaIdCard, 
  FaLock, 
  FaBell, 
  FaUserTie, 
  FaGraduationCap,
  FaVenusMars,
  FaChevronDown
} from "react-icons/fa";
import { MdPerson, MdEmail, MdLock, MdNotifications } from "react-icons/md";

const Signup = ({ onSwitch, onLogin }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    role: "",
    email: "",
    idNumber: "",
    password: "",
    confirmPassword: "",
    emailUpdates: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setSubmitting(true);
    try {
      // Map frontend fields to backend expectations
      const payload = {
        name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        email: form.email.trim(),
        password: form.password,
        role: (form.role || '').toLowerCase(), // Student/Faculty -> student/faculty
      };
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Registration failed");
      }
      await Swal.fire({
        title: "Registration successful",
        text: "You can now log in to your account.",
        icon: "success",
        confirmButtonText: "Go to Login",
      });
      onSwitch?.();
    } catch (err) {
      setError(err.message);
      Swal.fire({
        title: "Registration failed",
        text: err.message,
        icon: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signup-bg">
      <div className="signup-container">
        <div className="signup-left">
          <h1 className="signup-title">REGISTER</h1>
          <form className="signup-form" onSubmit={handleSubmit}>
            {error && (
              <div style={{ color: "#e11d48", marginBottom: "0.75rem", fontSize: 14 }}>{error}</div>
            )}
            <div className="signup-row">
              <div className="signup-input-container">
                <MdPerson className="signup-input-icon" />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  className="signup-input"
                  required
                />
              </div>
              <div className="signup-input-container">
                <MdPerson className="signup-input-icon" />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  className="signup-input"
                  required
                />
              </div>
            </div>
            <div className="signup-row">
              <div className="signup-input-container">
                <FaVenusMars className="signup-input-icon" />
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="signup-input signup-select"
                  required
                >
                  <option value="" disabled>Sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                <FaChevronDown className="signup-select-arrow" />
              </div>
              <div className="signup-input-container">
                <FaGraduationCap className="signup-input-icon" />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="signup-input signup-select"
                  required
                >
                  <option value="" disabled>Roles</option>
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                </select>
                <FaChevronDown className="signup-select-arrow" />
              </div>
            </div>
            <div className="signup-row">
              <div className="signup-input-container">
                <MdEmail className="signup-input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="School email (ua.edu.ph)"
                  value={form.email}
                  onChange={handleChange}
                  className="signup-input"
                  required
                />
              </div>
            </div>
            <div className="signup-row">
              <div className="signup-input-container">
                <FaIdCard className="signup-input-icon" />
                <input
                  type="text"
                  name="idNumber"
                  placeholder="Student/Faculty Number ID"
                  value={form.idNumber}
                  onChange={handleChange}
                  className="signup-input"
                  required
                />
              </div>
            </div>
            <div className="signup-row">
              <div className="signup-input-container">
                <MdLock className="signup-input-icon" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="signup-input"
                  required
                />
              </div>
              <div className="signup-input-container">
                <MdLock className="signup-input-icon" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="signup-input"
                  required
                />
              </div>
            </div>
            <div className="signup-row-checkbox">
              <label className="signup-checkbox-label">
                <input
                  type="checkbox"
                  name="emailUpdates"
                  checked={form.emailUpdates}
                  onChange={handleChange}
                  className="signup-checkbox"
                />
                <MdNotifications className="signup-checkbox-icon" />
                I would like to receive email updates and notifications from the School Clinic.
              </label>
            </div>
            <button type="submit" className="signup-btn" disabled={submitting}>
              {submitting ? "Creating account..." : "Signup"}
            </button>
          </form>
          <div className="signup-login-link">
            Already have an account?{" "}
            <span onClick={onSwitch} className="signup-login-link-highlight">
              Log in
            </span>
          </div>
        </div>
        <div className="signup-right">
          <img src={uacsUndraw} alt="Clinic Illustration" className="signup-illustration" />
        </div>
      </div>
    </div>
  );
};

export default Signup;