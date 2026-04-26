import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3BMJpaREYRwpx7NAFsZIJksPpGrR6wds",
  authDomain: "courses-app-be24d.firebaseapp.com",
  projectId: "courses-app-be24d",
  storageBucket: "courses-app-be24d.firebasestorage.app",
  messagingSenderId: "84951911411",
  appId: "1:84951911411:web:4508ea3799905eeb47e086"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

//import { initializeApp } from "firebase/app";
//import { getAuth } from "firebase/auth";
//import { getFirestore } from "firebase/firestore";

//const firebaseConfig = {
//  apiKey: process.env.REACT_APP_API_KEY,
//  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//  projectId: process.env.REACT_APP_PROJECT_ID,
//  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//  appId: process.env.REACT_APP_APP_ID,
//};

//const app = initializeApp(firebaseConfig);
//export const auth = getAuth(app);
//export const db = getFirestore(app);