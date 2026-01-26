/* eslint-disable no-undef */
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyDpC5qp3qwkdpSrSva4X-KRfCNA-WDh2JE",
    authDomain: "metrik-pro.firebaseapp.com",
    projectId: "metrik-pro",
    storageBucket: "metrik-pro.firebasestorage.app",
    messagingSenderId: "276878104116",
    appId: "1:276878104116:web:706ff47b9603ff7d471c61"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// [DUPLICATE FIX]
// The FCM SDK automatically displays a notification if the payload contains a 'notification' key.
// We do not need manually call showNotification here, otherwise we get two alerts.
// messaging.onBackgroundMessage((payload) => { ... });
