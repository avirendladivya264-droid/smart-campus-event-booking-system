import React, { useEffect, useState } from "react";

import { API } from "../utils/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const load = async () => {
    const res = await API.get("/reviews");
    setReviews(res.data);
  };

  useEffect(() => { load(); }, []);

  const addReview = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");
    await API.post("/reviews", { rating, comment }, { headers: { Authorization: `Bearer ${token}` } });
    setComment("");
    load();
  };

  return (
    <>
     
      <div className="container">
        <h1>Student Reviews</h1>

        <div className="card" style={{marginBottom:18}}>
          <h3>Add Review</h3>
          <select value={rating} onChange={(e)=>setRating(Number(e.target.value))}>
            {[5,4,3,2,1].map(x => <option key={x} value={x}>{x} Stars</option>)}
          </select>
          <textarea value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Write your review..." style={{width:"100%",height:90,marginTop:10}}/>
          <button className="btn btn-primary" onClick={addReview} style={{marginTop:10}}>Submit</button>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:16}}>
          {reviews.map(r => (
            <div className="card" key={r._id}>
              <h3>{r.user?.fullName}</h3>
              <p>{r.user?.rollNumber} • {r.user?.department}</p>
              <p>⭐ {r.rating}/5</p>
              <p>{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
