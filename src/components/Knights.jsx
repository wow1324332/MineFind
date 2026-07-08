// src/components/Knights.jsx
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { KNIGHT_DATABASE } from '../constants/knightData';
import { EQUIP_DATABASE } from '../constants/equipData';

export default function Knights({ onBack }) {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  
  const [selectedKnight, setSelectedKnight] = useState(null);
  // 💡 모달 제어를 위한 장비 선택 상태 추가
  const [selectedEquipPart, setSelectedEquipPart] = useState(null);

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

  const defaultEquip = { tier: 0, element: 'neutral', enhance: 0 };
  const userEquipment = userData.equipment || {
    WEAPON: { ...defaultEquip },
    HELMET: { ...defaultEquip },
    SHIELD: { ...defaultEquip },
    ARMOR: { ...defaultEquip }
  };

  let equipBonus = { str: 0, agi: 0, int: 0, vit: 0, luk: 0 };
  const parsedEquip = {}; 

  ['WEAPON', 'HELMET', 'SHIELD', 'ARMOR'].forEach(part => {
    const state = userEquipment[part] || defaultEquip;
    const equipKey = `tier_${state.tier}_${state.element || 'neutral'}`;
    
    const dbData = EQUIP_DATABASE[part].evolutions[equipKey] || EQUIP_DATABASE[part].evolutions['tier_0_neutral'];
    const growth = EQUIP_DATABASE[part].enhanceGrowth;

    // 💡 현재 장비의 최종 스탯 계산 (기본 스탯 + 강화 보너스)
    const currentStats = {
      str: dbData.baseStat.str + (growth.str * state.enhance),
      agi: dbData.baseStat.agi + (growth.agi * state.enhance),
      int: dbData.baseStat.int + (growth.int * state.enhance),
      vit: dbData.baseStat.vit + (growth.vit * state.enhance),
      luk: dbData.baseStat.luk + (growth.luk * state.enhance),
    };

    parsedEquip[part] = {
      ...state,
      name: dbData.name,
      image: dbData.image,
      stats: currentStats
    };

    equipBonus.str += currentStats.str;
    equipBonus.agi += currentStats.agi;
    equipBonus.int += currentStats.int;
    equipBonus.vit += currentStats.vit;
    equipBonus.luk += currentStats.luk;
  });

  const finalStats = {
    str: mainKnightBase.baseStats.str + mainKnightBase.statGrowth.str * (userLevel - 1) + equipBonus.str,
    agi: mainKnightBase.baseStats.agi + mainKnightBase.statGrowth.agi * (userLevel - 1) + equipBonus.agi,
    int: mainKnightBase.baseStats.int + mainKnightBase.statGrowth.int * (userLevel - 1) + equipBonus.int,
    vit: mainKnightBase.baseStats.vit + mainKnightBase.statGrowth.vit * (userLevel - 1) + equipBonus.vit,
    luk: mainKnightBase.baseStats.luk + mainKnightBase.statGrowth.luk * (userLevel - 1) + equipBonus.luk,
  };
  const combatPower = (finalStats.str * 10) + (finalStats.agi * 8) + (finalStats.vit * 6) + (finalStats.int * 4) + (finalStats.luk * 2);

  // =========================================
  // 🛡️ 화면 2. 기사 상세 풀스크린 화면 🛡️
  // =========================================
  if (selectedKnight === 'knight_main') {
    return (
      <div className="relative min-h-screen bg-black text-white flex flex-col items-center animate-[fadeIn_0.3s_ease-in-out] overflow-hidden">
        
        <div 
          className="absolute inset-0 bg-cover bg-top z-0 opacity-100"
          style={{ backgroundImage: `url(${mainKnightBase.bgImage || mainKnightBase.image})` }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-0"></div>

        <div className="relative z-10 w-full max-w-sm flex flex-col h-screen">
          
          <div className="w-full flex justify-between items-center p-4 pt-6 shrink-0">
            <button onClick={() => setSelectedKnight(null)} className="transition-all duration-150 active:scale-90 p-1 outline-none">
              <img src="/backkey.png" alt="Back" className="w-6 h-6 object-contain opacity-80" />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-end p-5 pb-8">
            
            <div className="mb-4 animate-[slideUp_0.4s_ease-out] flex justify-between items-end">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-yellow-400 font-serif font-black text-[12px] border border-yellow-500/50 bg-black/60 px-1.5 py-0.5 rounded-sm backdrop-blur-sm">Lv.{userLevel}</span>
                  <span className="text-[#d8b486] font-bold text-xs drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">{mainKnightBase.title}</span>
                </div>
                <h2 className="text-[#f5d5a9] font-black text-4xl drop-shadow-[0_4px_4px_rgba(0,0,0,1)] tracking-tight mb-1">{userNickname}</h2>
                <div className="text-amber-400 font-serif font-black text-sm tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                  CP : {combatPower.toLocaleString()}
                </div>
              </div>
              
              <div className="flex flex-col items-center mb-1">
                <div className="w-12 h-12 bg-[#1a1008] border-[1.5px] border-[#a6845c] rounded-sm relative cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.8)] overflow-hidden group">
                  <img 
                    src="/default-skill-icon.png" 
                    alt="Skill" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-300" 
                    onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%231a1008'/%3E%3Ccircle cx='12' cy='12' r='6' fill='%238c6543'/%3E%3C/svg%3E" }} 
                  />
                </div>
              </div>
            </div>

            <div className="w-full border-2 border-[#5c3e23] rounded-md p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-[slideUp_0.5s_ease-out] relative overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/yangpiji-bg.jpeg')" }}></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-center border-b-[1.5px] border-[#8c6543]/40 pb-3 mb-3 px-1">
                  {[
                    { label: 'STR', val: finalStats.str },
                    { label: 'AGI', val: finalStats.agi },
                    { label: 'INT', val: finalStats.int },
                    { label: 'VIT', val: finalStats.vit },
                    { label: 'LUK', val: finalStats.luk }
                  ].map((stat, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <span className="text-[#3a2210] font-serif font-black text-[11px] tracking-widest mb-0.5 drop-shadow-sm">{stat.label}</span>
                      <span className="text-[#3a2210] font-serif font-black text-[15px] drop-shadow-sm">{stat.val}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center px-1">
                  {['WEAPON', 'HELMET', 'SHIELD', 'ARMOR'].map((part, idx) => {
                    const equipItem = parsedEquip[part];
                    return (
                      <div 
                        key={idx} 
                        onClick={() => setSelectedEquipPart(part)} // 💡 클릭 시 해당 부위를 상태로 저장하여 모달을 띄움
                        className="w-[21%] aspect-square max-w-[60px] bg-[#3a2210]/5 border border-[#5c3e23]/60 rounded-sm relative flex items-center justify-center shadow-[inset_0_2px_5px_rgba(0,0,0,0.2)] cursor-pointer hover:border-[#3a2210] transition-colors group"
                      >
                        {equipItem.enhance > 0 && (
                          <span className="absolute -top-1 -left-1 bg-black/80 text-yellow-500 font-black text-[10px] px-1 rounded-sm shadow-md border border-[#5c3e23] z-20">
                            +{equipItem.enhance}
                          </span>
                        )}
                        <div className="w-full h-full p-2.5 opacity-60 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <img 
                            src={equipItem.image} 
                            alt={equipItem.name} 
                            className="w-full h-full object-contain drop-shadow-md"
                            onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233a2210'%3E%3Cpath d='M12 2L2 22h20L12 2z'/%3E%3C/svg%3E"; }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================= */}
        {/* 🔮 장비 상세 및 강화/진화 모달 🔮 */}
        {/* ========================================= */}
        {selectedEquipPart && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-in-out]">
            <div className="w-full max-w-xs border-2 border-[#5c3e23] rounded-md shadow-[0_10px_40px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col">
              
              {/* 모달 양피지 배경 */}
              <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/yangpiji-bg.jpeg')" }}></div>
              
              <div className="relative z-10 flex flex-col p-5">
                {/* 닫기 버튼 */}
                <button 
                  onClick={() => setSelectedEquipPart(null)} 
                  className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-[#5c3e23] hover:text-[#3a2210] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                {/* 장비 아이콘 및 명칭 */}
                <div className="flex flex-col items-center mb-4 mt-2">
                  <div className="w-16 h-16 bg-[#3a2210]/10 border border-[#5c3e23] rounded-sm flex items-center justify-center shadow-inner mb-3 relative">
                    {parsedEquip[selectedEquipPart].enhance > 0 && (
                      <span className="absolute -top-1.5 -left-1.5 bg-black/80 text-yellow-500 font-black text-xs px-1.5 py-0.5 rounded-sm shadow-md border border-[#5c3e23]">
                        +{parsedEquip[selectedEquipPart].enhance}
                      </span>
                    )}
                    <img 
                      src={parsedEquip[selectedEquipPart].image} 
                      alt={parsedEquip[selectedEquipPart].name} 
                      className="w-full h-full object-contain p-2 opacity-80"
                      onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233a2210'%3E%3Cpath d='M12 2L2 22h20L12 2z'/%3E%3C/svg%3E"; }} 
                    />
                  </div>
                  <h3 className="text-[#3a2210] font-black text-lg text-center leading-tight drop-shadow-sm">
                    {parsedEquip[selectedEquipPart].name}
                  </h3>
                  <span className="text-[#8c6543] font-bold text-[10px] tracking-widest mt-1">
                    [ 티어 {parsedEquip[selectedEquipPart].tier} / {selectedEquipPart} ]
                  </span>
                </div>

                {/* 현재 장비 스탯 요약 */}
                <div className="bg-[#3a2210]/5 border border-[#8c6543]/30 rounded-sm p-3 mb-5">
                  <div className="text-[#5c3e23] font-black text-[11px] mb-2 border-b border-[#8c6543]/30 pb-1">부여된 스탯</div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(parsedEquip[selectedEquipPart].stats)
                      .filter(([_, val]) => val > 0) // 값이 0 초과인 스탯만 필터링하여 노출
                      .map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-[#5c3e23] font-bold text-xs uppercase">{key}</span>
                          <span className="text-[#3a2210] font-black text-sm">+{val}</span>
                        </div>
                    ))}
                  </div>
                </div>

                {/* 액션 버튼 그룹 */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-[#4a2c11] hover:bg-[#3a2210] text-[#f5d5a9] font-bold text-xs py-2.5 rounded-sm transition-colors border border-[#5c3e23] shadow-md active:scale-95">
                    장비 강화
                  </button>
                  <button className="flex-1 bg-[#1a1008] hover:bg-black text-amber-400 font-bold text-xs py-2.5 rounded-sm transition-colors border border-[#a6845c] shadow-md active:scale-95">
                    속성 진화
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

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
