import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB7eqr07jIPQBY2QVxPir_fxlyb-Id-kp4",
  authDomain: "afk-lol-d3d90.firebaseapp.com",
  databaseURL: "https://afk-lol-d3d90-default-rtdb.firebaseio.com",
  projectId: "afk-lol-d3d90",
  storageBucket: "afk-lol-d3d90.firebasestorage.app",
  messagingSenderId: "974103616741",
  appId: "1:974103616741:web:e0af23021fd873cffc480c",
  measurementId: "G-PDDXVFVT86"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app, "afk-lol-db");
