import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBiXKzEN8bTAOJJ0KdZp5clEcrDGiqFr7o",
  authDomain: "e-commerce-nextjs-233a2.firebaseapp.com",
  projectId: "e-commerce-nextjs-233a2",
  storageBucket: "e-commerce-nextjs-233a2.appspot.com",
  messagingSenderId: "1015691814165",
  appId: "1:1015691814165:web:8b62a230e33b186584f51c",
  measurementId: "G-WTMKQDLP5Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Firestore Database
const db = getFirestore(app);

// Storage
const storage = getStorage(app);

// Authentication
const auth = getAuth();
const provider = new GoogleAuthProvider();

export {
  auth,
  provider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  db,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  signInWithRedirect,
  getRedirectResult,
};
