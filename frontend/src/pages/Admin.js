import React, { useEffect, useState } from "react";
import { API } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal open/close
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technical");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Protect route
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
      alert("Failed to load events ❌");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Create Event
  const handleCreateEvent = async (e) => {
    e.preventDefault();

    try {
      await API.post(
  "/events",
  { title, description, category, location, date, time, imageUrl },
  { headers: { Authorization: `Bearer ${token}` } }
);

      alert("Event Created Successfully ✅");
      setShowModal(false);

      // Reset
      setTitle("");
      setDescription("");
      setCategory("Technical");
      setLocation("");
      setDate("");
      setTime("");
      setImageUrl("");

      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.msg || "Event creation failed ❌");
    }
  };

  // Publish
  const publishEvent = async (id) => {
  try {
    await API.patch(`/events/${id}/publish`);
    fetchEvents();
  } catch (err) {
    alert("Publish failed ❌");
  }
};

  // Unpublish
  const unpublishEvent = async (id) => {
  try {
    await API.patch(`/events/${id}/publish`);
    fetchEvents();
  } catch (err) {
    alert("Unpublish failed ❌");
  }
};

  // Delete
  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
     await API.delete(`/events/${id}`); 
      fetchEvents();
    } catch (err) {
      alert("Delete failed ❌");
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Stats
  const totalEvents = events.length;
  const publishedEvents = events.filter((e) => e.isPublished).length;
  const pendingEvents = events.filter((e) => !e.isPublished).length;

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Campus Admin</h2>

        <div style={styles.profileBox}>
          <p style={styles.name}>{user?.fullName}</p>
          <p style={styles.role}>Role: {user?.role}</p>
        </div>

        <button style={styles.sidebarBtn} onClick={() => setShowModal(true)}>
          ➕ Create Event
        </button>

        <button style={styles.sidebarBtn} onClick={() => window.scrollTo(0, 500)}>
          📌 Manage Events
        </button>

        <button style={styles.logoutBtn} onClick={logout}>
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Top Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>Admin Dashboard</h1>
            <p style={styles.subText}>
              Create, publish, manage and control all campus events.
            </p>
          </div>

          <button style={styles.createTopBtn} onClick={() => setShowModal(true)}>
            + New Event
          </button>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Events</p>
            <h2 style={styles.statNumber}>{totalEvents}</h2>
          </div>

          <div style={{ ...styles.statCard, borderLeft: "6px solid #22c55e" }}>
            <p style={styles.statLabel}>Published</p>
            <h2 style={styles.statNumber}>{publishedEvents}</h2>
          </div>

          <div style={{ ...styles.statCard, borderLeft: "6px solid #f59e0b" }}>
            <p style={styles.statLabel}>Pending</p>
            <h2 style={styles.statNumber}>{pendingEvents}</h2>
          </div>
        </div>

        {/* Events Table */}
        <div style={styles.tableCard}>
          <h2 style={styles.sectionTitle}>Manage Events</h2>

          {loading ? (
            <p>Loading events...</p>
          ) : events.length === 0 ? (
            <p>No events available ❌</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeadRow}>
                    <th style={styles.th}>Title</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Location</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {events.map((event) => (
                    <tr key={event._id} style={styles.tr}>
                      <td style={styles.td}>
                        <b>{event.title}</b>
                        <p style={styles.smallDesc}>
                          {event.description?.slice(0, 60)}...
                        </p>
                      </td>

                      <td style={styles.td}>{event.category}</td>
                      <td style={styles.td}>{event.location}</td>
                      <td style={styles.td}>{event.date?.slice(0, 10)}</td>

                      <td style={styles.td}>
                        {event.isPublished ? (
                          <span style={styles.published}>Published</span>
                        ) : (
                          <span style={styles.pending}>Pending</span>
                        )}
                      </td>

                      <td style={styles.td}>
                        <div style={styles.actionRow}>
                          {!event.isPublished ? (
                            <button
                              style={styles.publishBtn}
                              onClick={() => publishEvent(event._id)}
                            >
                              Publish
                            </button>
                          ) : (
                            <button
                              style={styles.unpublishBtn}
                              onClick={() => unpublishEvent(event._id)}
                            >
                              Unpublish
                            </button>
                          )}

                          <button
                            style={styles.deleteBtn}
                            onClick={() => deleteEvent(event._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <p style={styles.footerText}>
          © Smart Campus Event Management System - Admin Panel
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h2 style={styles.modalTitle}>Create New Event</h2>

            <form onSubmit={handleCreateEvent}>
              <input
                style={styles.input}
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

              <select
                style={styles.input}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Technical</option>
                <option>Cultural</option>
                <option>Sports</option>
                <option>Workshop</option>
                <option>Seminar</option>
              </select>

              <input
                style={styles.input}
                placeholder="Location / Venue"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />

              <input
                style={styles.input}
                placeholder="Image URL (optional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />

              <div style={styles.modalBtnRow}>
                <button type="submit" style={styles.modalCreateBtn}>
                  Create Event
                </button>

                <button
                  type="button"
                  style={styles.modalCancelBtn}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================
// Styles
// ==========================
const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    background: "#f3f4f6",
  },

  sidebar: {
    width: "260px",
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

  profileBox: {
    background: "rgba(255,255,255,0.15)",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "10px",
  },

  name: {
    fontSize: "15px",
    fontWeight: "bold",
    margin: 0,
  },

  role: {
    fontSize: "13px",
    opacity: 0.9,
    marginTop: "4px",
  },

  sidebarBtn: {
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    background: "rgba(255,255,255,0.2)",
    color: "white",
    fontWeight: "bold",
    textAlign: "left",
    transition: "0.3s",
  },

  logoutBtn: {
    marginTop: "auto",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  heading: {
    fontSize: "30px",
    margin: 0,
    color: "#111827",
  },

  subText: {
    color: "#4b5563",
    marginTop: "6px",
  },

  createTopBtn: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "10px",
    background: "#4f46e5",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginBottom: "25px",
  },

  statCard: {
    background: "white",
    padding: "18px",
    borderRadius: "14px",
    boxShadow: "0px 6px 15px rgba(0,0,0,0.08)",
    borderLeft: "6px solid #6366f1",
  },

  statLabel: {
    color: "#6b7280",
    fontSize: "14px",
    marginBottom: "5px",
  },

  statNumber: {
    fontSize: "28px",
    margin: 0,
    color: "#111827",
  },

  tableCard: {
    background: "white",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0px 6px 15px rgba(0,0,0,0.08)",
  },

  sectionTitle: {
    fontSize: "20px",
    marginBottom: "15px",
    color: "#111827",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  tableHeadRow: {
    background: "#f3f4f6",
  },

  th: {
    padding: "12px",
    textAlign: "left",
    fontSize: "14px",
    color: "#111827",
  },

  tr: {
    borderBottom: "1px solid #e5e7eb",
  },

  td: {
    padding: "12px",
    fontSize: "14px",
    color: "#374151",
    verticalAlign: "top",
  },

  smallDesc: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "4px",
  },

  published: {
    background: "#dcfce7",
    color: "#166534",
    padding: "5px 10px",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "12px",
  },

  pending: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "5px 10px",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "12px",
  },

  actionRow: {
    display: "flex",
    gap: "8px",
  },

  publishBtn: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "8px",
    background: "#22c55e",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  unpublishBtn: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "8px",
    background: "#f59e0b",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  deleteBtn: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "8px",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  footerText: {
    marginTop: "20px",
    fontSize: "13px",
    color: "#6b7280",
    textAlign: "center",
  },

  // Modal
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  modalBox: {
    width: "100%",
    maxWidth: "500px",
    background: "white",
    padding: "22px",
    borderRadius: "14px",
    boxShadow: "0px 10px 25px rgba(0,0,0,0.2)",
  },

  modalTitle: {
    fontSize: "20px",
    marginBottom: "15px",
    color: "#111827",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    marginBottom: "12px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    marginBottom: "12px",
    minHeight: "90px",
    outline: "none",
  },

  modalBtnRow: {
    display: "flex",
    gap: "10px",
  },

  modalCreateBtn: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#4f46e5",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  modalCancelBtn: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#9ca3af",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
};