// src/AdminPage.js
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function AdminPage({ user }) {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    const fetchVisits = async () => {
      const q = query(collection(db, "visits"));
      const snapshot = await getDocs(q);
      setVisits(snapshot.docs.map((doc) => doc.data()));
    };
    fetchVisits();
  }, []);

  const totalToday = visits.filter(
    (v) =>
      v.date.toDate().toDateString() === new Date().toDateString()
  ).length;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Admin Dashboard</h1>
      <p>Total Visitors Today: {totalToday}</p>
      <p>Total Visits Recorded: {visits.length}</p>
    </div>
  );
}

export default AdminPage;