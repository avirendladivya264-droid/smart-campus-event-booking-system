import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../utils/api";

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get("/events/upcoming")
      .then(res => setEvents(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="container">

      <div className="card" style={{background:"linear-gradient(90deg,#3b82f6,#9333ea)",color:"white"}}>
        <h1>Discover Campus Events Instantly</h1>
        <p>Join workshops, fests, hackathons, sports and cultural events happening in your campus.</p>

        <div style={{display:"flex",gap:12}}>
          <Link to="/events">
            <button className="btn" style={{background:"white"}}>Explore Events</button>
          </Link>

          <Link to="/register">
            <button className="btn" style={{background:"rgba(255,255,255,.2)",color:"white"}}>
              Get Started
            </button>
          </Link>
        </div>
      </div>

      <h2 style={{marginTop:28}}>Upcoming Events</h2>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:16}}>
        {events.map(ev => (
          <div className="card" key={ev._id}>
            <h3>{ev.title}</h3>
            <p><b>{ev.date}</b> • {ev.time}</p>
            <p>{ev.location}</p>

            <Link to={`/events/${ev._id}`}>
              <button className="btn btn-primary">View Details</button>
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}