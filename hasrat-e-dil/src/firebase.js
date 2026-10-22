import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-4N8R6QW0aXv2_example_REPLACE",
  authDomain: "hasrat-e-dil.firebaseapp.com",
  projectId: "hasrat-e-dil",
  storageBucket: "hasrat-e-dil.firebasestorage.app",
  messagingSenderId: "123456789000",
  appId: "1:123456789000:web:abcd1234example"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);