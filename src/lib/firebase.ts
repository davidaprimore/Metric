import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

// Configuration provided by the user
const firebaseConfig = {
    apiKey: "AIzaSyDpC5qp3qwkdpSrSva4X-KRfCNA-WDh2JE",
    authDomain: "metrik-pro.firebaseapp.com",
    projectId: "metrik-pro",
    storageBucket: "metrik-pro.firebasestorage.app",
    messagingSenderId: "276878104116",
    appId: "1:276878104116:web:706ff47b9603ff7d471c61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export messaging instance
export const messaging = getMessaging(app);
