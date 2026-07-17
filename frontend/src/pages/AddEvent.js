import React, { useState } from "react";
import axios from "axios";

function AddEvent() {
  const [event, setEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    imageUrl: ""
  });

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/events/create", {
        ...event,
        isPublished: true
      });

      alert("Event Created & Published Successfully 🎉");

      setEvent({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        category: "",
        imageUrl: ""
      });
    } catch (err) {
      alert("Error creating event ❌");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "20px" }}>🚀 Admin - Create & Publish Event</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <input name="title" placeholder="Title" value={event.title} onChange={handleChange} /><br /><br />
        <input name="description" placeholder="Description" value={event.description} onChange={handleChange} /><br /><br />
        <input name="date" type="date" value={event.date} onChange={handleChange} /><br /><br />
        <input name="time" type="time" value={event.time} onChange={handleChange} /><br /><br />
        <input name="location" placeholder="Location" value={event.location} onChange={handleChange} /><br /><br />
        <input name="category" placeholder="Category" value={event.category} onChange={handleChange} /><br /><br />
        <input name="imageUrl" placeholder="Image URL" value={event.imageUrl} onChange={handleChange} /><br /><br />

        <button type="submit">Publish Event</button>
      </form>
    </div>
  );
}

export default AddEvent;