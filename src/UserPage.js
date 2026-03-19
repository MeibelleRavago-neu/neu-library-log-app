// src/UserPage.js
import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

function UserPage({ user, setUser }) {
  const [reason, setReason] = useState("");
  const [college, setCollege] = useState("");
  const [isEmployee, setIsEmployee] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "visits"), {
      user_email: user.email,
      reason,
      college,
      isEmployee,
      date: Timestamp.now(),
    });
    alert("Welcome to NEU Library!");
    setReason("");
    setCollege("");
    setIsEmployee(false);
  };

  const toggleAdmin = () => setUser({ ...user, isAdmin: true });

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to NEU Library!</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="Reason for visit"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            placeholder="College"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            required
          />
        </div>
        <div>
          <label>
            Employee?{" "}
            <input
              type="checkbox"
              checked={isEmployee}
              onChange={(e) => setIsEmployee(e.target.checked)}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      <br />
      <button onClick={toggleAdmin}>Switch to Admin</button>
    </div>
  );
}

export default UserPage;