importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyBUr1mzLde8O7uSdpBzGZXP7PrcCNyq4Vo",
  authDomain: "lock-information-47dfd.firebaseapp.com",
  projectId: "lock-information-47dfd",
  storageBucket: "lock-information-47dfd.firebasestorage.app",
  messagingSenderId: "264303438678",
  appId: "1:264303438678:web:9933c525172796f84dc4f7",
  measurementId: "G-0XBQLKLT2Q"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
