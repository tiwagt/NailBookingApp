import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCjeoydc3wRiEhU6OYAM2CQYIugkV4T31c",
  authDomain: "nathnails-d9dd1.firebaseapp.com",
  projectId: "nathnails-d9dd1",
  storageBucket: "nathnails-d9dd1.firebasestorage.app",
  messagingSenderId: "1054759944456",
  appId: "1:1054759944456:web:2b6bf6c6b45cdd582a2cbd",
  measurementId: "G-Y10CKNZ18Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);