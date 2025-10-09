// src/config/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 1. Reemplaza ESTO con tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDjMPLQ0sB8bfnJEPhvvAZTvwIsWTDRJXE",
  authDomain: "miencuestaapp-fa187.firebaseapp.com",
  projectId: "miencuestaapp-fa187",
  storageBucket: "miencuestaapp-fa187.firebasestorage.app",
  messagingSenderId: "937802969255",
  appId: "1:937802969255:web:2033ad28f80c680d09eb82"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
// Exporta la instancia de Firestore que usaremos para guardar los datos
export const db = getFirestore(app);