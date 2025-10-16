// Import the functions you need from the SDKs you need
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0anVFh7KZdzonGttlt4hfrEhvDms0dm4",
  authDomain: "dac-app-257bf.firebaseapp.com",
  projectId: "dac-app-257bf",
  storageBucket: "dac-app-257bf.firebasestorage.app",
  messagingSenderId: "742418723331",
  appId: "1:742418723331:web:36b66ccbc8c6471fa81436",
  measurementId: "G-9CMEW0L4WV",
};

const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Analytics (only works in browser, not server)
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

// Messaging (for push notifications)
let messaging: Messaging | null = null;
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  messaging = getMessaging(app);
}

export { analytics, app, messaging };
