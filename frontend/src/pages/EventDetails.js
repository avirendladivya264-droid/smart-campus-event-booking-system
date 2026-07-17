import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { API } from "../utils/api";

export default function EventDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [event, setEvent] = useState(null);

  // 📌 FETCH EVENT DETAILS
  useEffect(() => {
    API.get(`/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(err => console.log(err));
  }, [id]);

  // ⭐ REGISTER FUNCTION (FIXED + SAFE)
  const registerNow = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        alert("Please login first ❌");
        return nav("/login");
      }

      const res = await API.post(
        `/events/${id}/register`,
        { userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.msg || "Registered Successfully ✅");

    } catch (err) {
      alert(err?.response?.data?.msg || "Something went wrong ❌");
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="card">

        <h1>{event.title}</h1>

        <p>
          <b>Date:</b> {event.date} | <b>Time:</b> {event.time}
        </p>

        <p>
          <b>Location:</b> {event.location}
        </p>

        <p>
          <b>Category:</b> {event.category}
        </p>

        <p>
          <b>Registrations:</b> {event.registrations}</p>

        <p>{event.description}</p>

        {/* ⭐ REGISTER BUTTON */}
        <button
          onClick={registerNow}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "10px",
            background: "#4f46e5",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "15px",
          }}
        >
          Register Now
        </button>

        <div style={{ marginTop: 12 }}>
          <Link to="/events">← Back to Events</Link>
        </div>

      </div>
    </div>
  );
}