import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyACKHLXCfL-5gg-ZOTP62S6Uzs3ZI46ykQ",
  authDomain: "mine-legends-dev.firebaseapp.com",
  projectId: "mine-legends-dev",
  storageBucket: "mine-legends-dev.firebasestorage.app",
  messagingSenderId: "965683515715",
  appId: "1:965683515715:web:57f082a0e79c2c6ffedff6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth 모듈 외부에서 사용할 수 있도록 export
export const auth = getAuth(app);
