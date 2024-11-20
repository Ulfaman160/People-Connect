import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCj6eoGpa9hQgQ1TonpIHEwHIMJXRO1FeI",
  authDomain: "chat-app-b1340.firebaseapp.com",
  projectId: "chat-app-b1340",
  storageBucket: "chat-app-b1340.firebasestorage.app",
  messagingSenderId: "421082093688",
  appId: "1:421082093688:web:8c6eb90c98b48f2e16758d",
  measurementId: "G-4SJPD74F0V"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
