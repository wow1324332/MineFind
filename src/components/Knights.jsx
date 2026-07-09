// src/components/Knights.jsx
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { KNIGHT_DATABASE } from '../constants/knightData';
import { EQUIP_DATABASE } from '../constants/equipData';
import { ITEM_DATABASE } from '../constants/itemData'; 
import { getKnightRequiredExp, processKnightExpGain } from '../utils/expUtils';

export default function Knights({ onBack }) {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  
  const [selectedKnight, setSelectedKnight] = useState(null);
  const [selectedEquipPart, setSelectedEquipPart] = useState(null);

  // 🔮 소환 시스템용 상태 
  const [showSummonModal, setShowSummonModal] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [summoningKnight, setSummoningKnight] = useState(null);
  const [showCinematicText, setShowCinematicText] = useState(false);
  
  // 💡 캐러셀(좌우 스크롤) 중앙 포커싱을 위한 인덱스 상태 및 터치 상태
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

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

  const userLevel = userData.level || 1;
  const userNickname = userData.nickname || user.displayName || '무명의 용사';
  
  const gold = userData.inventory?.gold || 0;
  const items = userData.inventory?.items || {};
  const dbUnlocked = userData.unlockedKnights || [];
  const unlockedKnights = dbUnlocked.includes('knight_main')
    ? dbUnlocked
    : ['knight_main', ...dbUnlocked];
  const maxSlots = 6; 

  // =========================================
  // 🛡️ 장비 및 스탯 계산 로직 
  // =========================================
  const defaultEquip = { tier: 0, element: 'neutral', enhance: 0 };
  const userEquipment = userData.equipment || {
    WEAPON: { ...defaultEquip }, HELMET: { ...defaultEquip },
    SHIELD: { ...defaultEquip }, ARMOR: { ...defaultEquip }
  };

  let equipBonus = { str: 0, agi: 0, int: 0, vit: 0, luk: 0 };
  const parsedEquip = {}; 

  ['WEAPON', 'HELMET', 'SHIELD', 'ARMOR'].forEach(part => {
    const state = userEquipment[part] || defaultEquip;
    const equipKey = `tier_${state.tier}_${state.element || 'neutral'}`;
    const dbData = EQUIP_DATABASE[part]?.evolutions[equipKey] || EQUIP_DATABASE[part]?.evolutions['tier_0_neutral'];
    const growth = EQUIP_DATABASE[part]?.enhanceGrowth || { str:0, agi:0, int:0, vit:0, luk:0 };

    const currentStats = {
      str: dbData.baseStat.str + (growth.str * state.enhance),
      agi: dbData.baseStat.agi + (growth.agi * state.enhance),
      int: dbData.baseStat.int + (growth.int * state.enhance),
      vit: dbData.baseStat.vit + (growth.vit * state.enhance),
      luk: dbData.baseStat.luk + (growth.luk * state.enhance),
    };

    parsedEquip[part] = { ...state, name: dbData.name, image: dbData.image, stats: currentStats };

    equipBonus.str += currentStats.str;
    equipBonus.agi += currentStats.agi;
    equipBonus.int += currentStats.int;
    equipBonus.vit += currentStats.vit;
    equipBonus.luk += currentStats.luk;
  });

  let activeKnightBase = null;
  let activeKnightLevel = 1; // 💡 기사 개별 레벨 변수 추가
  let finalStats = { str: 0, agi: 0, int: 0, vit: 0, luk: 0 };
  let combatPower = 0;
  let displayTitle = '';
  let displayName = '';

  if (selectedKnight) {
    activeKnightBase = KNIGHT_DATABASE[selectedKnight];
    displayTitle = activeKnightBase.title;
    displayName = selectedKnight === 'knight_main' ? userNickname : activeKnightBase.name;

    // 💡 핵심: 주인공은 유저 레벨을, 소환된 기사는 DB의 개별 레벨(없으면 기본 1)을 사용합니다!
    activeKnightLevel = selectedKnight === 'knight_main' 
      ? userLevel 
      : (userData.knightStats?.[selectedKnight]?.level || 1);

    const activeKnightExp = selectedKnight === 'knight_main' ? 0 : (userData.knightStats?.[selectedKnight]?.exp || 0);
    const requiredKnightExp = selectedKnight === 'knight_main' ? 1 : getKnightRequiredExp(activeKnightLevel);
    const knightExpPercent = selectedKnight === 'knight_main' ? 100 : Math.min((activeKnightExp / requiredKnightExp) * 100, 100);

    finalStats = {
      str: activeKnightBase.baseStats.str + activeKnightBase.statGrowth.str * (activeKnightLevel - 1) + equipBonus.str,
      agi: activeKnightBase.baseStats.agi + activeKnightBase.statGrowth.agi * (activeKnightLevel - 1) + equipBonus.agi,
      int: activeKnightBase.baseStats.int + activeKnightBase.statGrowth.int * (activeKnightLevel - 1) + equipBonus.int,
      vit: activeKnightBase.baseStats.vit + activeKnightBase.statGrowth.vit * (activeKnightLevel - 1) + equipBonus.vit,
      luk: activeKnightBase.baseStats.luk + activeKnightBase.statGrowth.luk * (activeKnightLevel - 1) + equipBonus.luk,
    };
    combatPower = (finalStats.str * 10) + (finalStats.agi * 8) + (finalStats.vit * 6) + (finalStats.int * 4) + (finalStats.luk * 2);
  }

// =========================================
  // 🔮 기사 소환 처리 함수
  // =========================================
  const handleSummon = async (knight) => {
    const isOwned = unlockedKnights.includes(knight.id);
    if (isOwned) return;

    const { itemId, count, gold: costGold } = knight.cost;
    const userItemCount = items[itemId] || 0;

    if (gold < costGold) { alert("골드가 부족합니다!"); return; }
    if (userItemCount < count) { alert("소환 재료 아이템이 부족합니다!"); return; }

    setShowSummonModal(false);
    setSummoningKnight(knight); 

    setTimeout(async () => {
      setShowCinematicText(true);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          'inventory.gold': increment(-costGold),
          [`inventory.items.${itemId}`]: increment(-count),
          unlockedKnights: arrayUnion(knight.id),
          // 💡 추가된 부분: 기사를 소환하면 해당 기사의 고유 ID를 키값으로 1레벨/0경험치 데이터를 세팅합니다.
          [`knightStats.${knight.id}`]: { level: 1, exp: 0 }
        });
      }
    }, 2500);
  };

  const closeCinematic = () => {
    setSummoningKnight(null);
    setShowCinematicText(false);
  };

  const summonableKnights = Object.values(KNIGHT_DATABASE).filter(k => k.cost);

  // 💡 캐러셀 스와이프 로직
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const distance = touchStart - e.changedTouches[0].clientX;
    if (distance > 50 && focusedIndex < summonableKnights.length - 1) setFocusedIndex(prev => prev + 1);
    if (distance < -50 && focusedIndex > 0) setFocusedIndex(prev => prev - 1);
    setTouchStart(null);
  };


  // =========================================
  // 🛡️ 화면 2. 기사 상세 풀스크린 화면 
  // =========================================
  if (selectedKnight) {
    return (
      <div className="relative min-h-screen bg-black text-white flex flex-col items-center animate-[fadeIn_0.3s_ease-in-out] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-top z-0 opacity-100"
          style={{ backgroundImage: `url(${activeKnightBase.bgImage || activeKnightBase.fullImage || activeKnightBase.image})` }}
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
                <div 
                  onClick={() => {
                    if (selectedKnight !== 'knight_main') setShowLevelUpModal(true);
                  }}
                  className={`flex items-center justify-center bg-black/60 border border-yellow-500/50 px-2 py-0.5 rounded-sm backdrop-blur-sm transition-all
                    ${selectedKnight !== 'knight_main' ? 'cursor-pointer hover:scale-110 active:scale-95 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : ''}`}
                >
                  <span className="text-yellow-400 font-serif font-black text-[12px] leading-none">Lv.{activeKnightLevel}</span>
                </div>
                  <span className="text-[#d8b486] font-bold text-xs drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">{displayTitle}</span>
                </div>
                <h2 className="text-[#f5d5a9] font-black text-4xl drop-shadow-[0_4px_4px_rgba(0,0,0,1)] tracking-tight mb-1">{displayName}</h2>
                <div className="text-amber-400 font-serif font-black text-sm tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                  CP : {combatPower.toLocaleString()}
                </div>
              </div>
              
              <div className="flex flex-col items-center mb-1">
                <div className="w-12 h-12 bg-[#1a1008] border-[1.5px] border-[#a6845c] rounded-sm relative cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.8)] overflow-hidden group">
                  <img 
                    src="/default-skill-icon.png" 
                    alt="Skill" 
                    className="w-full h-full object-cover opacity-100 group-hover:scale-110 transition-transform duration-300" 
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
                        onClick={() => setSelectedEquipPart(part)}
                        className="w-[21%] aspect-square max-w-[60px] bg-[#3a2210]/10 border border-[#5c3e23]/60 rounded-sm relative flex items-center justify-center shadow-[inset_0_2px_5px_rgba(0,0,0,0.2)] cursor-pointer hover:border-[#3a2210] transition-colors group overflow-hidden"
                      >
                        {equipItem.enhance > 0 && (
                          <span className="absolute -top-1 -left-1 bg-black/80 text-yellow-500 font-black text-[10px] px-1 rounded-sm shadow-md border border-[#5c3e23] z-20">
                            +{equipItem.enhance}
                          </span>
                        )}
                        <div className="w-full h-full flex items-center justify-center">
                          <img 
                            src={equipItem.image} 
                            alt={equipItem.name} 
                            className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
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

        {selectedEquipPart && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-in-out]">
            <div className="w-full max-w-xs border-2 border-[#5c3e23] rounded-md shadow-[0_10px_40px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col">
              <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/yangpiji-bg.jpeg')" }}></div>
              <div className="relative z-10 flex flex-col p-5">
                <button onClick={() => setSelectedEquipPart(null)} className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-[#5c3e23] hover:text-[#3a2210] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                <div className="flex flex-col items-center mb-4 mt-2">
                  <div className="w-16 h-16 bg-[#3a2210]/10 border border-[#5c3e23] rounded-sm flex items-center justify-center shadow-inner mb-3 relative overflow-hidden">
                    {parsedEquip[selectedEquipPart].enhance > 0 && (
                      <span className="absolute -top-1.5 -left-1.5 bg-black/80 text-yellow-500 font-black text-xs px-1.5 py-0.5 rounded-sm shadow-md border border-[#5c3e23] z-20">
                        +{parsedEquip[selectedEquipPart].enhance}
                      </span>
                    )}
                    <img 
                      src={parsedEquip[selectedEquipPart].image} 
                      alt={parsedEquip[selectedEquipPart].name} 
                      className="w-full h-full object-contain drop-shadow-md"
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

                <div className="bg-[#3a2210]/5 border border-[#8c6543]/30 rounded-sm p-3 mb-5">
                  <div className="text-[#5c3e23] font-black text-[11px] mb-2 border-b border-[#8c6543]/30 pb-1">부여된 스탯</div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(parsedEquip[selectedEquipPart].stats)
                      .filter(([_, val]) => val > 0)
                      .map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-[#5c3e23] font-bold text-xs uppercase">{key}</span>
                          <span className="text-[#3a2210] font-black text-sm">+{val}</span>
                        </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-[#4a2c11] hover:bg-[#3a2210] text-[#f5d5a9] font-bold text-xs py-2.5 rounded-sm transition-colors border border-[#5c3e23] shadow-md active:scale-95">장비 강화</button>
                  <button className="flex-1 bg-[#1a1008] hover:bg-black text-amber-400 font-bold text-xs py-2.5 rounded-sm transition-colors border border-[#a6845c] shadow-md active:scale-95">속성 진화</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* 🧪 기사 레벨업 (포션 먹이기) 모달 */}
        {/* ========================================= */}
        {showLevelUpModal && selectedKnight !== 'knight_main' && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="relative w-full max-w-[300px] border-2 border-[#5c3e23] rounded-md shadow-[0_10px_40px_rgba(0,0,0,1)] flex flex-col mt-10">
              <button 
                onClick={() => setShowLevelUpModal(false)} 
                className="absolute -top-10 right-0 text-white/80 hover:text-white font-black text-xl transition-colors bg-transparent border-none outline-none drop-shadow-md"
              >
                X
              </button>
              <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/yangpiji-bg.jpeg')" }}></div>
              <div className="relative z-10 flex flex-col p-5">
                <h3 className="text-[#3a2210] font-black text-lg text-center leading-tight drop-shadow-sm mb-4">
                  성장의 비약
                </h3>
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-1 px-1">
                    <span className="text-[#5c3e23] font-serif font-black text-xs tracking-wider">Lv.{activeKnightLevel}</span>
                    <span className="text-[#8c6543] font-bold text-[10px]">
                      {activeKnightExp.toLocaleString()} / {requiredKnightExp.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#3a2210]/20 rounded-sm overflow-hidden border border-[#5c3e23]/40 shadow-inner relative">
                    <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-300" style={{ width: `${knightExpPercent}%` }}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center gap-2">
                  {[
                    { id: `potion_exp_${activeKnightBase.element || 'neutral'}_small`, name: '하급', expGrant: 50 },
                    { id: `potion_exp_${activeKnightBase.element || 'neutral'}_medium`, name: '중급', expGrant: 200 },
                    { id: `potion_exp_${activeKnightBase.element || 'neutral'}_large`, name: '상급', expGrant: 1000 }
                  ].map((potion) => {
                    const potionCount = items[potion.id] || 0;
                    const itemData = ITEM_DATABASE[potion.id];
                    return (
                      <div key={potion.id} className="flex flex-col items-center w-1/3">
                        <div 
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (potionCount < 1) { alert("물약이 부족합니다!"); return; }
                            const { newLevel, newExp } = processKnightExpGain(activeKnightLevel, activeKnightExp, potion.expGrant);
                            const userDocRef = doc(db, 'users', user.uid);
                            await updateDoc(userDocRef, {
                              [`inventory.items.${potion.id}`]: increment(-1),
                              [`knightStats.${selectedKnight}.level`]: newLevel,
                              [`knightStats.${selectedKnight}.exp`]: newExp
                            });
                          }}
                          className={`w-full aspect-square bg-[#3a2210]/10 border border-[#5c3e23]/60 rounded-sm relative flex items-center justify-center shadow-[inset_0_2px_5px_rgba(0,0,0,0.2)] transition-all group select-none ${potionCount > 0 ? 'cursor-pointer hover:border-[#3a2210] active:scale-95' : 'opacity-50 grayscale'}`}
                        >
                          <span className="absolute -top-2 -right-1 bg-black text-[#f5d5a9] font-black text-[9px] px-1.5 py-0.5 rounded-full shadow-md border border-[#5c3e23] z-20">
                            {potionCount}
                          </span>
                          <div className="w-8 h-8 flex items-center justify-center text-xl drop-shadow-md group-hover:scale-110 transition-transform">
                            {itemData?.image ? <img src={itemData.image} alt={potion.name} className="w-full h-full object-contain" /> : (itemData?.icon || '🧪')}
                          </div>
                        </div>
                        <span className="text-[#5c3e23] font-bold text-[10px] mt-1 text-center leading-tight">
                          {potion.name}<br/>(+{potion.expGrant})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // =========================================
  // ⚔️ 화면 1. 기사단 목록(갤러리) 화면 
  // =========================================
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center px-6 pb-6 pt-0 animate-[fadeIn_0.5s_ease-in-out] overflow-hidden">
      
      {/* 🎬 애니메이션 키프레임 */}
      <style>{`
        @keyframes cinematicRise {
          0% { opacity: 0; transform: scale(0.9) translateY(40px); filter: brightness(0.5) blur(4px); }
          50% { opacity: 1; transform: scale(1.05) translateY(-5px); filter: brightness(1.5) blur(0px); }
          100% { opacity: 1; transform: scale(1); filter: brightness(1); }
        }
        @keyframes cinematicFlash {
          0% { opacity: 0; }
          30% { opacity: 1; background-color: #fff; }
          100% { opacity: 0; }
        }
      `}</style>

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
          
          <div className="text-xs bg-[#1a1008] border border-[#5c3e23] px-2 py-1 rounded-sm text-yellow-400 font-bold mr-2 shadow-md flex items-center gap-1">
            🪙 {gold.toLocaleString()}
          </div>
        </div>
        
        <div className="w-full max-w-sm flex-1 overflow-y-auto custom-scrollbar animate-[fadeIn_0.3s_ease-in-out]">
          <div className="grid grid-cols-3 gap-3 p-1">
            
            {unlockedKnights.map((id) => {
              const knightInfo = KNIGHT_DATABASE[id];
              if (!knightInfo) return null;
              
              const isMain = id === 'knight_main';
              const nameToShow = isMain ? userNickname : knightInfo.name;

              const thisKnightLevel = isMain ? userLevel : (userData.knightStats?.[id]?.level || 1);

              return (
                <div 
                  key={id}
                  onClick={() => setSelectedKnight(id)}
                  className="aspect-[1/2] relative rounded-sm bg-black border-2 border-[#5c3e23] shadow-[0_4px_10px_rgba(0,0,0,0.8)] cursor-pointer group hover:border-[#d8b486] hover:shadow-[0_0_15px_rgba(216,180,134,0.4)] transition-all overflow-hidden"
                >
                  <img src={knightInfo.image} alt={knightInfo.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 border-[1px] border-[#a6845c]/30 pointer-events-none"></div>
                  
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/90 to-transparent pt-8 pb-1.5 px-1 flex flex-col items-center">
                    {/* 💡 기존의 {isMain && ...} 조건을 없애고 모든 기사가 자기 레벨을 표시하게 함 */}
                    <span className="text-yellow-400 font-serif font-black text-[10px] drop-shadow-md leading-none mb-0.5">Lv.{thisKnightLevel}</span>
                    <span className="text-[#f5d5a9] font-black text-[10px] truncate w-full text-center">{nameToShow}</span>
                  </div>
                </div>
              );
            })}

            {[...Array(Math.max(0, maxSlots - unlockedKnights.length))].map((_, i) => (
              <div 
                key={`empty-${i}`} 
                onClick={() => {
                  setFocusedIndex(0); // 💡 슬롯 오픈 시 첫 기사로 포커싱 초기화
                  setShowSummonModal(true);
                }}
                className="aspect-[1/2] relative rounded-sm border-[1.5px] border-[#4a2c11]/40 border-dashed bg-[#1a1008]/50 flex items-center justify-center shadow-inner opacity-70 cursor-pointer hover:opacity-100 hover:border-[#a6845c]/70 hover:bg-[#3a2210]/40 transition-all group"
              >
                <div className="w-6 h-6 border border-[#a6845c]/20 rotate-45 flex items-center justify-center group-hover:border-[#a6845c]/80 transition-colors">
                  <div className="w-1.5 h-1.5 bg-[#8c6543]/40 group-hover:bg-amber-500 -rotate-45 group-hover:animate-pulse"></div>
                </div>
                <div className="absolute bottom-4 text-[9px] text-[#8c6543] font-bold tracking-wider group-hover:text-amber-500">SUMMON</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* 📜 9:16 비율 시네마틱 소환 제단 모달 */}
      {/* ========================================= */}
      {showSummonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          
          {/* 모달 래퍼 (9:16 비율 강제 유지) */}
          <div className="relative w-full max-w-[400px] aspect-[9/14] max-h-[80vh]">
            
            {/* 닫기 버튼 (모달 우측 상단 바깥쪽, 폰트만) */}
            <button 
              onClick={() => setShowSummonModal(false)} 
              className="absolute -top-10 right-0 text-white/80 hover:text-white font-serif font-black tracking-widest text-sm transition-colors bg-transparent border-none outline-none drop-shadow-md"
            >
              Close
            </button>

            {/* 메인 9:16 제단 컨텐츠 영역 */}
            <div className="w-full h-full rounded-xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,1)]">
              
              {/* 배경 이미지 적용 */}
              <img src="/summon-bg.jpg" alt="Summon Altar" className="absolute inset-0 w-full h-full object-cover z-0" />
              
              {/* 하단부 텍스트 가독성을 위한 그라데이션 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 pointer-events-none"></div>

              {/* 제단 UI 및 캐러셀 컨테이너 */}
              <div 
                className="relative z-20 w-full h-full flex flex-col justify-center items-center pb-20"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >

                {summonableKnights[focusedIndex] && (
                  <div className="mb-6 flex items-center justify-center gap-6 z-20 bg-black/40 px-4 py-1.5 rounded-full border border-neutral-700/50">
                    
                    {/* 골드 폰트 표기 (아이콘 제거) */}
                    <div className="flex flex-col items-center">
                      <span className={`font-serif font-black text-xs tracking-wider drop-shadow-md
                        ${gold >= summonableKnights[focusedIndex].cost.gold ? 'text-[#f5d5a9]' : 'text-red-500'}`}>
                        {summonableKnights[focusedIndex].cost.gold.toLocaleString()} G
                      </span>
                    </div>

                    {/* 아이템 이미지 및 수량 표기 */}
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1.5">
                        <img 
                          src={ITEM_DATABASE[summonableKnights[focusedIndex].cost.itemId]?.image || ITEM_DATABASE[summonableKnights[focusedIndex].cost.itemId]?.icon || '/default-item.png'} 
                          alt="재료" 
                          className="w-5 h-5 object-contain drop-shadow-md"
                          onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a6845c'%3E%3Cpath d='M12 2L2 22h20L12 2z'/%3E%3C/svg%3E"; }}
                        />
                        <span className={`font-mono font-black text-xs drop-shadow-md
                          ${(items[summonableKnights[focusedIndex].cost.itemId] || 0) >= summonableKnights[focusedIndex].cost.count ? 'text-[#f5d5a9]' : 'text-red-500'}`}>
                          {(items[summonableKnights[focusedIndex].cost.itemId] || 0)} / {summonableKnights[focusedIndex].cost.count}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 🎠 기사 1:2 프로필 좌우 스크롤 캐러셀 영역 */}
                <div className="relative w-full h-[45%] flex items-center justify-center perspective-1000">
                  {summonableKnights.map((knight, idx) => {
                    const isCenter = idx === focusedIndex;
                    const isLeft = idx === focusedIndex - 1;
                    const isRight = idx === focusedIndex + 1;
                    const isHidden = Math.abs(idx - focusedIndex) > 1; // 양옆까지만 표시
                    const isOwned = unlockedKnights.includes(knight.id);
                    
                    const hasGold = gold >= knight.cost.gold;
                    const hasItem = (items[knight.cost.itemId] || 0) >= knight.cost.count;
                    const canSummon = hasGold && hasItem && !isOwned;

                    if (isHidden) return null;

                    return (
                      <div
                        key={knight.id}
                        onClick={() => setFocusedIndex(idx)} // 양옆 클릭 시 중앙으로 이동
                        className={`absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-out cursor-pointer flex flex-col items-center
                          ${isCenter ? 'z-30 scale-100 opacity-100' : 'z-20 scale-75 opacity-40 grayscale-[40%] hover:opacity-60'}
                          ${isLeft ? '-translate-x-[75%]' : ''}
                          ${isRight ? 'translate-x-[75%]' : ''}
                        `}
                        style={{ height: '85%' }} // 세로 기준 꽉 차게 조절
                      >
                        {/* 1:2 비율 기사 프로필 */}
                        <img 
                          src={knight.image} 
                          alt={knight.name} 
                          className="h-full aspect-[1/2] object-cover rounded-md border-[1.5px] border-[#8c6543] shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
                        />
                        
                            {/* 💡 소환 폰트 버튼 (버그 수정: 항상 활성화하여 부족 알림창이 뜨게 하고, 숨쉬기 고정) */}
                            {isCenter && (
                              <div className="absolute -bottom-12 w-full flex justify-center z-50">
                                {isOwned ? (
                                  <span className="font-serif tracking-widest text-sm font-black text-neutral-500 drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">Owned</span>
                                ) : (
                                  <button
                                    onClick={(e) => { 
                                      e.preventDefault(); 
                                      e.stopPropagation(); 
                                      handleSummon(knight); 
                                    }}
                                    // disabled 속성을 제거하여 무조건 클릭을 허용합니다.
                                    className="font-serif tracking-widest text-base font-black bg-transparent outline-none transition-all cursor-pointer text-[#fffff0] animate-pulse drop-shadow-[0_0_15px_rgba(0,0,0,1)] hover:scale-110 active:scale-95"
                                  >
                                    Summon
                                  </button>
                                )}
                              </div>
                            )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* 🎬 시네마틱 소환 연출 플레이어 */}
      {/* ========================================= */}
      {summoningKnight && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 select-none overflow-hidden">
          
          <div className="absolute inset-0 bg-white mix-blend-overlay z-20 pointer-events-none opacity-0" style={{ animation: 'cinematicFlash 2.5s ease-in-out forwards' }} />
          
          <div className="w-full max-w-sm aspect-[3/4] relative z-10 flex items-center justify-center p-4">
            <img 
              src={summoningKnight.fullImage || summoningKnight.image} 
              alt={summoningKnight.name} 
              className="w-full h-full object-contain opacity-0 drop-shadow-[0_0_25px_rgba(250,204,21,0.3)]"
              style={{ animation: 'cinematicRise 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s forwards' }}
            />
          </div>

          <div className="absolute bottom-16 w-full text-center z-30">
            {showCinematicText ? (
              <div className="animate-[fadeIn_0.5s_ease-out_forwards] flex flex-col items-center">
                <h4 className="text-yellow-400 font-serif font-black text-2xl tracking-[0.2em] drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]">
                  {summoningKnight.name}
                </h4>
                <p className="text-[#d8b486] text-xs font-bold mt-2 tracking-widest">
                  [ {summoningKnight.title} ] 기사단 합류
                </p>
                <button 
                  onClick={closeCinematic} 
                  className="mt-6 bg-[#1a1008] text-amber-400 font-black text-xs px-8 py-2.5 rounded-sm border border-[#a6845c] shadow-[0_0_15px_rgba(166,132,92,0.4)] active:scale-95 transition-transform"
                >
                  확인
                </button>
              </div>
            ) : (
              <div className="text-[#a6845c] font-black tracking-[0.4em] text-xs animate-pulse">
                시공의 틈을 여는 중...
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
