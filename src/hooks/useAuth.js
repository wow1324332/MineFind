// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'; 

// 💡 전역 문지기 (중복 실행 방지)
let initializedUid = null;

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      
      // 💡 1. 가장 중요한 핵심: DB 검사를 기다리지 않고 유저 상태부터 '즉시' 세팅합니다!
      setUser(currentUser);
      setLoading(false);

      // 💡 2. DB 초기화 및 검사는 화면 렌더링을 방해하지 않게 백그라운드에서 돕니다.
      if (currentUser && initializedUid !== currentUser.uid) {
        initializedUid = currentUser.uid;
        
        // async IIFE (비동기 즉시 실행 함수)로 묶어서 별도로 돌림
        (async () => {
          try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            const docSnap = await getDoc(userDocRef);
            
            if (!docSnap.exists()) {
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
                console.log("기존 유저 누락 데이터 보완 완료!");
              }
            }
          } catch (error) {
            console.error("유저 DB 초기화 중 에러 발생:", error);
            initializedUid = null; 
          }
        })(); // 즉시 실행 끝
      }
    });
    
    return () => unsubscribe();
  }, []);

  const logout = () => {
    initializedUid = null; 
    return signOut(auth);
  };

  return { user, loading, logout };
};
