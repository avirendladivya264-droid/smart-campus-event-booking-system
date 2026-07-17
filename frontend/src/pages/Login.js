import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { API } from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
        adminKey: isAdminLogin ? adminKey : "",
      });

      if (res.data.msg === "User not found") { alert("User not found ❌"); setLoading(false); return; }
      if (res.data.msg === "Wrong password") { alert("Wrong password ❌"); setLoading(false); return; }
      if (res.data.msg === "Invalid admin key") { alert("Invalid Admin Key ❌"); setLoading(false); return; }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin" || res.data.user.role === "hod" || res.data.user.role === "principal") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert("Login Failed ❌");
    }
    setLoading(false);
  };

  return (
    <div style={styles.bg}>
      {/* Decorative blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={styles.card}
      >
        <div style={styles.logoRow}>
          <span style={styles.logoIcon}>🎓</span>
          <span style={styles.logoText}>SmartCampus</span>
        </div>

        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to your account</p>

        <form onSubmit={handleLogin}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="you@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.checkRow}>
            <label style={styles.checkLabel}>
              <input
                type="checkbox"
                checked={isAdminLogin}
                onChange={() => setIsAdminLogin(!isAdminLogin)}
                style={{ marginRight: 8, accentColor: "#6366f1" }}
              />
              Login as Admin
            </label>
          </div>

          {isAdminLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              style={styles.field}
            >
              <label style={styles.label}>Admin Key</label>
              <input
                type="password"
                placeholder="Enter secret admin key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                style={{ ...styles.input, borderColor: "#6366f1" }}
                required
              />
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            style={styles.btn}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </motion.button>
        </form>

        <p style={styles.footer}>
          New here?{" "}
          <Link to="/register" style={styles.link}>
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "absolute", top: "-80px", left: "-80px",
    width: 300, height: 300,
    background: "radial-gradient(circle, rgba(99,102,241,0.3), transparent)",
    borderRadius: "50%", filter: "blur(60px)",
  },
  blob2: {
    position: "absolute", bottom: "-80px", right: "-80px",
    width: 350, height: 350,
    background: "radial-gradient(circle, rgba(168,85,247,0.25), transparent)",
    borderRadius: "50%", filter: "blur(70px)",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 24,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
    position: "relative",
    zIndex: 1,
  },
  logoRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 24 },
  logoIcon: { fontSize: 28 },
  logoText: { fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" },
  title: { fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 6px" },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 28 },
  field: { marginBottom: 18 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 6 },
  input: {
    width: "100%", padding: "12px 14px", borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.07)", color: "#fff",
    fontSize: 15, outline: "none", boxSizing: "border-box",
    transition: "border 0.2s",
  },
  checkRow: { marginBottom: 18 },
  checkLabel: { color: "rgba(255,255,255,0.7)", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center" },
  btn: {
    width: "100%", padding: "14px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff", border: "none", borderRadius: 12,
    fontSize: 16, fontWeight: 700, cursor: "pointer",
    marginTop: 8, letterSpacing: "0.3px",
    boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
  },
  footer: { textAlign: "center", marginTop: 24, color: "rgba(255,255,255,0.5)", fontSize: 14 },
  link: { color: "#818cf8", fontWeight: 600, textDecoration: "none" },
};