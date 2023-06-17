import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyDWII3fviXLpKEDQZiSCbysCw_JNXULL8g",
  authDomain: "library-management-7c721.firebaseapp.com",
  projectId: "library-management-7c721",
  storageBucket: "library-management-7c721.appspot.com",
  messagingSenderId: "916515363",
  appId: "1:916515363:web:f26e0b47d85627376cdf96",
  measurementId: "G-NH1NSK7PP8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
export {auth,provider,db};