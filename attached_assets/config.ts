import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWeM_PBbOQW0hVGnhHJ7FGuX7TBvE3cxk",
  authDomain: "at-soko-customerservicechatbot.firebaseapp.com",
  databaseURL: "https://at-soko-customerservicechatbot-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "at-soko-customerservicechatbot",
  storageBucket: "at-soko-customerservicechatbot.firebasestorage.app",
  messagingSenderId: "485923525379",
  appId: "1:485923525379:web:fe61c10556bcf7f6b1cf36",
  measurementId: "G-1MMKDKRJ80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

export default app;