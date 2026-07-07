// src/components/UserProfileCard.jsx
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { getRequiredExp } from '../utils/expUtils';

export default function UserProfileCard({ user }) {
  const [userData, setUserData] = useState(null);

  // 💡 파이어베이스에서 내 정보(레벨, 경험치)를 실시간으로 가져옵니다.
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    });
    // 컴포넌트가 화면에서 사라질 때 실시간 통신 종료
    return () => unsubscribe();
  }, [user]);

  if (!user || !userData) return null;

  const level = userData.level || 1;
  const currentExp = userData.exp || 0;
  const requiredExp = getRequiredExp(level);
  
  // 💡 경험치 바(Bar) 퍼센트 계산 (만렙일 경우 100% 고정)
  const expPercent = requiredExp > 0 ? Math.min((currentExp / requiredExp) * 100, 100) : 100;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-40 animate-[fadeIn_0.5s_ease-in-out]">
      <div className="bg-black/60 backdrop-blur-md border border-[#a6845c]/40 rounded-xl p-3 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
        
        {/* 1. 프로필 이미지 영역 */}
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#d8b486]/70 flex-shrink-0 shadow-[0_0_10px_rgba(216,180,134,0.3)] bg-neutral-800">
          <img 
            src={user.photoURL || '/My-icon.png'} // 프사가 없으면 기본 아이콘 표시
            alt="Profile" 
            className="w-full h-full object-cover"
            draggable="false"
          />
        </div>

        {/* 2. 유저 정보 & 경험치 바 영역 */}
        <div className="flex-1 flex flex-col justify-center">
          
          <div className="flex justify-between items-end mb-1.5 px-1">
            {/* 닉네임 */}
            <span className="text-[#f5d5a9] font-bold text-sm drop-shadow-md truncate max-w-[130px]">
              {user.displayName || '용사님'}
            </span>
            {/* 레벨 */}
            <span className="text-yellow-400 font-black text-xs italic drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
              Lv.{level}
            </span>
          </div>

          {/* 경험치 Bar (배경) */}
          <div className="w-full h-2.5 bg-black/80 rounded-full overflow-hidden border border-white/10 relative shadow-inner">
            {/* 경험치 Bar (차오르는 부분) */}
            <div
              className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 transition-all duration-700 ease-out"
              style={{ width: `${expPercent}%` }}
            >
              {/* 반짝이는 효과 */}
              <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-r from-transparent to-white/30 mix-blend-overlay"></div>
            </div>
          </div>
          
          {/* 경험치 텍스트 표기 (현재 / 목표) */}
          <div className="text-right text-[9px] text-blue-200/60 mt-1 font-sans font-medium">
            {currentExp.toLocaleString()} / {requiredExp.toLocaleString()} EXP
          </div>
          
        </div>
      </div>
    </div>
  );
}
