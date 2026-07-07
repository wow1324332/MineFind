// src/components/UserProfileCard.jsx
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { getRequiredExp } from '../utils/expUtils';

export default function UserProfileCard({ user, isDimmed }) { // 💡 6번: 딤처리용 프롭 추가
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
  
  const expPercent = requiredExp > 0 ? Math.min((currentExp / requiredExp) * 105, 100) : 100;

  const displayNickname = userData.nickname || userData.displayName || user.displayName || '용사님';
  const displayPhoto = userData.photoURL || userData.profileImage || user.photoURL || '/My-icon.png';

  return (
    // 💡 2번&6번: 테두리(border) 제거, 마이프로필 스타일의 배경색(#f1e4d3) 적용
    // 💡 isDimmed 가 true 이면 투명도와 밝기를 낮춰 자연스럽게 백그라운드로 밀려나도록 딤처리 구현
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-40 transition-all duration-300 ${isDimmed ? 'opacity-25 brightness-[0.3] pointer-events-none' : 'animate-[fadeIn_0.5s_ease-in-out]'}`}>
      <div className="bg-[#f1e4d3] rounded-xl p-3 flex items-center gap-4 shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
        
        {/* 💡 1번: rounded-full을 제거하고 깔끔한 사각형(rounded-md) 프레임으로 변경 */}
        <div className="w-12 h-12 rounded-md overflow-hidden border-2 border-[#4a2c11]/40 flex-shrink-0 shadow-md bg-neutral-800">
          <img 
            src={displayPhoto} 
            alt="Profile" 
            className="w-full h-full object-cover"
            draggable="false"
          />
        </div>

        {/* 유저 정보 & 경험치 바 영역 */}
        <div className="flex-1 flex flex-col justify-center">
          
          {/* 💡 3번&5번: 모든 폰트를 고풍스러운 짙은 갈색(#4a2c11)으로 통일하고 레벨 폰트를 세리프(font-serif) 스타일로 교체 */}
          <div className="flex justify-between items-end mb-1.5 px-1">
            <span className="text-[#4a2c11] font-black text-sm truncate max-w-[130px]">
              {displayNickname}
            </span>
            <span className="text-[#4a2c11] font-serif font-black text-xs tracking-wider uppercase">
              Lv.{level}
            </span>
          </div>

          {/* 경험치 Bar 배경 슬롯 */}
          <div className="w-full h-2.5 bg-[#dcc9b4] rounded-full overflow-hidden border border-[#4a2c11]/10 relative shadow-inner">
            {/* 💡 4번: 경험치 게이지 색상을 테마에 어울리는 짙은 갈색 톤(from-[#4a2c11] to-[#7c5230]) 그라데이션으로 변경 */}
            <div
              className="h-full bg-gradient-to-r from-[#4a2c11] to-[#7c5230] transition-all duration-700 ease-out"
              style={{ width: `${expPercent}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-r from-transparent to-white/10 mix-blend-overlay"></div>
            </div>
          </div>
          
          {/* 💡 3번: 내측 하단 경험치 텍스트 역시 짙은 갈색 톤으로 일치 */}
          <div className="text-right text-[9px] text-[#4a2c11]/70 mt-1 font-sans font-bold">
            {currentExp.toLocaleString()} / {requiredExp.toLocaleString()} EXP
          </div>
          
        </div>
      </div>
    </div>
  );
}
