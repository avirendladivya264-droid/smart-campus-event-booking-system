import React, { useState } from "react";
import { API } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    rollNumber: "",
    collegeName: "",
    department: "",
    year: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });

  // ✅ ADDED
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState("");

  const update = (k, v) => setForm({ ...form, [k]: v });

  const submit = async () => {
    if (form.password !== form.confirmPassword) {
      return alert("Passwords not matching");
    }

    try {
      await API.post("api/auth/register", {
        ...form,
        adminKey: isAdmin ? adminKey : ""
      });

      alert("Registered Successfully!");
      nav("/login");

    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 550, margin: "0 auto" }}>
        <h2>Register</h2>

        {/* ✅ ADMIN CHECKBOX */}
        <div style={{ textAlign: "left", marginBottom: "10px" }}>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={() => setIsAdmin(!isAdmin)}
          /> Register as Admin
        </div>

        {/* ✅ COMMON FIELDS */}
        <input
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        {/* ✅ STUDENT ONLY FIELDS */}
        {!isAdmin && (
          <>
            <input placeholder="Roll Number" onChange={(e)=>update("rollNumber", e.target.value)} style={{ width:"100%", padding:10, marginBottom:10 }} />
            <input placeholder="College Name" onChange={(e)=>update("collegeName", e.target.value)} style={{ width:"100%", padding:10, marginBottom:10 }} />
            <input placeholder="Department" onChange={(e)=>update("department", e.target.value)} style={{ width:"100%", padding:10, marginBottom:10 }} />
            <input placeholder="Year" onChange={(e)=>update("year", e.target.value)} style={{ width:"100%", padding:10, marginBottom:10 }} />
            <input placeholder="Phone Number" onChange={(e)=>update("phoneNumber", e.target.value)} style={{ width:"100%", padding:10, marginBottom:10 }} />
          </>
        )}

        {/* ✅ PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={(e) => update("confirmPassword", e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        {/* ✅ ADMIN KEY */}
        {isAdmin && (
          <input
            placeholder="Enter Admin Key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          />
        )}

        {/* ✅ SUBMIT */}
        <button className="btn btn-primary" onClick={submit} style={{ width: "100%" }}>
          Create Account
        </button>

      </div>
    </div>
  );
}