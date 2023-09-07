// Import the functions you need from the SDKs you need
import firebase, { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCL7yvMwm-3OgMb0gQnDocDY9JhajlJaCU",
  authDomain: "my-app-f2f92.firebaseapp.com",
  projectId: "my-app-f2f92",
  storageBucket: "my-app-f2f92.appspot.com",
  messagingSenderId: "815752485853",
  appId: "1:815752485853:web:dd4aa7043185f2e0f07434",
  measurementId: "G-49B03DYJ07",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, firebase };
