import React, { useState, useEffect } from "react";
import "./App.css";
import { auth, provider, db } from "./firebase";
import {
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminBox, setShowAdminBox] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [reason, setReason] = useState("");
  const [college, setCollege] = useState("");
  const [isEmployee, setIsEmployee] = useState(false);

  const [visits, setVisits] = useState([]);

  const [filterCollege, setFilterCollege] = useState("");
  const [filterReason, setFilterReason] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [successMsg, setSuccessMsg] = useState("");

  // ✅ ADMIN EMAILS (Updated with both requested emails)
  const adminEmails = [
    "jcesperanza@neu.edu.ph",
    "kozu.mei.official@gmail.com"
  ];

  const normalizeDate = (d) => {
    if (!d) return new Date();
    if (d.toDate) return d.toDate(); 
    return new Date(d);
  };

  // ================= AUTH =================
  const loginEmail = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
      setIsAdmin(adminEmails.includes(res.user.email));
    } catch {
      alert("Invalid login");
    }
  };

  const registerEmail = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      setUser(res.user);
    } catch {
      alert("Email exists");
    }
  };

  const loginGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      if (!res.user.email.endsWith("@neu.edu.ph") && !adminEmails.includes(res.user.email)) {
        alert("Use NEU email only");
        signOut(auth);
        return;
      }
      setUser(res.user);
      setIsAdmin(adminEmails.includes(res.user.email));
    } catch (err) {
      console.error(err);
    }
  };

  const loginAdmin = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      if (!adminEmails.includes(res.user.email)) {
        alert("Not authorized as admin");
        return;
      }
      setUser(res.user);
      setIsAdmin(true);
      setShowAdminBox(false);
    } catch {
      alert("Invalid admin login");
    }
  };

  const loginAdminGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      if (!adminEmails.includes(res.user.email)) {
        alert("Not authorized as admin");
        signOut(auth);
        return;
      }
      setUser(res.user);
      setIsAdmin(true);
      setShowAdminBox(false);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  // ================= DATA (REAL-TIME) =================
  useEffect(() => {
    let unsubscribe = () => {};

    if (isAdmin) {
      const q = query(collection(db, "visits"), orderBy("date", "desc"));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: normalizeDate(doc.data().date)
        }));
        setVisits(data);
      });
    }

    return () => unsubscribe(); 
  }, [isAdmin]);

  // ================= SUBMIT =================
  const submitVisit = async () => {
    if (!reason || !college) {
      alert("Please fill out all fields!");
      return;
    }

    try {
      await addDoc(collection(db, "visits"), {
        user_email: user.email,
        reason,
        college,
        isEmployee,
        date: new Date() 
      });

      setSuccessMsg("✅ Successfully submitted your visit!");
      setReason("");
      setCollege("");
      setIsEmployee(false);

      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err) {
      console.error("Error adding document: ", err);
      alert("Error submitting. Check console.");
    }
  };

  // ================= FILTER LOGIC =================
  const filteredVisits = visits.filter((v) => {
    const d = normalizeDate(v.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    return (
      (!start || d >= start) &&
      (!end || d <= end) &&
      (filterCollege === "" || v.college === filterCollege) &&
      (filterReason === "" || v.reason === filterReason) &&
      (filterEmployee === "" ||
        (filterEmployee === "yes" && v.isEmployee) ||
        (filterEmployee === "no" && !v.isEmployee))
    );
  });

  // ================= STATS CALCULATION =================
  const totalVisits = filteredVisits.length;
  const uniqueUsers = new Set(filteredVisits.map(v => v.user_email)).size;
  const employeeCount = filteredVisits.filter(v => v.isEmployee).length;
  const studentCount = totalVisits - employeeCount;

  // ================= LOGIN PAGE =================
  if (!user) {
    return (
      <div className="container">
        <div className="card">
          <h1>NEU Library Visitor Log</h1>
          <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <div style={{ display: 'flex', gap: '10px' }}>
             <button onClick={loginEmail}>Login</button>
             <button onClick={registerEmail}>Register</button>
          </div>
          <p>or</p>
          <button onClick={loginGoogle} className="google-btn">Google Login</button>
          <hr />
          <button onClick={() => setShowAdminBox(true)} style={{backgroundColor: '#666'}}>Admin Access</button>
        </div>

        {showAdminBox && (
          <div className="modal">
            <div className="modal-card">
              <h2>Admin Login</h2>
              <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
              <button onClick={loginAdmin}>Login as Admin</button>
              <button onClick={loginAdminGoogle}>Google Admin Login</button>
              <button onClick={() => setShowAdminBox(false)} style={{backgroundColor: '#ccc', color: '#333'}}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ================= ADMIN DASHBOARD =================
  if (isAdmin) {
    return (
      <div className="container">
        <div className="top-row">
            <div className="card">
                <h2>Admin Dashboard</h2>
                <p style={{fontSize: '13px'}}>Logged in as: <b>{user.email}</b></p>
                <button onClick={() => setIsAdmin(false)} style={{backgroundColor: '#555'}}>Switch to User View</button>
                <button onClick={logout}>Logout</button>
            </div>

            <div className="card">
                <h3>Filters & Date Range</h3>
                <div className="filter-grid">
                    <div>
                    <label style={{fontSize: '11px'}}>Start Date:</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div>
                    <label style={{fontSize: '11px'}}>End Date:</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>
                <div className="filter-grid">
                    <select value={filterCollege} onChange={(e) => setFilterCollege(e.target.value)}>
                    <option value="">All Colleges</option>
                    <option value="CCS">CCS</option>
                    <option value="CBA">CBA</option>
                    <option value="CAS">CAS</option>
                    <option value="COE">COE</option>
                    </select>
                    <select value={filterReason} onChange={(e) => setFilterReason(e.target.value)}>
                    <option value="">All Reasons</option>
                    <option value="Reading">Reading</option>
                    <option value="Research">Research</option>
                    <option value="Computer Use">Computer Use</option>
                    <option value="Meeting">Meeting</option>
                    </select>
                </div>
                <button className="reset-btn" onClick={() => {
                    setStartDate(""); setEndDate(""); setFilterCollege(""); setFilterReason(""); setFilterEmployee("");
                }}>Reset Filters</button>
            </div>
        </div>

        <div className="stats-container">
          <div className="stat-card"><h3>{totalVisits}</h3><p>Total Visits</p></div>
          <div className="stat-card"><h3>{uniqueUsers}</h3><p>Unique Visitors</p></div>
          <div className="stat-card"><h3>{studentCount}</h3><p>Students</p></div>
          <div className="stat-card"><h3>{employeeCount}</h3><p>Employees</p></div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Reason</th>
                <th>College</th>
                <th>Type</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisits.map((v) => (
                <tr key={v.id}>
                  <td>{v.user_email}</td>
                  <td>{v.reason}</td>
                  <td>{v.college}</td>
                  <td>{v.isEmployee ? "Employee" : "Student"}</td>
                  <td>{v.date.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ================= USER PAGE =================
  return (
    <div className="container">
      <div className="card">
        <h1>Welcome to NEU Library!</h1>
        <p>Logged in as: <b>{user.email}</b></p>
        {adminEmails.includes(user.email) && (
          <button onClick={() => setIsAdmin(true)} style={{backgroundColor: '#007bff'}}>Go to Admin Dashboard</button>
        )}
        <button onClick={logout}>Logout</button>
      </div>

      <div className="card">
        <h3>Library Visit Form</h3>
        {successMsg && <div className="success">{successMsg}</div>}

        <select value={reason} onChange={(e) => setReason(e.target.value)}>
          <option value="">Select Reason</option>
          <option value="Reading">Reading</option>
          <option value="Research">Research</option>
          <option value="Computer Use">Computer Use</option>
          <option value="Meeting">Meeting</option>
        </select>

        <select value={college} onChange={(e) => setCollege(e.target.value)}>
          <option value="">Select College</option>
          <option value="CCS">CCS</option>
          <option value="CBA">CBA</option>
          <option value="CAS">CAS</option>
          <option value="COE">COE</option>
        </select>

        <label style={{ display: 'block', margin: '10px 0', fontSize: '14px' }}>
          <input
            type="checkbox"
            style={{ width: 'auto', marginRight: '10px' }}
            checked={isEmployee}
            onChange={(e) => setIsEmployee(e.target.checked)}
          />
          Employee (Staff/Teacher)
        </label>

        <button onClick={submitVisit}>Submit Visit</button>
      </div>
    </div>
  );
}

export default App;