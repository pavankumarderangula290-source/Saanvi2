// Firebase Configuration
// For Firebase JS SDK v9.0.0+

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZzMcw4O8NhFy5o4Gjk7CfIGn1xo008oo",
  authDomain: "saanvi-4f853.firebaseapp.com",
  projectId: "saanvi-4f853",
  storageBucket: "saanvi-4f853.firebasestorage.app",
  messagingSenderId: "971792268878",
  appId: "1:971792268878:web:ab869833e0a8bf184dcd1f",
  measurementId: "G-DG8Z264YTL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

console.log("Firebase initialized successfully!");