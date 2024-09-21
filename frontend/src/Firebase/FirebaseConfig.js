// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQIzVcvqi2-sR8aPTa1yvA2dHbrCrJ9Ak",
  authDomain: "kabutar-d4d8e.firebaseapp.com",
  projectId: "kabutar-d4d8e",
  storageBucket: "kabutar-d4d8e.appspot.com",
  messagingSenderId: "457941657857",
  appId: "1:457941657857:web:21b66dfc8db3a3f4e45300",
  measurementId: "G-E9XYGJNRR6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const vapidKey="BDtcM94dKWPtkpqOVCnCYT_0NlwR99iAEJWimZPmfoeIqq_VPwBDJxaRbvobx5LRp63oPpyEkWGKR2gQNnQJbfU"

const messaging = getMessaging(app);

// Request the token for push notifications
export const requestForToken = (setTokenFound) => {
    return getToken(messaging, { vapidKey: vapidKey })
      .then((currentToken) => {
        if (currentToken) {
          console.log('current token for client: ', currentToken);
          return currentToken
        //   setTokenFound(true);
        } else {
          console.log('No registration token available. Request permission to generate one.');
        //   setTokenFound(false);
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // setTokenFound(false);
      });
  };
  
  // Handle incoming messages while the app is in the foreground
  export const onMessageListener = () =>
    new Promise((resolve) => {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    });
// const analytics = getAnalytics(app);