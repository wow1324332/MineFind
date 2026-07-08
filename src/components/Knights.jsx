// src/components/Knights.jsx
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { KNIGHT_DATABASE } from '../constants/knightData';

export default function Knights({ onBack }) {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  
  const [selectedKnight, setSelectedKnight] = useState(null);
  const [detailTab, setDetailTab] = useState('stats');

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

  const mainKnightBase = KNIGHT_DATABASE['knight_main'];
  const userLevel = userData.level || 1;
  const userNickname = userData.nickname || user.displayName || '무명의 용사';

  // 스탯 계산
  const finalStats = {
    str: mainKnightBase.baseStats.str + mainKnightBase.statGrowth.str * (userLevel - 1),
    agi: mainKnightBase.baseStats.agi + mainKnightBase.statGrowth.agi * (userLevel - 1),
    int: mainKnightBase.baseStats.int + mainKnightBase.statGrowth.int * (userLevel - 1),
    vit: mainKnightBase.baseStats.vit + mainKnightBase.statGrowth.vit * (userLevel - 1),
    luk: mainKnightBase.baseStats.luk + mainKnightBase.statGrowth.luk * (userLevel - 1),
  };
  const combatPower = (finalStats.str * 10) + (finalStats.agi * 8) + (finalStats.vit * 6) + (finalStats.int * 4) + (finalStats.luk * 2);

  // =========================================
  // 🛡️ 화면 2. 기사 상세 풀스크린 화면 🛡️
  // =========================================
  if (selectedKnight === 'knight_main') {
    return (
      <div className="relative min-h-screen bg-black text-white flex flex-col items-center animate-[fadeIn_0.3s_ease-in-out] overflow-hidden">
        
        {/* 1. 기사 고유 배경 이미지 (도감에서 bgImage를 가져옵니다) */}
        <div 
          className="absolute inset-0 bg-cover bg-top z-0 opacity-80"
          style={{ backgroundImage: `url(${mainKnightBase.bgImage || mainKnightBase.image})` }}
        ></div>
        
        {/* 2. 하단 UI가 잘 보이도록 밑에서부터 올라오는 다크 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-0"></div>

        <div className="relative z-10 w-full max-w-sm flex flex-col h-screen">
          
          {/* 상단 투명 헤더 (뒤로가기 버튼) */}
          <div className="w-full flex justify-between items-center p-4 pt-6 shrink-0">
            <button onClick={() => setSelectedKnight(null)} className="transition-all duration-150 active:scale-90 p-1 bg-black/30 rounded-full backdrop-blur-sm border border-white/10 outline-none">
              <img src="/backkey.png" alt="Back" className="w-6 h-6 object-contain opacity-80" />
            </button>
            <div className="w-8"></div> {/* 여백 밸런스 */}
          </div>

          {/* 하단 콘텐츠 영역 (캐릭터 정보, 탭, 스탯/장비) */}
          <div className="flex-1 flex flex-col justify-end p-5 pb-8">
            
            {/* 타이틀 및 전투력 텍스트 */}
            <div className="mb-5 animate-[slideUp_0.4s_ease-out]">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-yellow-400 font-serif font-black text-[12px] border border-yellow-500/50 bg-black/60 px-1.5 py-0.5 rounded-sm backdrop-blur-sm">Lv.{userLevel}</span>
                <span className="text-[#d8b486] font-bold text-xs drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">{mainKnightBase.title}</span>
              </div>
              <h2 className="text-[#f5d5a9] font-black text-4xl drop-shadow-[0_4px_4px_rgba(0,0,0,1)] tracking-tight mb-1">{userNickname}</h2>
              <div className="text-amber-400 font-serif font-black text-sm tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                CP : {combatPower.toLocaleString()}
              </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex w-full bg-black/50 border border-[#5c3e23]/70 rounded-md p-1 mb-4 shrink-0 backdrop-blur-md shadow-lg">
              <button onClick={() => setDetailTab('stats')} className={`flex-1 py-2 text-[12px] font-bold rounded-sm transition-all duration-200 ${detailTab === 'stats' ? 'bg-[#4a2c11] text-[#f5d5a9] shadow-inner' : 'text-[#8c6543] hover:text-[#d8b486]'}`}>스탯 정보</button>
              <button onClick={() => setDetailTab('equip')} className={`flex-1 py-2 text-[12px] font-bold rounded-sm transition-all duration-200 ${detailTab === 'equip' ? 'bg-[#4a2c11] text-[#f5d5a9] shadow-inner' : 'text-[#8c6543] hover:text-[#d8b486]'}`}>장비 착용</button>
            </div>

            {/* 탭 내부 콘텐츠 패널 */}
            <div className="w-full bg-black/60 border border-[#4a2c11]/50 rounded-md p-4 backdrop-blur-md shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] min-h-[220px]">
              
              {/* 스탯 탭 */}
              {detailTab === 'stats' && (
                <div className="animate-[fadeIn_0.2s_ease-in-out] space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-[#1a1008]/80 border border-[#5c3e23]/50 p-2.5 rounded-sm flex justify-between items-center shadow-inner">
                      <span className="text-[#a6845c] font-bold text-xs">✊ 힘</span>
                      <span className="text-[#f5d5a9] font-black">{finalStats.str}</span>
                    </div>
                    <div className="bg-[#1a1008]/80 border border-[#5c3e23]/50 p-2.5 rounded-sm flex justify-between items-center shadow-inner">
                      <span className="text-[#a6845c] font-bold text-xs">⚡ 민첩</span>
                      <span className="text-[#f5d5a9] font-black">{finalStats.agi}</span>
                    </div>
                    <div className="bg-[#1a1008]/80 border border-[#5c3e23]/50 p-2.5 rounded-sm flex justify-between items-center shadow-inner">
                      <span className="text-[#a6845c] font-bold text-xs">🔮 지력</span>
                      <span className="text-[#f5d5a9] font-black">{finalStats.int}</span>
                    </div>
                    <div className="bg-[#1a1008]/80 border border-[#5c3e23]/50 p-2.5 rounded-sm flex justify-between items-center shadow-inner">
                      <span className="text-[#a6845c] font-bold text-xs">❤️ 체력</span>
                      <span className="text-[#f5d5a9] font-black">{finalStats.vit}</span>
                    </div>
                    <div className="bg-[#1a1008]/80 border border-[#5c3e23]/50 p-2.5 rounded-sm flex justify-between items-center col-span-2 shadow-inner">
                      <span className="text-[#a6845c] font-bold text-xs">🍀 운 (LUK)</span>
                      <span className="text-[#f5d5a9] font-black">{finalStats.luk}</span>
                    </div>
                  </div>

                  <div className="bg-black/50 border border-[#a6845c]/40 p-3 rounded-sm mt-4">
                     <span className="text-[#d8b486] font-bold text-xs block mb-1.5">고유 특성 스킬</span>
                     <div className="text-[11px] text-[#8c6543]">
                       {userLevel < 10 ? 'Lv.10 도달 시 스킬 해금 가능' : '스킬 각성 대기 중...'}
                     </div>
                  </div>
                </div>
              )}

              {/* 장비 탭 */}
              {detailTab === 'equip' && (
                <div className="animate-[fadeIn_0.2s_ease-in-out]">
                  <div className="grid grid-cols-3 gap-3 place-items-center mt-1">
                    {['검', '투구', '장갑', '방패', '갑옷', '신발'].map((part, idx) => (
                      <div key={idx} className="w-16 h-16 bg-[#1a1008]/80 border-2 border-[#4a3522]/60 rounded-sm relative flex flex-col items-center justify-center shadow-inner cursor-pointer hover:border-[#a6845c] transition-colors">
                         <div className="w-full h-full flex items-center justify-center opacity-30">
                            <svg className="w-6 h-6 text-[#d8b486]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                         </div>
                         <span className="text-[#a6845c] font-bold text-[9px] absolute bottom-1 bg-black/50 px-1 rounded-sm">{part}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================
  // ⚔️ 화면 1. 기사단 목록(갤러리) 화면 ⚔️
  // =========================================
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center px-6 pb-6 pt-0 animate-[fadeIn_0.5s_ease-in-out] overflow-hidden">
      
      <div 
        className="absolute inset-x-0 top-[15%] bottom-0 bg-cover bg-bottom bg-no-repeat opacity-60 z-0 pointer-events-none"
        style={{ 
          backgroundImage: "url('/mypage-bg.jpeg')",
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)', 
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)' 
        }}
      ></div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center h-screen">
        
        <div className="w-full max-w-sm mt-2 mb-0 mx-auto relative flex justify-center pointer-events-none z-20 shrink-0">
          <div className="w-full flex justify-center" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' }}>
            <img src="/knights-title.jpg" alt="Knights Title" className="w-[85%] h-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.2)]" />
          </div>
        </div>

        <div className="w-full max-w-sm h-12 -mt-1 mb-4 flex justify-between items-center relative z-30 shrink-0">
          <div className="absolute top-0 w-[100vw] left-1/2 -translate-x-1/2 h-full bg-cover bg-center pointer-events-none -z-10" style={{ backgroundImage: "url('/header-bg.jpg')", WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)' }}>
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <button onClick={onBack} className="transition-all duration-150 active:scale-90 px-2 outline-none">
            <img src="/backkey.png" alt="Back" className="w-6 h-6 object-contain" />
          </button>
          <div className="w-12 px-2"></div>
        </div>
        
        <div className="w-full max-w-sm flex-1 overflow-y-auto custom-scrollbar animate-[fadeIn_0.3s_ease-in-out]">
          <div className="grid grid-cols-3 gap-3 p-1">
            
            <div 
              onClick={() => setSelectedKnight('knight_main')}
              className="aspect-[1/2] relative rounded-sm bg-black border-2 border-[#5c3e23] shadow-[0_4px_10px_rgba(0,0,0,0.8)] cursor-pointer group hover:border-[#d8b486] hover:shadow-[0_0_15px_rgba(216,180,134,0.4)] transition-all overflow-hidden"
            >
              <img src={mainKnightBase.image} alt={mainKnightBase.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 border-[1px] border-[#a6845c]/30 pointer-events-none"></div>
              
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/90 to-transparent pt-8 pb-1.5 px-1 flex flex-col items-center">
                <span className="text-yellow-400 font-serif font-black text-[10px] drop-shadow-md leading-none mb-0.5">Lv.{userLevel}</span>
                <span className="text-[#f5d5a9] font-black text-[10px] truncate w-full text-center">{userNickname}</span>
              </div>
            </div>

            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-[1/2] relative rounded-sm border-[1.5px] border-[#4a2c11]/40 border-dashed bg-[#1a1008]/50 flex items-center justify-center shadow-inner opacity-70">
                <div className="w-6 h-6 border border-[#a6845c]/20 rotate-45 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#8c6543]/40 -rotate-45"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
