// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMm4LWwPfDVCS6I3VO4O_O1cuz8kWIaaU",
  authDomain: "studybuddy-react-native.firebaseapp.com",
  projectId: "studybuddy-react-native",
  storageBucket: "studybuddy-react-native.firebasestorage.app",
  messagingSenderId: "517374556537",
  appId: "1:517374556537:web:ec665993f419b61b2257a8",
  measurementId: "G-B38FHRW01H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
