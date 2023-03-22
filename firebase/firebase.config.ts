// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBKxGPvUbCO0Nmb8Sf6sXidygzdq4HnEu4',
  authDomain: 'kafe-39ba8.firebaseapp.com',
  databaseURL: 'https://kafe-39ba8.firebaseio.com',
  projectId: 'kafe-39ba8',
  storageBucket: 'kafe-39ba8.appspot.com',
  messagingSenderId: '143419965488',
  appId: '1:143419965488:web:ffd4a6e6939d654667adf5',
  measurementId: 'G-VV8Q7ETVWQ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
app.automaticDataCollectionEnabled = true;
export var application = app;

export const db = () => getFirestore(app);

export const auth = getAuth(app);

export const storage = getStorage(app);

setPersistence(auth, browserLocalPersistence);
