// src/Login.js
import React from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";

function Login() {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Only allow NEU email
      if (user.email !== "jcesperanza@neu.edu.ph") {
        alert("Access denied. Use your NEU account.");
        await auth.signOut();
        return;
      }

      // Default role = user
      localStorage.setItem("isAdmin", "false");
      localStorage.setItem("userEmail", user.email);

      alert("Welcome to NEU Library!");
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Login failed!");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>NEU Library Visitor Log</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
}

export default Login;