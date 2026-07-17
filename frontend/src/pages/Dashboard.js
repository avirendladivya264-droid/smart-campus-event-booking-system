import React, { useEffect, useState } from "react";
import { API } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Create Event Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [department, setDepartment] = useState("");

  // Redirect if not admin
  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "hod" && user.role !== "principal")) {
      navigate("/login");
    }
  }, []);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/events/all");
      setEvents(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert("Error fetching events ❌");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Create event
  const handleCreateEvent = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/events/create",
        { title, description, date, venue, department },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Event Created Successfully ✅");

      // reset
      setTitle("");
      setDescription("");
      setDate("");
      setVenue("");
      setDepartment("");

      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.msg || "Event Creation Failed ❌");
    }
  };

  // Publish event
  const handlePublish = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/events/publish/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Event Published ✅");
      fetchEvents();
    } catch (err) {
      alert("Publish Failed ❌");
    }
  };

  // Unpublish event
  const handleUnpublish = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/events/unpublish/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Event Unpublished ✅");
      fetchEvents();
    } catch (err) {
      alert("Unpublish Failed ❌");
    }
  };

  // Delete event
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this event?")) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/events/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Event Deleted ✅");
      fetchEvents();
    } catch (err) {
      alert("Delete Failed ❌");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Admin Panel</h2>
        <p style={styles.role}>Role: {user?.role}</p>

        <button style={styles.sideBtn} onClick={() => window.scrollTo(0, 0)}>
          ➕ Create Event
        </button>

        <button style={styles.sideBtn} onClick={() => window.scrollTo(0, 600)}>
          📌 Manage Events
        </button>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.heading}>Welcome, {user?.fullName}</h1>
          <p style={styles.subText}>
            Manage all campus events, publish announcements and control everything.
          </p>
        </div>

        {/* Create Event Form */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Create New Event</h2>

          <form onSubmit={handleCreateEvent}>
            <input
              style={styles.input}
              type="text"
              placeholder="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              style={styles.textarea}
              placeholder="Event Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <input
              style={styles.input}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <input
              style={styles.input}
              type="text"
              placeholder="Venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
            />

            <input
              style={styles.input}
              type="text"
              placeholder="Department (CSE / ECE / MECH)"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />

            <button style={styles.createBtn} type="submit">
              Create Event
            </button>
          </form>
        </div>

        {/* Manage Events */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Manage Events</h2>

          {loading ? (
            <p>Loading events...</p>
          ) : events.length === 0 ? (
            <p>No events found ❌</p>
          ) : (
            <div style={styles.eventGrid}>
              {events.map((event) => (
                <div key={event._id} style={styles.eventCard}>
                  <h3 style={styles.eventTitle}>{event.title}</h3>
                  <p style={styles.eventDesc}>{event.description}</p>

                  <p style={styles.smallText}>
                    📅 {event.date?.slice(0, 10)} | 📍 {event.venue}
                  </p>

                  <p style={styles.smallText}>🏫 Dept: {event.department}</p>

                  <p
                    style={{
                      ...styles.status,
                      background: event.isPublished ? "#d1fae5" : "#fee2e2",
                      color: event.isPublished ? "#065f46" : "#991b1b",
                    }}
                  >
                    {event.isPublished ? "Published ✅" : "Not Published ❌"}
                  </p>

                  <div style={styles.btnRow}>
                    {!event.isPublished ? (
                      <button
                        style={styles.publishBtn}
                        onClick={() => handlePublish(event._id)}
                      >
                        Publish
                      </button>
                    ) : (
                      <button
                        style={styles.unpublishBtn}
                        onClick={() => handleUnpublish(event._id)}
                      >
                        Unpublish
                      </button>
                    )}

                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(event._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    background: "#f3f4f6",
  },
  sidebar: {
    width: "240px",
    background: "linear-gradient(180deg, #4f46e5, #9333ea)",
    padding: "25px",
    color: "white",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  role: {
    fontSize: "14px",
    opacity: "0.9",
    marginBottom: "20px",
  },
  sideBtn: {
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    background: "rgba(255,255,255,0.2)",
    color: "white",
    fontWeight: "bold",
    textAlign: "left",
  },
  logoutBtn: {
    marginTop: "auto",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#ef4444",
    color: "white",
    fontWeight: "bold",
  },
  main: {
    flex: 1,
    padding: "30px",
  },
  header: {
    marginBottom: "25px",
  },
  heading: {
    fontSize: "28px",
    marginBottom: "8px",
    color: "#111827",
  },
  subText: {
    color: "#4b5563",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "25px",
    boxShadow: "0px 5px 12px rgba(0,0,0,0.08)",
  },
  sectionTitle: {
    fontSize: "20px",
    marginBottom: "15px",
    color: "#111827",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    outline: "none",
    minHeight: "90px",
  },
  createBtn: {
    width: "100%",
    padding: "12px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  eventGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "15px",
  },
  eventCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "15px",
    background: "#f9fafb",
  },
  eventTitle: {
    fontSize: "18px",
    marginBottom: "8px",
    color: "#111827",
  },
  eventDesc: {
    fontSize: "14px",
    color: "#374151",
    marginBottom: "10px",
  },
  smallText: {
    fontSize: "13px",
    color: "#6b7280",
  },
  status: {
    padding: "6px 10px",
    borderRadius: "6px",
    display: "inline-block",
    marginTop: "10px",
    fontSize: "13px",
    fontWeight: "bold",
  },
  btnRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginTop: "15px",
  },
  publishBtn: {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#22c55e",
    color: "white",
    fontWeight: "bold",
  },
  unpublishBtn: {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#f59e0b",
    color: "white",
    fontWeight: "bold",
  },
  deleteBtn: {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#ef4444",
    color: "white",
    fontWeight: "bold",
  },
};