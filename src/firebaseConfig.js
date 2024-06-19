// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBc7o13bGAN_joEbHB0DJXpEJ1T8b0XSOY",
    authDomain: "myfitnesswebsite.firebaseapp.com",
    projectId: "myfitnesswebsite",
    storageBucket: "myfitnesswebsite.appspot.com",
    messagingSenderId: "248145045601",
    appId: "1:248145045601:web:2c451f4fd66b79beb72220"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
