import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { API } from "../utils/api";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [date, setDate] = useState("");

  const load = async () => {
    const res = await API.get("/events", { params: { search, category, date, sort: "soonest" } });
    setEvents(res.data);
  };

  useEffect(() => { load(); }, []);

  return (
    <>
     
      <div className="container">
        <h1>All Events</h1>

        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
          <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search events..." />
          <select value={category} onChange={(e)=>setCategory(e.target.value)}>
            <option>All</option>
            <option>Tech</option>
            <option>Cultural</option>
            <option>Sports</option>
            <option>Workshop</option>
          </select>
          <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
          <button className="btn btn-primary" onClick={load}>Apply</button>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:16}}>
          {events.map(ev => (
            <div className="card" key={ev._id}>
              <h3>{ev.title}</h3>
              <p><b>{ev.date}</b> • {ev.time}</p>
              <p>{ev.location}</p>
              <span style={{fontSize:12,background:"#eee",padding:"4px 10px",borderRadius:20}}>{ev.category}</span>
              <div style={{marginTop:10}}>
                <Link to={`/events/${ev._id}`}><button className="btn btn-primary">View Details</button></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
