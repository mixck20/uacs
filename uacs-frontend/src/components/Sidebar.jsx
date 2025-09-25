import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ activePage, setActivePage, onSidebarToggle, isOpen, onLogout }) => {

  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "patients", label: "Patients" },
    { id: "ehr", label: "Electronic Health Records" },
    { id: "inventory", label: "Inventory" },
    { id: "appointment", label: "Appointment & Online Consultation" },
    { id: "email", label: "Email Notification System" }
  ];

  const toggleSidebar = () => {
    if (onSidebarToggle) {
      onSidebarToggle(!isOpen);
    }
  };

  const handleNavClick = (itemId) => {
    setActivePage(itemId);
    // Keep sidebar open for smoother navigation experience
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <button className="hamburger-btn" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* User Profile Section */}
        <div className="sidebar-profile">
          <div className="profile-placeholder"></div>
          <div className="profile-info">
            <h3 className="profile-name">Name</h3>
            <p className="profile-role">Clinic Staff</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div style={{ padding: "1rem" }}>
          <button
            className="nav-item"
            onClick={() => {
              try {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
              } catch {}
              if (onLogout) onLogout();
            }}
            style={{
              width: "100%",
              background: "#e11d48",
              color: "white",
              borderRadius: 8,
              marginTop: 8,
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;