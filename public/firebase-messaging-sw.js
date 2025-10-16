// Use compat libraries in service workers
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyC0anVFh7KZdzonGttlt4hfrEhvDms0dm4",
  authDomain: "dac-app-257bf.firebaseapp.com",
  projectId: "dac-app-257bf",
  storageBucket: "dac-app-257bf.firebasestorage.app",
  messagingSenderId: "742418723331",
  appId: "1:742418723331:web:36b66ccbc8c6471fa81436",
  measurementId: "G-9CMEW0L4WV",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Background message received:", payload);
  const notificationTitle =
    payload.notification?.title || "Background Message Title";
  const notificationOptions = {
    body: payload.notification?.body || "Background Message body",
    icon: "/icon.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
