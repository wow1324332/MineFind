// src/components/UserProfileCard.jsx
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { getRequiredExp } from '../utils/expUtils';

export default function UserProfileCard({ user }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    });
    return () => unsubscribe();
  }, [user]);

  if (!user || !userData) return null;

  const level = userData.level || 1;
  const currentExp = userData.exp || 0;
  const requiredExp = getRequiredExp(level);
  
  const expPercent = requiredExp > 0 ? Math.min((currentExp / requiredExp) * 100, 100) : 100;

  // 💡 수정된 부분: Firestore DB(userData)에 저장된 커스텀 프로필 정보를 최우선으로 가져옵니다!
  // (DB에 없으면 구글 계정 정보, 그것도 없으면 기본값 사용)
  const displayNickname = userData.nickname || userData.displayName || user.displayName || '용사님';
  const displayPhoto = userData.photoURL || userData.profileImage || user.photoURL || '/My-icon.png';

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-40 animate-[fadeIn_0.5s_ease-in-out]">
      <div className="bg-black/60 backdrop-blur-md border border-[#a6845c]/40 rounded-xl p-3 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
        
        {/* 1. 프로필 이미지 영역 */}
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#d8b486]/70 flex-shrink-0 shadow-[0_0_10px_rgba(216,180,134,0.3)] bg-neutral-800">
          <img 
            src={displayPhoto} // 💡 DB에서 가져온 이미지 적용!
            alt="Profile" 
            className="w-full h-full object-cover"
            draggable="false"
          />
        </div>

        {/* 2. 유저 정보 & 경험치 바 영역 */}
        <div className="flex-1 flex flex-col justify-center">
          
          <div className="flex justify-between items-end mb-1.5 px-1">
            {/* 💡 DB에서 가져온 닉네임 적용! */}
            <span className="text-[#f5d5a9] font-bold text-sm drop-shadow-md truncate max-w-[130px]">
              {displayNickname}
            </span>
            <span className="text-yellow-400 font-black text-xs italic drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
              Lv.{level}
            </span>
          </div>

          <div className="w-full h-2.5 bg-black/80 rounded-full overflow-hidden border border-white/10 relative shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 transition-all duration-700 ease-out"
              style={{ width: `${expPercent}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-r from-transparent to-white/30 mix-blend-overlay"></div>
            </div>
          </div>
          
          <div className="text-right text-[9px] text-blue-200/60 mt-1 font-sans font-medium">
            {currentExp.toLocaleString()} / {requiredExp.toLocaleString()} EXP
          </div>
          
        </div>
      </div>
    </div>
  );
}
