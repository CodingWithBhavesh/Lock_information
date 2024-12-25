// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUr1mzLde8O7uSdpBzGZXP7PrcCNyq4Vo",
  authDomain: "lock-information-47dfd.firebaseapp.com",
  projectId: "lock-information-47dfd",
  storageBucket: "lock-information-47dfd.firebasestorage.app",
  messagingSenderId: "264303438678",
  appId: "1:264303438678:web:9933c525172796f84dc4f7",
  measurementId: "G-0XBQLKLT2Q"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestPermission = async () => {
  try {
    const token = await getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" });
    if (token) {
      console.log("Push Notification Token:", token);
      // Save token to your database
    }
  } catch (err) {
    console.error("Permission denied or error:", err);
  }
};

onMessage(messaging, (payload) => {
  console.log("Notification Received:", payload);
});

export { messaging };