import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// 💡 [추가] 데이터베이스(Firestore) 기능을 사용하기 위해 불러옵니다.
import { getFirestore } from "firebase/firestore"; 

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

// 💡 [추가] MyPage 등 다른 컴포넌트에서 데이터베이스를 사용할 수 있도록 진짜 db를 생성하고 export 합니다!
export const db = getFirestore(app);
