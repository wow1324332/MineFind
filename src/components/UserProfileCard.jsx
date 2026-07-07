// src/components/UserProfileCard.jsx
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { getRequiredExp } from '../utils/expUtils';

export default function UserProfileCard({ user, isDimmed }) {
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
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-40 transition-all duration-300 ${isDimmed ? 'opacity-25 brightness-[0.3] pointer-events-none' : 'animate-[fadeIn_0.5s_ease-in-out]'}`}>
      
      {/* 💡 배경 색상을 지우고 양피지 배경 이미지를 적용했습니다! */}
      <div 
        className="rounded-xl p-3 flex items-center gap-4 shadow-[0_10px_25px_rgba(0,0,0,0.5)] relative overflow-hidden"
        style={{
          backgroundImage: "url('/popup-bg.png')", // 💡 마이페이지에서 쓰는 정확한 양피지 이미지 파일명으로 변경해 주세요!
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* 양피지 텍스처 위에 글씨가 더 잘 보이도록 아주 옅은 오버레이를 깔아줍니다 (선택 사항) */}
        <div className="absolute inset-0 bg-white/10 pointer-events-none z-0"></div>

        {/* 프로필 이미지 (사각형 프레임) */}
        <div className="w-12 h-12 rounded-md overflow-hidden border-2 border-[#4a2c11]/40 flex-shrink-0 shadow-md bg-neutral-800 relative z-10">
          <img 
            src={displayPhoto} 
            alt="Profile" 
            className="w-full h-full object-cover"
            draggable="false"
          />
        </div>

        {/* 유저 정보 & 경험치 바 영역 */}
        <div className="flex-1 flex flex-col justify-center relative z-10">
          
          <div className="flex justify-between items-end mb-1.5 px-1">
            <span className="text-[#4a2c11] font-black text-sm truncate max-w-[130px]">
              {displayNickname}
            </span>
            <span className="text-[#4a2c11] font-serif font-black text-xs tracking-wider uppercase">
              Lv.{level}
            </span>
          </div>

          {/* 경험치 Bar 배경 슬롯 */}
          <div className="w-full h-2.5 bg-[#dcc9b4]/80 rounded-full overflow-hidden border border-[#4a2c11]/20 relative shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#4a2c11] to-[#7c5230] transition-all duration-700 ease-out"
              style={{ width: `${expPercent}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-r from-transparent to-white/10 mix-blend-overlay"></div>
            </div>
          </div>
          
          <div className="text-right text-[9px] text-[#4a2c11]/80 mt-1 font-sans font-bold">
            {currentExp.toLocaleString()} / {requiredExp.toLocaleString()} EXP
          </div>
          
        </div>
      </div>
    </div>
  );
}
