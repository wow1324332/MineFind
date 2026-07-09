// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'; 

// 💡 핵심 해결책: 앱 전체에서 DB 초기화가 중복 실행되지 않도록 막아주는 전역 문지기 변수
let initializedUid = null;

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      
      // 💡 유저가 확인되었고, '아직 이 유저의 DB를 세팅하지 않았을 때'만 단 1번 통과시킵니다.
      if (currentUser && initializedUid !== currentUser.uid) {
        initializedUid = currentUser.uid; // 통과 즉시 문을 잠급니다.
        
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (!docSnap.exists()) {
            // 1️⃣ 신규 유저 뼈대 생성
            await setDoc(userDocRef, {
              nickname: currentUser.displayName || '무명의 용사',
              level: 1,
              exp: 0,
              inventory: { gold: 0, items: {} },
              unlockedKnights: ['knight_main'], 
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
            
          } else {
            // 2️⃣ 기존 유저 마이그레이션 보완
            const data = docSnap.data();
            const updates = {};

            if (!data.unlockedKnights) updates.unlockedKnights = ['knight_main'];
            if (!data.equipment) {
              updates.equipment = {
                WEAPON: { tier: 0, element: 'neutral', enhance: 0 },
                HELMET: { tier: 0, element: 'neutral', enhance: 0 },
                SHIELD: { tier: 0, element: 'neutral', enhance: 0 },
                ARMOR: { tier: 0, element: 'neutral', enhance: 0 }
              };
            }
            if (!data.inventory) updates.inventory = { gold: data.gold || 0, items: {} };

            if (Object.keys(updates).length > 0) {
              await updateDoc(userDocRef, updates);
              console.log("기존 유저의 누락된 데이터 보완 완료!");
            }
          }
        } catch (error) {
          console.error("유저 DB 초기화 중 에러 발생:", error);
          initializedUid = null; // 에러가 나면 다음 렌더링 때 다시 시도할 수 있게 잠금을 풀어줍니다.
        }
      }

      setUser(currentUser);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const logout = () => {
    initializedUid = null; // 로그아웃 시 문지기도 초기화
    return signOut(auth);
  };

  return { user, loading, logout };
};
