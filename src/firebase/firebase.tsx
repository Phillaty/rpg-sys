// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASn9ha1PLcM01qLyOh4Oxey_UsRqn25UQ",
  authDomain: "rpgsystem-b7885.firebaseapp.com",
  projectId: "rpgsystem-b7885",
  storageBucket: "rpgsystem-b7885.appspot.com",
  messagingSenderId: "554959832672",
  appId: "1:554959832672:web:a64824e03a238d9441a505",
  measurementId: "G-ETHC8R04BJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};