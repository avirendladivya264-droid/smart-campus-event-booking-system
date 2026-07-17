import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Reviews from "./pages/Reviews";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AddEvent from "./pages/AddEvent";

export default function App() {
  const user = JSON.parse(localStorage.getItem("user")) || null;

  const isAdmin =
  user?.role === "admin" ||
  user?.role === "hod" ||
  user?.role === "principal";

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={isAdmin ? <Admin /> : <h2 style={{ padding: 20 }}>Access Denied ❌</h2>}
        />
        <Route
          path="/admin/add-event"
          element={isAdmin ? <AddEvent /> : <h2 style={{ padding: 20 }}>Access Denied ❌</h2>}
        />
      </Routes>
    </BrowserRouter>
  );
}