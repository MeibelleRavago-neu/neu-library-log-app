// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFp-oGOXOuG2UqUdE4dzUO7WAo9wP4rlY",
  authDomain: "neu-library-log-94622.firebaseapp.com",
  projectId: "neu-library-log-94622",
  storageBucket: "neu-library-log-94622.appspot.com",
  messagingSenderId: "881447307375",
  appId: "1:881447307375:web:a192c90b76930f8a14259a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);