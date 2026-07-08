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
        
        {/* 기사 고유 배경 이미지 */}
        <div 
          className="absolute inset-0 bg-cover bg-top z-0 opacity-80"
          style={{ backgroundImage: `url(${mainKnightBase.bgImage || mainKnightBase.image})` }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-0"></div>

        <div className="relative z-10 w-full max-w-sm flex flex-col h-screen">
          
          <div className="w-full flex justify-between items-center p-4 pt-6 shrink-0">
            <button onClick={() => setSelectedKnight(null)} className="transition-all duration-150 active:scale-90 p-1 bg-black/30 rounded-full backdrop-blur-sm border border-white/10 outline-none">
              <img src="/backkey.png" alt="Back" className="w-7 h-7 object-contain opacity-80" />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-end p-5 pb-8">
            
            {/* 💡 수정 1. 타이틀 영역 & 고유 스킬 우측 배치 */}
            <div className="mb-5 animate-[slideUp_0.4s_ease-out] flex justify-between items-end">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-yellow-400 font-serif font-black text-[12px] border border-yellow-500/50 bg-black/60 px-1.5 py-0.5 rounded-sm backdrop-blur-sm">Lv.{userLevel}</span>
                  <span className="text-[#d8b486] font-bold text-xs drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">{mainKnightBase.title}</span>
                </div>
                {/* 닉네임이 보이는 곳 우측에 스킬을 배치하기 위해 레이아웃을 나눔 */}
                <h2 className="text-[#f5d5a9] font-black text-4xl drop-shadow-[0_4px_4px_rgba(0,0,0,1)] tracking-tight mb-1">{userNickname}</h2>
                <div className="text-amber-400 font-serif font-black text-sm tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                  CP : {combatPower.toLocaleString()}
                </div>
              </div>
              
              {/* 기사명 우측 끝 고유 스킬 아이콘 */}
              <div className="flex flex-col items-center mb-1">
                <span className="text-[#8c6543] font-bold text-[8px] tracking-widest mb-1.5 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">SKILL</span>
                <div className="w-12 h-12 bg-[#1a1008] border-[1.5px] border-[#a6845c] rounded-sm relative cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.8)] overflow-hidden group">
                  {/* 스킬 임시 이미지 (나중에 /skill-icon.png 같은 걸로 교체하세요) */}
                  <img 
                    src="/default-skill-icon.png" 
                    alt="Skill" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-300" 
                    onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%231a1008'/%3E%3Ccircle cx='12' cy='12' r='5' fill='%238c6543'/%3E%3C/svg%3E" }} 
                  />
                </div>
              </div>
            </div>

            <div className="flex w-full bg-black/50 border border-[#5c3e23]/70 rounded-md p-1 mb-4 shrink-0 backdrop-blur-md shadow-lg">
              <button onClick={() => setDetailTab('stats')} className={`flex-1 py-2 text-[12px] font-bold rounded-sm transition-all duration-200 ${detailTab === 'stats' ? 'bg-[#4a2c11] text-[#f5d5a9] shadow-inner' : 'text-[#8c6543] hover:text-[#d8b486]'}`}>스탯 정보</button>
              <button onClick={() => setDetailTab('equip')} className={`flex-1 py-2 text-[12px] font-bold rounded-sm transition-all duration-200 ${detailTab === 'equip' ? 'bg-[#4a2c11] text-[#f5d5a9] shadow-inner' : 'text-[#8c6543] hover:text-[#d8b486]'}`}>장비 진화</button>
            </div>

            {/* 💡 수정 2 & 3. 탭 내부를 타이트하게 조절 (min-h 제거, 불필요한 여백 최소화) */}
            <div className="w-full bg-black/60 border border-[#4a2c11]/50 rounded-md p-3.5 backdrop-blur-md shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
              
              {/* 스탯 탭 내용 */}
              {detailTab === 'stats' && (
                <div className="animate-[fadeIn_0.2s_ease-in-out]">
                  {/* 컨테이너 나누지 않고 하나의 표처럼 리스트 형태로 배치, 아이콘 제거 */}
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center border-b border-[#5c3e23]/40 py-2.5 px-2">
                      <span className="text-[#a6845c] font-bold text-xs tracking-widest">힘 (STR)</span>
                      <span className="text-[#f5d5a9] font-black text-sm">{finalStats.str}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#5c3e23]/40 py-2.5 px-2">
                      <span className="text-[#a6845c] font-bold text-xs tracking-widest">민첩 (AGI)</span>
                      <span className="text-[#f5d5a9] font-black text-sm">{finalStats.agi}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#5c3e23]/40 py-2.5 px-2">
                      <span className="text-[#a6845c] font-bold text-xs tracking-widest">지력 (INT)</span>
                      <span className="text-[#f5d5a9] font-black text-sm">{finalStats.int}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#5c3e23]/40 py-2.5 px-2">
                      <span className="text-[#a6845c] font-bold text-xs tracking-widest">체력 (VIT)</span>
                      <span className="text-[#f5d5a9] font-black text-sm">{finalStats.vit}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 px-2">
                      <span className="text-[#a6845c] font-bold text-xs tracking-widest">운 (LUK)</span>
                      <span className="text-[#f5d5a9] font-black text-sm">{finalStats.luk}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 장비 탭 내용 */}
              {detailTab === 'equip' && (
                <div className="animate-[fadeIn_0.2s_ease-in-out] px-1 py-1">
                  {/* 컨테이너 사이 간격을 좁혀 타이트하게 구성 */}
                  <div className="grid grid-cols-3 gap-x-2 gap-y-4 place-items-center">
                    {['WEAPON', 'HELMET', 'GLOVES', 'SHIELD', 'ARMOR', 'SHOES'].map((part, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                         {/* 장비 명칭을 밖으로 빼서 상단 배치 */}
                         <span className="text-[#a6845c] font-bold text-[9px] tracking-widest mb-1.5">{part}</span>
                         
                         {/* 기본 아이템이 장착된 제단(프레임) */}
                         <div className="w-[52px] h-[52px] bg-[#1a1008] border border-[#5c3e23] rounded-sm relative flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] cursor-pointer hover:border-[#a6845c] transition-colors">
                            {/* 디폴트 기본 장비 이미지 (실제 이미지가 없을 때를 대비한 SVG 플레이스홀더) */}
                            <div className="w-full h-full p-2 opacity-50 flex items-center justify-center">
                              <img 
                                src={`/equip-default-${part.toLowerCase()}.png`} 
                                alt={part} 
                                className="w-full h-full object-contain"
                                onError={(e) => { 
                                  // 이미지가 없을 때 출력되는 기본 쐐기/보석 모양
                                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%235c3e23'%3E%3Cpath d='M12 2L2 22h20L12 2z'/%3E%3C/svg%3E";
                                }} 
                              />
                            </div>
                         </div>
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
            <img src="/knights-bt.png" alt="Knights Title" className="w-[85%] h-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.2)]" />
          </div>
        </div>

        <div className="w-full max-w-sm h-12 -mt-1 mb-4 flex justify-between items-center relative z-30 shrink-0">
          <div className="absolute top-0 w-[100vw] left-1/2 -translate-x-1/2 h-full bg-cover bg-center pointer-events-none -z-10" style={{ backgroundImage: "url('/header-bg.jpg')", WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)' }}>
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <button onClick={onBack} className="transition-all duration-150 active:scale-90 px-2 outline-none">
            <img src="/backkey.png" alt="Back" className="w-8 h-8 object-contain" />
          </button>
          <div className="text-[#d8b486] font-serif font-black text-sm tracking-[0.3em] drop-shadow-md">
            ORDER OF KNIGHTS
          </div>
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
