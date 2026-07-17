import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin =
    user &&
    (user.role === "admin" || user.role === "hod" || user.role === "principal");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "linear-gradient(90deg,#3b82f6,#9333ea)",
        padding: "14px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
        position: "sticky",
        top: 0,
        zIndex: 999,
        boxShadow: "0px 5px 15px rgba(0,0,0,0.2)"
      }}
    >
      {/* Logo */}
      <h2 style={{ margin: 0, fontWeight: "800", cursor: "pointer" }} onClick={() => navigate("/")}>
        CampusEvents
      </h2>

      {/* Links */}
      <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
        <Link style={linkStyle} to="/">Home</Link>
        <Link style={linkStyle} to="/events">Events</Link>
        <Link style={linkStyle} to="/reviews">Reviews</Link>
        <Link style={linkStyle} to="/about">About</Link>
        <Link style={linkStyle} to="/contact">Contact</Link>

        {!user && (
          <>
            <Link style={linkStyle} to="/login">Login</Link>
            <Link style={linkStyle} to="/register">Register</Link>
          </>
        )}

        {user && (
          <>
            <span style={{ fontWeight: "600" }}>
              Hi, {user.fullName}
            </span>

            {isAdmin && (
              <Link style={adminStyle} to="/admin">
                Admin Panel
              </Link>
            )}

            <button style={logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "15px"
};

const adminStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "700",
  fontSize: "15px",
  padding: "8px 14px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.2)"
};

const logoutBtn = {
  background: "white",
  color: "#111",
  border: "none",
  padding: "8px 14px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700"
};