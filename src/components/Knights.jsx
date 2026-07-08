// src/components/Knights.jsx
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { KNIGHT_DATABASE } from '../constants/knightData';

export default function Knights({ onBack }) {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  
  // 💡 상세 화면 전환을 위한 상태 (null이면 목록 화면, 값이 있으면 상세 화면)
  const [selectedKnight, setSelectedKnight] = useState(null);
  // 💡 상세 화면 내 탭 (stats = 스탯, equip = 장비)
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

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center px-6 pb-6 pt-0 animate-[fadeIn_0.5s_ease-in-out] overflow-hidden">
      
      {/* 1. 공통 배경 */}
      <div 
        className="absolute inset-x-0 top-[15%] bottom-0 bg-cover bg-bottom bg-no-repeat opacity-60 z-0 pointer-events-none"
        style={{ 
          backgroundImage: "url('/mypage-bg.jpeg')",
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)', 
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)' 
        }}
      ></div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center h-screen">
        
        {/* 2. 공통 헤더 영역 */}
        <div className="w-full max-w-sm mt-2 mb-0 mx-auto relative flex justify-center pointer-events-none z-20 shrink-0">
          <div className="w-full flex justify-center" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' }}>
            <img src="/knights-bt.png" alt="Knights Title" className="w-[85%] h-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.2)]" />
          </div>
        </div>

        <div className="w-full max-w-sm h-12 -mt-1 mb-4 flex justify-between items-center relative z-30 shrink-0">
          <div className="absolute top-0 w-[100vw] left-1/2 -translate-x-1/2 h-full bg-cover bg-center pointer-events-none -z-10" style={{ backgroundImage: "url('/header-bg.jpg')", WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)' }}>
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          {/* 💡 뒤로가기 버튼 로직: 상세 화면이면 목록으로, 목록이면 이전 화면으로! */}
          <button onClick={() => selectedKnight ? setSelectedKnight(null) : onBack()} className="transition-all duration-150 active:scale-90 px-2 outline-none">
            <img src="/backkey.png" alt="Back" className="w-8 h-8 object-contain" />
          </button>
          <div className="text-[#d8b486] font-serif font-black text-sm tracking-[0.3em] drop-shadow-md">
            ORDER OF KNIGHTS
          </div>
          <div className="w-12 px-2"></div>
        </div>
        
        {/* ========================================= */}
        {/* ⚔️ 화면 1. 기사단 목록(갤러리) 화면 ⚔️ */}
        {/* ========================================= */}
        {!selectedKnight && (
          <div className="w-full max-w-sm flex-1 overflow-y-auto custom-scrollbar animate-[fadeIn_0.3s_ease-in-out]">
            <div className="grid grid-cols-3 gap-3 p-1">
              
              {/* 기사 1번: 주인공 초상화 */}
              <div 
                onClick={() => setSelectedKnight('knight_main')}
                className="aspect-[3/4] relative rounded-sm bg-black border-2 border-[#5c3e23] shadow-[0_4px_10px_rgba(0,0,0,0.8)] cursor-pointer group hover:border-[#d8b486] hover:shadow-[0_0_15px_rgba(216,180,134,0.4)] transition-all overflow-hidden"
              >
                {/* 첨부해주신 이미지 반영 */}
                <img src={mainKnightBase.image} alt={mainKnightBase.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                
                {/* 다크 판타지 프레임 오버레이 */}
                <div className="absolute inset-0 border-[1px] border-[#a6845c]/30 pointer-events-none"></div>
                
                {/* 하단 정보 바 */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-6 pb-1 px-1 flex flex-col items-center">
                  <span className="text-yellow-400 font-serif font-black text-[10px] drop-shadow-md leading-none mb-0.5">Lv.{userLevel}</span>
                  <span className="text-[#f5d5a9] font-black text-[10px] truncate w-full text-center">{userNickname}</span>
                </div>
              </div>

              {/* 빈 슬롯 (미소환) */}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-[3/4] relative rounded-sm border-[1.5px] border-[#4a2c11]/40 border-dashed bg-[#1a1008]/50 flex items-center justify-center shadow-inner opacity-70">
                  <div className="w-6 h-6 border border-[#a6845c]/20 rotate-45 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#8c6543]/40 -rotate-45"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* 🛡️ 화면 2. 기사 상세(Detail) 화면 🛡️ */}
        {/* ========================================= */}
        {selectedKnight === 'knight_main' && (
          <div className="w-full max-w-sm flex flex-col flex-1 animate-[fadeIn_0.2s_ease-in-out]">
            
            {/* 상단: 선택된 기사 요약 프로필 */}
            <div className="flex bg-[#1e140d]/90 border border-[#4a3522] rounded-md p-3 mb-3 shadow-[0_4px_15px_rgba(0,0,0,0.8)] relative overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" style={{ backgroundImage: "url('/yangpiji-bg.jpeg')" }}></div>
              
              <div className="w-16 h-20 rounded-sm border border-[#5c3e23] overflow-hidden shrink-0 relative z-10">
                <img src={mainKnightBase.image} alt={mainKnightBase.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="ml-4 flex flex-col justify-center relative z-10 flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-yellow-400 font-serif font-black text-[11px] uppercase border border-yellow-500/30 bg-yellow-500/10 px-1 rounded-sm">Lv.{userLevel}</span>
                  <span className="text-[#8c6543] font-bold text-[10px]">{mainKnightBase.title}</span>
                </div>
                <span className="text-[#f5d5a9] font-black text-lg mb-1">{userNickname}</span>
                <span className="text-amber-400 font-serif font-black text-xs tracking-wide">
                  Combat Power : {combatPower.toLocaleString()}
                </span>
              </div>
            </div>

            {/* 중간: 탭 네비게이션 */}
            <div className="flex w-full bg-[#1a1008] border border-[#3c2a1a] rounded-sm p-1 mb-3 shrink-0 shadow-inner">
              <button onClick={() => setDetailTab('stats')} className={`flex-1 py-1.5 text-[12px] font-bold rounded-sm transition-all duration-200 ${detailTab === 'stats' ? 'bg-[#4a301c] text-[#f5d5a9] shadow-md' : 'text-[#8c6543] hover:text-[#d8b486]'}`}>스탯 정보</button>
              <button onClick={() => setDetailTab('equip')} className={`flex-1 py-1.5 text-[12px] font-bold rounded-sm transition-all duration-200 ${detailTab === 'equip' ? 'bg-[#4a301c] text-[#f5d5a9] shadow-md' : 'text-[#8c6543] hover:text-[#d8b486]'}`}>장비 착용</button>
            </div>

            {/* 하단: 탭 내용 영역 */}
            <div className="flex-1 w-full bg-[#2a1a10]/40 border border-[#4a2c11]/40 rounded-sm p-3 relative overflow-y-auto custom-scrollbar shadow-inner">
              
              {/* 스탯 탭 내용 */}
              {detailTab === 'stats' && (
                <div className="animate-[fadeIn_0.2s_ease-in-out] space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/40 border border-[#4a3522]/50 p-2 rounded-sm flex justify-between items-center">
                      <span className="text-[#8c6543] font-bold text-xs">✊ 힘 (STR)</span>
                      <span className="text-[#f5d5a9] font-black">{finalStats.str}</span>
                    </div>
                    <div className="bg-black/40 border border-[#4a3522]/50 p-2 rounded-sm flex justify-between items-center">
                      <span className="text-[#8c6543] font-bold text-xs">⚡ 민첩 (AGI)</span>
                      <span className="text-[#f5d5a9] font-black">{finalStats.agi}</span>
                    </div>
                    <div className="bg-black/40 border border-[#4a3522]/50 p-2 rounded-sm flex justify-between items-center">
                      <span className="text-[#8c6543] font-bold text-xs">🔮 지력 (INT)</span>
                      <span className="text-[#f5d5a9] font-black">{finalStats.int}</span>
                    </div>
                    <div className="bg-black/40 border border-[#4a3522]/50 p-2 rounded-sm flex justify-between items-center">
                      <span className="text-[#8c6543] font-bold text-xs">❤️ 체력 (VIT)</span>
                      <span className="text-[#f5d5a9] font-black">{finalStats.vit}</span>
                    </div>
                    <div className="bg-black/40 border border-[#4a3522]/50 p-2 rounded-sm flex justify-between items-center col-span-2">
                      <span className="text-[#8c6543] font-bold text-xs">🍀 운 (LUK)</span>
                      <span className="text-[#f5d5a9] font-black">{finalStats.luk}</span>
                    </div>
                  </div>

                  <div className="bg-[#1a1008] border border-[#a6845c]/30 p-2 rounded-sm mt-4">
                     <span className="text-[#d8b486] font-bold text-xs block mb-1">고유 특성 스킬</span>
                     <div className="text-[11px] text-[#8c6543]">
                       {userLevel < 10 ? 'Lv.10 도달 시 스킬 해금 가능' : '스킬 각성 대기 중...'}
                     </div>
                  </div>
                </div>
              )}

              {/* 장비 탭 내용 (현재는 슬롯 프레임만) */}
              {detailTab === 'equip' && (
                <div className="animate-[fadeIn_0.2s_ease-in-out]">
                  <div className="grid grid-cols-2 gap-4 place-items-center mt-2">
                    {/* 장비 슬롯 6개 (검, 방패, 투구, 갑옷, 장갑, 신발) */}
                    {['검', '방패', '투구', '갑옷', '장갑', '신발'].map((part, idx) => (
                      <div key={idx} className="w-16 h-16 bg-[#1a1008] border-2 border-[#4a3522]/60 rounded-sm relative flex items-center justify-center shadow-inner cursor-pointer hover:border-[#a6845c] transition-colors">
                         <span className="text-[#8c6543]/40 font-black text-[10px] absolute bottom-1">{part}</span>
                         <div className="w-full h-full flex items-center justify-center opacity-20">
                            {/* 임시 아이콘 (나중에 실제 장비 이미지로 대체) */}
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
