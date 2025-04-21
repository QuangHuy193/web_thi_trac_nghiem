// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBDduPI_6xEUTy3kj2X445Zz6MaDTMW0-8",
  authDomain: "web-thi-trac-nghiem.firebaseapp.com",
  projectId: "web-thi-trac-nghiem",
  storageBucket: "web-thi-trac-nghiem.firebasestorage.app",
  messagingSenderId: "25598118311",
  appId: "1:25598118311:web:22b04d865d91e0bfe70e82",
  measurementId: "G-4YSTC7ZMVE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
