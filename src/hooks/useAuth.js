// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'; 

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (!docSnap.exists()) {
            // 1️⃣ 아예 처음 온 신규 유저: 전체 뼈대 생성
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
            // 2️⃣ 기존 유저: 누락된 필드가 있는지 검사하고 보완 (마이그레이션)
            const data = docSnap.data();
            const updates = {};

            if (!data.unlockedKnights) {
              updates.unlockedKnights = ['knight_main'];
            }
            if (!data.equipment) {
              updates.equipment = {
                WEAPON: { tier: 0, element: 'neutral', enhance: 0 },
                HELMET: { tier: 0, element: 'neutral', enhance: 0 },
                SHIELD: { tier: 0, element: 'neutral', enhance: 0 },
                ARMOR: { tier: 0, element: 'neutral', enhance: 0 }
              };
            }
            if (!data.inventory) {
              updates.inventory = { gold: data.gold || 0, items: {} };
            }

            // 업데이트할 내용이 모였다면 기존 데이터 손실 없이 덧붙임
            if (Object.keys(updates).length > 0) {
              await updateDoc(userDocRef, updates);
              console.log("기존 유저의 누락된 데이터 보완 완료!");
            }
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
