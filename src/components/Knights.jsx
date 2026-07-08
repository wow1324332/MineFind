// src/components/Knights.jsx
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { KNIGHT_DATABASE } from '../constants/knightData';
import { EQUIP_DATABASE } from '../constants/equipData';
import { ITEM_DATABASE } from '../constants/itemData'; // 💡 소환 요구 아이템 이름을 표시하기 위해 추가

export default function Knights({ onBack }) {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  
  const [selectedKnight, setSelectedKnight] = useState(null);
  const [selectedEquipPart, setSelectedEquipPart] = useState(null);

  // 🔮 소환 시스템용 상태 추가
  const [showSummonModal, setShowSummonModal] = useState(false);
  const [summoningKnight, setSummoningKnight] = useState(null);
  const [showCinematicText, setShowCinematicText] = useState(false);

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
  
  // 💡 유저의 재화 및 갤러리 보유 현황
  const gold = userData.inventory?.gold || 0;
  const items = userData.inventory?.items || {};
  const unlockedKnights = userData.unlockedKnights || ['knight_main']; // 기본으로 주인공 보유
  const maxSlots = 6; // 화면에 보여줄 총 슬롯 개수

  // =========================================
  // 🛡️ 장비 및 스탯 계산 로직 (기존 완벽 보존)
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

  // 선택된 기사의 베이스 스탯 가져오기 (주인공 외 기사들도 상세창 볼 수 있게 동적 처리)
  let activeKnightBase = null;
  let finalStats = { str: 0, agi: 0, int: 0, vit: 0, luk: 0 };
  let combatPower = 0;
  let displayTitle = '';
  let displayName = '';

  if (selectedKnight) {
    activeKnightBase = KNIGHT_DATABASE[selectedKnight];
    displayTitle = activeKnightBase.title;
    displayName = selectedKnight === 'knight_main' ? userNickname : activeKnightBase.name;

    finalStats = {
      str: activeKnightBase.baseStats.str + activeKnightBase.statGrowth.str * (userLevel - 1) + equipBonus.str,
      agi: activeKnightBase.baseStats.agi + activeKnightBase.statGrowth.agi * (userLevel - 1) + equipBonus.agi,
      int: activeKnightBase.baseStats.int + activeKnightBase.statGrowth.int * (userLevel - 1) + equipBonus.int,
      vit: activeKnightBase.baseStats.vit + activeKnightBase.statGrowth.vit * (userLevel - 1) + equipBonus.vit,
      luk: activeKnightBase.baseStats.luk + activeKnightBase.statGrowth.luk * (userLevel - 1) + equipBonus.luk,
    };
    combatPower = (finalStats.str * 10) + (finalStats.agi * 8) + (finalStats.vit * 6) + (finalStats.int * 4) + (finalStats.luk * 2);
  }

  // =========================================
  // 🔮 기사 소환 처리 함수
  // =========================================
  const handleSummon = async (knight) => {
    const { itemId, count, gold: costGold } = knight.cost;
    const userItemCount = items[itemId] || 0;

    if (gold < costGold) { alert("골드가 부족합니다!"); return; }
    if (userItemCount < count) { alert("소환 재료 아이템이 부족합니다!"); return; }

    setShowSummonModal(false);
    setSummoningKnight(knight); // 시네마틱 시작

    // 3초 연출 후 실제 데이터 차감 및 갤러리 추가
    setTimeout(async () => {
      setShowCinematicText(true);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          'inventory.gold': increment(-costGold),
          [`inventory.items.${itemId}`]: increment(-count),
          unlockedKnights: arrayUnion(knight.id)
        });
      }
    }, 2500);
  };

  const closeCinematic = () => {
    setSummoningKnight(null);
    setShowCinematicText(false);
  };

  // 소환 가능한 기사 목록 필터링 (도감 중 cost가 있고, 내가 아직 안 가진 기사)
  const summonableKnights = Object.values(KNIGHT_DATABASE).filter(k => k.cost);


  // =========================================
  // 🛡️ 화면 2. 기사 상세 풀스크린 화면 🛡️
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
                  <span className="text-yellow-400 font-serif font-black text-[12px] border border-yellow-500/50 bg-black/60 px-1.5 py-0.5 rounded-sm backdrop-blur-sm">Lv.{userLevel}</span>
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

        {/* 🔮 장비 모달 (기존 완벽 유지) */}
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
      </div>
    );
  }

  // =========================================
  // ⚔️ 화면 1. 기사단 목록(갤러리) 화면 ⚔️
  // =========================================
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center px-6 pb-6 pt-0 animate-[fadeIn_0.5s_ease-in-out] overflow-hidden">
      
      {/* 🎬 시네마틱 애니메이션용 스타일 태그 */}
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
          
          {/* 우측에 골드 현황 배치 */}
          <div className="text-xs bg-[#1a1008] border border-[#5c3e23] px-2 py-1 rounded-sm text-yellow-400 font-bold mr-2 shadow-md flex items-center gap-1">
            🪙 {gold.toLocaleString()}
          </div>
        </div>
        
        <div className="w-full max-w-sm flex-1 overflow-y-auto custom-scrollbar animate-[fadeIn_0.3s_ease-in-out]">
          <div className="grid grid-cols-3 gap-3 p-1">
            
            {/* 1. 갤러리: 보유한 기사들 출력 (기존 주인공 포함) */}
            {unlockedKnights.map((id) => {
              const knightInfo = KNIGHT_DATABASE[id];
              if (!knightInfo) return null;
              
              const isMain = id === 'knight_main';
              const nameToShow = isMain ? userNickname : knightInfo.name;

              return (
                <div 
                  key={id}
                  onClick={() => setSelectedKnight(id)}
                  className="aspect-[1/2] relative rounded-sm bg-black border-2 border-[#5c3e23] shadow-[0_4px_10px_rgba(0,0,0,0.8)] cursor-pointer group hover:border-[#d8b486] hover:shadow-[0_0_15px_rgba(216,180,134,0.4)] transition-all overflow-hidden"
                >
                  <img src={knightInfo.image} alt={knightInfo.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 border-[1px] border-[#a6845c]/30 pointer-events-none"></div>
                  
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/90 to-transparent pt-8 pb-1.5 px-1 flex flex-col items-center">
                    {isMain && <span className="text-yellow-400 font-serif font-black text-[10px] drop-shadow-md leading-none mb-0.5">Lv.{userLevel}</span>}
                    <span className="text-[#f5d5a9] font-black text-[10px] truncate w-full text-center">{nameToShow}</span>
                  </div>
                </div>
              );
            })}

            {/* 2. 소환 슬롯: 남은 빈 자리만큼 클릭 가능한 슬롯 생성 */}
            {[...Array(Math.max(0, maxSlots - unlockedKnights.length))].map((_, i) => (
              <div 
                key={`empty-${i}`} 
                onClick={() => setShowSummonModal(true)}
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
      {/* 📜 소환 가능 기사 목록 모달 */}
      {/* ========================================= */}
      {showSummonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-sm border-2 border-[#5c3e23] rounded-md shadow-[0_10px_40px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-cover bg-center z-0 opacity-90" style={{ backgroundImage: "url('/yangpiji-bg.jpeg')" }}></div>
            
            <div className="relative z-10 flex flex-col p-4 max-h-[70vh]">
              <div className="flex justify-between items-center mb-4 border-b border-[#8c6543]/40 pb-2">
                <h3 className="font-serif text-[#3a2210] font-black text-lg tracking-widest drop-shadow-sm">소환의 제단</h3>
                <button onClick={() => setShowSummonModal(false)} className="text-[#5c3e23] hover:text-[#3a2210] font-black text-sm p-1">닫기</button>
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1">
                {summonableKnights.map((knight) => {
                  const isOwned = unlockedKnights.includes(knight.id);
                  const reqItemInfo = ITEM_DATABASE[knight.cost.itemId] || { name: '알 수 없는 재료' };
                  const userItemCount = items[knight.cost.itemId] || 0;
                  
                  const hasGold = gold >= knight.cost.gold;
                  const hasItem = userItemCount >= knight.cost.count;
                  const canSummon = hasGold && hasItem && !isOwned;

                  return (
                    <div key={knight.id} className="border border-[#8c6543]/40 bg-[#3a2210]/10 rounded-sm p-2.5 flex gap-3 items-center shadow-inner">
                      <div className="w-12 h-12 border border-[#5c3e23] bg-black shrink-0 overflow-hidden rounded-sm">
                        <img src={knight.image} alt={knight.name} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-[#3a2210] drop-shadow-sm mb-0.5">{knight.name}</div>
                        
                        <div className="flex flex-col gap-1 mt-1.5">
                          <div className={`text-[9px] font-black px-1.5 py-0.5 rounded-sm border ${hasGold ? 'bg-amber-900/10 border-amber-800/50 text-amber-900' : 'bg-red-900/10 border-red-800/50 text-red-700'}`}>
                            🪙 {knight.cost.gold.toLocaleString()} G
                          </div>
                          <div className={`text-[9px] font-black px-1.5 py-0.5 rounded-sm border ${hasItem ? 'bg-[#3a2210]/10 border-[#5c3e23]/50 text-[#3a2210]' : 'bg-red-900/10 border-red-800/50 text-red-700'}`}>
                            📦 {reqItemInfo.name} ({userItemCount}/{knight.cost.count})
                          </div>
                        </div>
                      </div>

                      {isOwned ? (
                        <button disabled className="bg-[#1a1008]/40 border border-[#4a2c11]/50 text-[#4a2c11] text-[10px] px-3 py-4 rounded-sm font-black whitespace-nowrap">보유중</button>
                      ) : (
                        <button 
                          onClick={() => handleSummon(knight)}
                          disabled={!canSummon}
                          className={`text-[10px] font-black px-3 py-4 rounded-sm border whitespace-nowrap active:scale-95 transition-all shadow-md ${canSummon ? 'bg-[#4a2c11] border-[#8c6543] text-[#f5d5a9] hover:bg-[#3a2210]' : 'bg-neutral-800/20 border-neutral-700/30 text-neutral-500'}`}
                        >
                          소환
                        </button>
                      )}
                    </div>
                  );
                })}
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
          
          {/* 강렬한 빛 섬광 오버레이 */}
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
