// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // 💡 db 임포트 추가
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // 💡 DB 조작용 함수 추가

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 유저의 로그인 상태가 변할 때마다 감지
    // 💡 async를 추가하여 내부에서 DB 작업을 기다릴 수 있게 변경
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      
      // 💡 유저가 로그인 상태(currentUser 존재)라면 DB 문서를 검사하고 생성
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userDocRef);
          
          // 해당 유저의 DB가 파이어스토어에 없다면 초기 뼈대 세팅
          if (!docSnap.exists()) {
            await setDoc(userDocRef, {
              nickname: currentUser.displayName || '무명의 용사',
              level: 1,
              exp: 0,
              inventory: { 
                gold: 0, 
                items: {} 
              },
              unlockedKnights: ['knight_main'], // 주인공 기본 지급 강제 확정
              equipment: {
                WEAPON: { tier: 0, element: 'neutral', enhance: 0 },
                HELMET: { tier: 0, element: 'neutral', enhance: 0 },
                SHIELD: { tier: 0, element: 'neutral', enhance: 0 },
                ARMOR: { tier: 0, element: 'neutral', enhance: 0 }
              },
              stats: { wins: 0, losses: 0 },
              records: [],
              createdAt: new Date().getTime()
            });
            console.log("신규 유저 DB 생성 완료!");
          }
        } catch (error) {
          console.error("유저 DB 초기화 중 에러 발생:", error);
        }
      }

      setUser(currentUser);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return { user, loading, logout };
};
