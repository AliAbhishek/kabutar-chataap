// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.1.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
const firebaseConfig = {
    apiKey: "AIzaSyBQIzVcvqi2-sR8aPTa1yvA2dHbrCrJ9Ak",
    authDomain: "kabutar-d4d8e.firebaseapp.com",
    projectId: "kabutar-d4d8e",
    storageBucket: "kabutar-d4d8e.appspot.com",
    messagingSenderId: "457941657857",
    appId: "1:457941657857:web:21b66dfc8db3a3f4e45300",
    measurementId: "G-E9XYGJNRR6"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {

    console.log('[firebase-messaging-sw.js] Received background message ', payload);



    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    console.log('Showing notification:', notificationTitle, notificationOptions);
    self.registration.showNotification(notificationTitle, notificationOptions)
        .then(() => console.log('Notification displayed'))
        .catch(err => console.error('Notification failed to display', err));


    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    console.log('Notification click received:', event.notification.data);

    const url = "https://kabutar-chataap.onrender.com/chats"; // Get the URL from the notification data

    event.notification.close(); // Close the notification

    // Open the URL in a new window or tab
    event.waitUntil(
        clients.openWindow(url)
    );
});
