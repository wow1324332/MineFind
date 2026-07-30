// src/components/Knights.jsx
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, arrayUnion, increment, arrayRemove, deleteField } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { KNIGHT_DATABASE } from '../constants/knightData';
import { EQUIP_DATABASE, ENHANCE_TABLE } from '../constants/equipData';
import { ITEM_DATABASE } from '../constants/itemData'; 
import { getKnightRequiredExp, processKnightExpGain } from '../utils/expUtils';
import { TITLE_DATABASE } from '../constants/titleData';
import { calculatePartyStats, getAllElementsBP } from '../utils/combatUtils';
import { SKILL_DATABASE } from '../constants/skillData';

export default function Knights({ onBack, hp }) {
  const { user } = useAuth();
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [userData, setUserData] = useState(null);
  
const [selectedKnight, setSelectedKnight] = useState(null);
  const [selectedEquipPart, setSelectedEquipPart] = useState(null);
  const [selectedSkillDetail, setSelectedSkillDetail] = useState(null);

  // ✨ 장비 강화/진화 팝업 제어용 상태
  const [equipActionType, setEquipActionType] = useState(null); // 'enhance' 또는 'evolve'
  const [selectedEvolveTarget, setSelectedEvolveTarget] = useState(null); // 진화 선택 속성
  // ✨ 토스트 알림 상태 및 함수
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (text, type = 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 2500);
  };

  // 🔨 [장비 강화 처리 함수]
  const handleEnhanceEquip = async (part, currentEquip) => {
    if (!user || !currentEquip) return;

    const currentEnhance = currentEquip.enhance || 0;
    if (currentEnhance >= 15) {
      alert("이미 최고 강화 단계(+15)에 도달했습니다!");
      return;
    }

    const nextLevel = currentEnhance + 1;
    const recipe = ENHANCE_TABLE[nextLevel];
    if (!recipe) return;

    // 필요 재화 검사
    const costGold = recipe.goldCost;
    const costSoul = recipe.soulCost;
    
    // 영혼석 아이템 ID 판별 (무속성이면 무속성/기본 영혼석 또는 자유 영혼석 사용)
    const equipElement = currentEquip.element || 'neutral';
    const soulItemId = equipElement === 'neutral' 
      ? 'con_soul_1' 
      : `con_soul_${equipElement}`; // 속성별 영혼석 ID 규칙

    const userSoulCount = items[soulItemId] || 0;

    if (gold < costGold) {
      alert(`골드가 부족합니다! (필요: ${costGold.toLocaleString()} G)`);
      return;
    }
    if (userSoulCount < costSoul) {
      const soulName = ITEM_DATABASE[soulItemId]?.name || "영혼석";
      alert(`${soulName}이(가) 부족합니다! (필요: ${costSoul}개 / 보유: ${userSoulCount}개)`);
      return;
    }

    // 강화 확률 판정 (1 ~ 100)
    const roll = Math.floor(Math.random() * 100) + 1;
    const isSuccess = roll <= recipe.successRate;

     try {
      const userDocRef = doc(db, 'users', user.uid);
      const updates = {
        'inventory.gold': increment(-costGold),
        [`inventory.items.${soulItemId}`]: increment(-costSoul)
      };

      // 💡 안전한 덮어쓰기를 위해 현재 장비 상태를 통째로 복사해서 수치만 +1 올림
      const newEquipmentMap = { 
        ...userEquipment, 
        [part]: { 
          ...userEquipment[part], 
          enhance: (userEquipment[part]?.enhance || 0) + 1 
        } 
      };

      const equipPath = selectedKnight === 'knight_main' 
        ? 'equipment' 
        : `knightStats.${selectedKnight}.equipment`;

      if (isSuccess) {
        updates[equipPath] = newEquipmentMap; // 💡 개별 기사 경로에 통째로 저장!
        await updateDoc(userDocRef, updates);
        showToast(`강화 성공, [ +${nextLevel} ${parsedEquip[part]?.name} ]`, 'success');
      } else {
        await updateDoc(userDocRef, updates);
        showToast(`강화 실패...\n영혼석과 골드가 소모되었습니다.`, 'error');
      }
    } catch (error) {
      console.error("강화 처리 오류:", error);
      showToast("강화 도중 오류가 발생했습니다.", 'error');
    }
  };

  // 🧬 [장비 진화 처리 함수]
  const handleEvolveEquip = async (part, currentEquip, recipe) => {
    if (!user || !currentEquip || !recipe) return;

    if ((currentEquip.enhance || 0) < 10) {
      alert("장비 진화는 +10 강화 이상 달성 시에만 가능합니다!");
      return;
    }

    const { target, material, count } = recipe;
    const userMatCount = items[material] || 0;
    const matName = ITEM_DATABASE[material]?.name || "진화 재료";

    if (userMatCount < count) {
      alert(`${matName}이(가) 부족합니다! (필요: ${count}개 / 보유: ${userMatCount}개)`);
      return;
    }

    // 진화 타겟 키 분석 (예: 'tier_1_fire' -> tier: 1, element: 'fire')
    const match = target.match(/^tier_(\d+)_(.+)$/);
    if (!match) return;

    const nextTier = parseInt(match[1], 10);
    const nextElement = match[2];

    try {
      const userDocRef = doc(db, 'users', user.uid);
      
      // 💡 안전한 덮어쓰기를 위해 현재 장비 상태를 복사 후 티어와 속성을 덮어씌움
      const newEquipmentMap = { 
        ...userEquipment, 
        [part]: { 
          ...userEquipment[part], 
          tier: nextTier,
          element: nextElement,
          enhance: 0 
        } 
      };

      const equipPath = selectedKnight === 'knight_main' 
        ? 'equipment' 
        : `knightStats.${selectedKnight}.equipment`;

      const updates = {
        [`inventory.items.${material}`]: increment(-count),
        [equipPath]: newEquipmentMap // 💡 개별 기사 경로에 통째로 저장!
      };

      await updateDoc(userDocRef, updates);
      showToast(`✨ 진화 성공!\n새로운 속성 장비로 거듭났습니다!`, 'success');
      setEquipActionType(null);
      setSelectedEvolveTarget(null);
    } catch (error) {
      console.error("진화 처리 오류:", error);
      showToast("진화 도중 오류가 발생했습니다.", 'error');
    }
  };

  const [showDismissPopup, setShowDismissPopup] = useState(false);

  const handleConfirmDismiss = async () => {
    if (!user || selectedKnight === 'knight_main') return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        // 1. 보유 기사 목록에서 해당 기사 삭제
        unlockedKnights: arrayRemove(selectedKnight),
        // 2. 레벨/경험치 데이터 완전 삭제 (나중에 다시 소환하면 1레벨부터 시작하도록)
        [`knightStats.${selectedKnight}`]: deleteField()
      });
      setShowDismissPopup(false);
      setSelectedKnight(null); // 방출 후 갤러리 화면으로 자동 이동
    } catch (error) {
      console.error("기사 방출 오류:", error);
    }
  };

  // 🔮 소환 시스템용 상태 
  const [showSummonModal, setShowSummonModal] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [summoningKnight, setSummoningKnight] = useState(null);
  const [showCinematicText, setShowCinematicText] = useState(false);
  // 💡 업적 달성 시네마틱 화면을 제어할 상태 추가
  const [newAchievement, setNewAchievement] = useState(null);
  
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
  let userEquipment = {
    WEAPON: { ...defaultEquip }, HELMET: { ...defaultEquip },
    SHIELD: { ...defaultEquip }, ARMOR: { ...defaultEquip }
  };

  if (selectedKnight) {
    if (selectedKnight === 'knight_main' && userData.equipment) {
      userEquipment = { ...userEquipment, ...userData.equipment };
    } else if (userData.knightStats?.[selectedKnight]?.equipment) {
      userEquipment = { ...userEquipment, ...userData.knightStats[selectedKnight].equipment };
    }
  }

  let activeKnightBase = null;
  let activeKnightLevel = 1;
  let activeKnightExp = 0;
  let requiredKnightExp = 1;
  let knightExpPercent = 0;

  let finalStats = { str: 0, agi: 0, int: 0, vit: 0, luk: 0 };
  let combatPower = 0;
  let displayTitle = '';
  let displayName = '';

  let activeSkillData = null;
  let passiveSkillData = null;

  if (selectedKnight) {
    activeKnightBase = KNIGHT_DATABASE[selectedKnight];
    displayTitle = activeKnightBase.title;
    displayName = selectedKnight === 'knight_main' ? userNickname : activeKnightBase.name;

    activeKnightLevel = selectedKnight === 'knight_main' 
      ? userLevel 
      : (userData.knightStats?.[selectedKnight]?.level || 1);

    activeKnightExp = selectedKnight === 'knight_main' ? 0 : (userData.knightStats?.[selectedKnight]?.exp || 0);
    requiredKnightExp = selectedKnight === 'knight_main' ? 1 : getKnightRequiredExp(activeKnightLevel);
    knightExpPercent = selectedKnight === 'knight_main' ? 100 : Math.min((activeKnightExp / requiredKnightExp) * 100, 100);

    if (activeKnightBase.activeSkill) activeSkillData = SKILL_DATABASE[activeKnightBase.activeSkill];
    const passiveId = selectedKnight === 'knight_main' ? (userData.mainPassive || activeKnightBase.passiveSkill) : activeKnightBase.passiveSkill;
    if (passiveId) passiveSkillData = SKILL_DATABASE[passiveId];
  }

  // ✨ 장비 스탯 및 속성 시너지(+20%) 계산 로직
  let equipBonus = { str: 0, agi: 0, int: 0, vit: 0, luk: 0 };
  const parsedEquip = {}; 

  ['WEAPON', 'HELMET', 'SHIELD', 'ARMOR'].forEach(part => {
    const state = userEquipment[part] || defaultEquip;
    const equipKey = `tier_${state.tier}_${state.element || 'neutral'}`;
    const dbData = EQUIP_DATABASE[part]?.evolutions[equipKey] || EQUIP_DATABASE[part]?.evolutions['tier_0_neutral'];
    const growth = EQUIP_DATABASE[part]?.enhanceGrowth?.[`tier_${state.tier}`] || EQUIP_DATABASE[part]?.enhanceGrowth?.tier_0 || { str:0, agi:0, int:0, vit:0, luk:0 };

    let currentStats = {
      str: dbData.baseStat.str + (growth.str * state.enhance),
      agi: dbData.baseStat.agi + (growth.agi * state.enhance),
      int: dbData.baseStat.int + (growth.int * state.enhance),
      vit: dbData.baseStat.vit + (growth.vit * state.enhance),
      luk: dbData.baseStat.luk + (growth.luk * state.enhance),
    };

    let isSynergy = false;
    if (activeKnightBase && activeKnightBase.attribute !== 'neutral' && activeKnightBase.attribute === dbData.element) {
      isSynergy = true;
      currentStats.str = Math.floor(currentStats.str * 1.2);
      currentStats.agi = Math.floor(currentStats.agi * 1.2);
      currentStats.int = Math.floor(currentStats.int * 1.2);
      currentStats.vit = Math.floor(currentStats.vit * 1.2);
      currentStats.luk = Math.floor(currentStats.luk * 1.2);
    }

    parsedEquip[part] = { 
      ...state, 
      name: dbData.name, 
      image: dbData.image, 
      stats: currentStats, 
      isSynergy,
      desc: dbData.desc || dbData.description 
    };

    equipBonus.str += currentStats.str;
    equipBonus.agi += currentStats.agi;
    equipBonus.int += currentStats.int;
    equipBonus.vit += currentStats.vit;
    equipBonus.luk += currentStats.luk;
  });

  if (selectedKnight) {
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

    if (unlockedKnights.length >= maxSlots) {
      alert("기사단 슬롯이 가득 찼습니다. 기존 기사를 해제 후 소환해주세요.");
      return;
    }

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
        
        // 💡 1. 파이어베이스에 업데이트할 기본 데이터 꾸러미를 만듭니다.
        const updateData = {
          'inventory.gold': increment(-costGold),
          [`inventory.items.${itemId}`]: increment(-count),
          unlockedKnights: arrayUnion(knight.id),
          [`knightStats.${knight.id}`]: { level: 1, exp: 0 }
        };

        // 💡 2. 칭호 획득 조건 검사 (기존 보유 기사 수 + 방금 뽑은 1명 >= 6명)
        const isTitleUnlocked = unlockedKnights.length + 1 >= 6;
        
        // 💡 3. 이미 칭호를 가지고 있는지 확인 (중복 알림 방지)
        const alreadyHasTitle = userData?.unlockedTitles?.includes('knight_lord');

        // 💡 4. 6명을 달성했고 아직 칭호가 없다면, 데이터 꾸러미에 칭호도 몰래 끼워 넣습니다.
        if (isTitleUnlocked && !alreadyHasTitle) {
          updateData.unlockedTitles = arrayUnion('knight_lord');
        }

        // 💡 5. 준비된 데이터를 파이어베이스에 한 번에 슛!
        await updateDoc(userDocRef, updateData);

        // 💡 6. 칭호를 새로 얻었다면 유저에게 기분 좋은 알림을 띄워줍니다.
        if (isTitleUnlocked && !alreadyHasTitle) {
          setTimeout(() => {
            setNewAchievement(TITLE_DATABASE['knight_lord']); // DB에서 직접 호출!
          }, 600); 
        }
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
    const activeSkillData = activeKnightBase?.activeSkill ? SKILL_DATABASE[activeKnightBase.activeSkill] : null;
    const passiveId = selectedKnight === 'knight_main' ? (userData?.mainPassive || activeKnightBase?.passiveSkill) : activeKnightBase?.passiveSkill;
    const passiveSkillData = passiveId ? SKILL_DATABASE[passiveId] : null;
    return (
      <div className="relative min-h-screen bg-black text-white flex flex-col items-center animate-[fadeIn_0.3s_ease-in-out] overflow-hidden">
        
        {/* ✨ 인게임 토스트 알림 컴포넌트 (체력 토스트 스타일) */}
        {toastMessage && (
          <div 
            className="fixed top-28 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center justify-center pointer-events-none w-max max-w-[90%]"
            style={{ animation: 'toastFadeInOut 2.5s ease-in-out forwards' }}
          >
            <div className={`bg-black/60 backdrop-blur-md border px-6 py-2 rounded-md flex items-center justify-center text-center shadow-xl
              ${toastMessage.type === 'success' 
                ? 'border-green-900/50 shadow-[0_0_15px_rgba(34,197,94,0.5)]' 
                : 'border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.5)]'}`}
            >
              <span className={`font-serif font-black tracking-wider text-sm italic drop-shadow-md whitespace-pre-line opacity-90
                ${toastMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}
              >
                {toastMessage.text}
              </span>
            </div>
          </div>
        )}
        <style>{`
          @keyframes toastFadeInOut {
            0% { opacity: 0; transform: translate(-50%, -10px); }
            15% { opacity: 1; transform: translate(-50%, 0); }
            85% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -10px); }
          }
        `}</style>

        <div 
          className="absolute inset-0 bg-cover bg-top z-0 opacity-100"
          style={{ backgroundImage: `url(${activeKnightBase.bgImage || activeKnightBase.fullImage || activeKnightBase.image})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-0"></div>

        <div className="relative z-10 w-full max-w-sm flex flex-col h-screen">
           <div className="w-full flex justify-between items-center p-4 pt-6 shrink-0">
            <button onClick={() => setSelectedKnight(null)} className="transition-all duration-150 active:scale-90 p-1 outline-none">
              <img src="/header/backkey.webp" alt="Back" className="w-6 h-6 object-contain opacity-80" />
            </button>
            
            {/* 💡 메인 기사가 아닐 경우에만 우측 상단에 소환 해제 버튼 노출 */}
            {selectedKnight !== 'knight_main' && (
              <button 
                onClick={() => setShowDismissPopup(true)}
                className="bg-red-950/80 border border-red-800 text-red-400 text-[10px] font-black px-2 py-1 rounded-sm shadow-md hover:bg-red-900 transition-colors active:scale-95 tracking-widest"
              >
                소환 해제
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-end p-5 pb-8">
            <div className="mb-4 animate-[slideUp_0.4s_ease-out] flex justify-between items-end">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                <div 
                  onClick={() => {
                    const isOwned = selectedKnight === 'knight_main' || unlockedKnights.includes(selectedKnight);
                    
                    if (!isOwned) {
                      alert("소환을 완료한 기사만 레벨업할 수 있습니다!");
                      return;
                    }
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
              
              {/* ✨ 스킬 2칸 (액티브 & 패시브) */}
              <div className="flex items-center gap-3 mb-1">
                {/* 액티브 스킬 슬롯 */}
                <div 
                  className="flex flex-col items-center relative cursor-pointer group"
                  onClick={() => activeSkillData && setSelectedSkillDetail(activeSkillData)}
                >
                  <div className="w-11 h-11 bg-transparent rounded-sm relative flex items-center justify-center">
                    {activeSkillData ? (
                      <img src={activeSkillData.icon} alt="Active" className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <img src="/default-skill-icon.png" alt="Empty" className="w-full h-full object-contain opacity-40" />
                    )}
                  </div>
                  <span className="text-[#a6845c] text-[9px] font-black tracking-widest mt-1">ACTIVE</span>
                </div>

                {/* 패시브 스킬 슬롯 */}
                <div 
                  className="flex flex-col items-center relative cursor-pointer group"
                  onClick={() => passiveSkillData && setSelectedSkillDetail(passiveSkillData)}
                >
                  <div className="w-11 h-11 bg-transparent rounded-sm relative flex items-center justify-center">
                    {passiveSkillData ? (
                      <img src={passiveSkillData.icon} alt="Passive" className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <img src="/default-skill-icon.png" alt="Empty" className="w-full h-full object-contain opacity-40" />
                    )}
                  </div>
                  <span className="text-[#a6845c] text-[9px] font-black tracking-widest mt-1">PASSIVE</span>
                </div>
              </div>
            </div>

            <div className="w-full border-2 border-[#5c3e23] rounded-md p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-[slideUp_0.5s_ease-out] relative overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/yangpiji-bg.webp')" }}></div>
              
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
                          <span className="absolute bottom-0.5 right-1 text-[#fffff0] font-serif font-black text-[11px] drop-shadow-[0_2px_3px_rgba(0,0,0,1)] z-20 pointer-events-none">
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

        {/* ========================================= */}
        {/* 🔨 대장간 겸용 장비 상세 & 강화/진화 모달 (디자인 업그레이드 V2) */}
        {/* ========================================= */}
        {selectedEquipPart && (() => {
          const currentEquipState = userEquipment[selectedEquipPart] || defaultEquip;
          const parsedItem = parsedEquip[selectedEquipPart];
          const equipKey = `tier_${currentEquipState.tier}_${currentEquipState.element || 'neutral'}`;
          const dbData = EQUIP_DATABASE[selectedEquipPart]?.evolutions[equipKey];
          const currentEnhance = currentEquipState.enhance || 0;
          const nextEnhanceLevel = currentEnhance + 1;
          const enhanceRecipe = ENHANCE_TABLE[nextEnhanceLevel];

          const soulItemId = (currentEquipState.element || 'neutral') === 'neutral' ? 'con_soul_1' : `con_soul_${currentEquipState.element}`;
          const soulItemData = ITEM_DATABASE[soulItemId];

          return (
            <div 
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out] select-none"
              style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', WebkitTapHighlightColor: 'transparent' }}
              onClick={() => {
                setSelectedEquipPart(null);
                setEquipActionType(null);
                setSelectedEvolveTarget(null);
              }} 
            >
              <div className="relative w-full max-w-[280px]" onClick={(e) => e.stopPropagation()}>
                <div className="w-full flex flex-col bg-transparent shadow-[0_10px_40px_rgba(0,0,0,0.9)] rounded-lg overflow-hidden">
                  
                  {/* 👑 상단: 장비 이미지 영역 (이미지 크기 확대 w-32 h-32) */}
                  <div className="relative flex justify-center items-center bg-gradient-to-b from-[#2a1a10] to-[#1a1008] py-8 border-b border-[#a6845c]/30">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] opacity-80 pointer-events-none"></div>
                    
                    {/* 💡 X 닫기 버튼 완전 제거됨 (배경 터치로 닫기) */}

                     <div className="relative z-10 w-32 h-32 flex items-center justify-center mt-2 bg-black/30 border border-[#a6845c]/20 rounded-sm shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">
                      {/* 💡 프레임 내측 우측 하단에 고정 */}
                      {currentEnhance > 0 && (
                        <span className="absolute bottom-1.5 right-1.5 text-[#fffff0] font-serif font-black text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,1)] z-20 pointer-events-none">
                          +{currentEnhance}
                        </span>
                      )}
                      <img
                        src={parsedItem.image} 
                        alt={parsedItem.name} 
                        className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] animate-pulse"
                        onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a6845c'%3E%3Cpath d='M12 2L2 22h20L12 2z'/%3E%3C/svg%3E"; }} 
                      />
                    </div>
                  </div>

                  {/* 📜 하단: 장비 정보 및 컨트롤 영역 */}
                  <div className="bg-[#150d08] p-5 flex flex-col relative">
                    
                    {/* 장비 이름 및 설명 (티어 뱃지 제거, 설명 추가) */}
                    <div className="flex flex-col items-center text-center mb-4 border-b border-[#a6845c]/20 pb-4">
                      <span className="text-[#f5d5a9] font-serif font-black text-lg tracking-widest drop-shadow-md uppercase leading-tight mb-2">
                        {parsedItem.name}
                      </span>
                      <div className="flex flex-col items-center gap-1.5 mt-1">
                        {parsedItem.isSynergy && (
                          <span className="text-[9px] bg-amber-900/50 text-yellow-400 font-bold px-1.5 py-0.5 rounded-sm border border-amber-600/50 shadow-sm animate-pulse tracking-wide mb-1">
                            시너지 +20%
                          </span>
                        )}
                        {/* 💡 판타지풍 장비 설명 및 whitespace-pre-line 속성 추가 */}
                        <span className="text-[#a6845c] text-[10px] font-medium leading-relaxed break-keep opacity-90 px-2 text-center whitespace-pre-line">
                          {parsedItem.desc || "오랜 세월을 견뎌낸 고대의 장비.\n착용자에게 숨겨진 힘을 부여한다."}
                        </span>
                      </div>
                    </div>

                    {/* --- 기본 스탯 화면 --- */}
                    {!equipActionType && (
                      <div className="animate-[fadeIn_0.2s_ease-out]">
                        <div className="bg-black/40 border border-[#a6845c]/20 rounded-sm p-3 mb-4 shadow-inner">
                          <div className="text-[#a6845c] font-black text-[11px] mb-2 border-b border-[#a6845c]/20 pb-1 flex justify-between">
                            <span className="tracking-widest">부여된 스탯</span>
                          </div>
                          {/* 💡 스탯 폰트 축소 및 세로 일렬(flex-col) 정렬 변경 */}
                          <div className="flex flex-col gap-1.5 px-1">
                            {Object.entries(parsedItem.stats)
                              .filter(([_, val]) => val > 0)
                              .map(([key, val]) => (
                                <div key={key} className="flex justify-between items-center">
                                  <span className="text-[#8c6543] font-bold text-[10px] uppercase tracking-wider">{key}</span>
                                  <span className="text-[#d8b486] font-black text-xs">+{val}</span>
                                </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => setEquipActionType('enhance')}
                            className="flex-1 bg-[#2a1a10] hover:bg-[#3a2618] text-[#f5d5a9] font-bold text-[11px] py-2.5 rounded-sm transition-colors border border-[#8c6543]/50 shadow-md active:scale-95 tracking-widest outline-none"
                          >
                            장비 강화
                          </button>
                          <button 
                            onClick={() => {
                              if (currentEnhance < 10) {
                                showToast("장비 진화는 +10 강화 이상\n달성 시에만 가능합니다!", 'error');
                                return;
                              }
                              setEquipActionType('evolve');
                            }}
                            className={`flex-1 font-bold text-[11px] py-2.5 rounded-sm transition-colors border shadow-md active:scale-95 tracking-widest outline-none
                              ${currentEnhance >= 10 
                                ? 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-400 border-amber-700/50 animate-pulse' 
                                : 'bg-black/40 text-neutral-600 border-neutral-800 cursor-not-allowed'}`}
                          >
                            속성 진화
                          </button>
                        </div>
                      </div>
                    )}

                    {/* --- 장비 강화 화면 (수정 사항 없음) --- */}
                    {equipActionType === 'enhance' && (
                      <div className="animate-[fadeIn_0.2s_ease-out]">
                        <div className="flex justify-between items-center border-b border-[#a6845c]/30 pb-2 mb-3">
                          <span className="text-[#d8b486] font-black text-[11px] tracking-widest">강화 (+{currentEnhance} ➔ +{nextEnhanceLevel})</span>
                          <button onClick={() => setEquipActionType(null)} className="text-[#8c6543] text-[10px] font-bold hover:text-[#d8b486] transition-colors outline-none">뒤로</button>
                        </div>

                        {nextEnhanceLevel <= 15 ? (
                          <>
                            <div className="flex flex-col gap-1.5 mb-4">
                              <div className="flex justify-between items-center bg-black/40 p-2 rounded-sm border border-[#a6845c]/20">
                                <span className="text-[#a6845c] font-bold text-[10px] tracking-widest">소모 골드</span>
                                <span className={`font-black text-[11px] tracking-wider ${gold >= enhanceRecipe.goldCost ? 'text-yellow-500' : 'text-red-500'}`}>
                                  {enhanceRecipe.goldCost.toLocaleString()} G
                                </span>
                              </div>
                              <div className="flex justify-between items-center bg-black/40 p-2 rounded-sm border border-[#a6845c]/20">
                                <span className="text-[#a6845c] font-bold text-[10px] tracking-widest">{soulItemData?.name || "소모 영혼석"}</span>
                                <span className={`font-black text-[11px] tracking-wider ${(items[soulItemId] || 0) >= enhanceRecipe.soulCost ? 'text-[#d8b486]' : 'text-red-500'}`}>
                                  {items[soulItemId] || 0} / {enhanceRecipe.soulCost}
                                </span>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleEnhanceEquip(selectedEquipPart, currentEquipState)}
                              className="w-full bg-red-950/40 hover:bg-red-900/60 text-red-400 font-black text-[11px] py-2.5 rounded-sm transition-all border border-red-800/50 shadow-md active:scale-95 tracking-[0.2em] uppercase outline-none"
                            >
                              강화 시도
                            </button>
                          </>
                        ) : (
                          <div className="text-center text-[#8c6543] font-bold text-xs py-4">최고 강화 단계에 도달했습니다.</div>
                        )}
                      </div>
                    )}

                    {/* --- 속성 진화 화면 (수정 사항 없음) --- */}
                    {equipActionType === 'evolve' && (
                      <div className="animate-[fadeIn_0.2s_ease-out]">
                        <div className="flex justify-between items-center border-b border-[#a6845c]/30 pb-2 mb-3">
                          <span className="text-[#d8b486] font-black text-[11px] tracking-widest">진화 (Tier {currentEquipState.tier} ➔ {currentEquipState.tier + 1})</span>
                          <button onClick={() => setEquipActionType(null)} className="text-[#8c6543] text-[10px] font-bold hover:text-[#d8b486] transition-colors outline-none">뒤로</button>
                        </div>

                        {dbData?.evolutionRecipes && dbData.evolutionRecipes.length > 0 ? (
                          <>
                            <div className="flex flex-col gap-2 mb-4 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
                              {dbData.evolutionRecipes.map((recipe, idx) => {
                                const targetDb = EQUIP_DATABASE[selectedEquipPart]?.evolutions[recipe.target];
                                const isSelected = selectedEvolveTarget?.target === recipe.target || (dbData.evolutionRecipes.length === 1 && idx === 0);
                                const matData = ITEM_DATABASE[recipe.material];
                                const userMat = items[recipe.material] || 0;

                                return (
                                  <div 
                                    key={idx}
                                    onClick={() => setSelectedEvolveTarget(recipe)}
                                    className={`p-2 rounded-sm border cursor-pointer transition-all flex flex-col gap-1 
                                      ${isSelected ? 'bg-amber-950/30 border-amber-600/50 shadow-sm' : 'bg-black/40 border-[#a6845c]/20 hover:border-[#a6845c]/50'}`}
                                  >
                                    <div className="flex justify-between items-center">
                                      <span className={`font-black text-[11px] ${isSelected ? 'text-amber-400' : 'text-[#d8b486]'}`}>{targetDb?.name}</span>
                                      <span className="text-[#8c6543] font-bold text-[9px] uppercase">[{targetDb?.element}]</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] mt-1">
                                      <span className="text-[#a6845c] font-bold">{matData?.name || "필요 재료"}</span>
                                      <span className={`font-black tracking-wider ${userMat >= recipe.count ? 'text-green-500' : 'text-red-500'}`}>
                                        {userMat} / {recipe.count}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <button 
                              onClick={() => {
                                const activeRecipe = selectedEvolveTarget || (dbData.evolutionRecipes.length === 1 ? dbData.evolutionRecipes[0] : null);
                                if (!activeRecipe) {
                                  showToast("진화할 속성 경로를 선택해 주세요!", 'error');
                                  return;
                                }
                                handleEvolveEquip(selectedEquipPart, currentEquipState, activeRecipe);
                              }}
                              className="w-full bg-amber-950/40 hover:bg-amber-900/60 text-amber-400 font-black text-[11px] py-2.5 rounded-sm transition-all border border-amber-700/50 shadow-md active:scale-95 tracking-[0.2em] uppercase outline-none"
                            >
                              속성 진화 실행
                            </button>
                          </>
                        ) : (
                          <div className="text-center text-[#8c6543] font-bold text-xs py-4">더 이상 진화할 수 없는 최종 단계입니다.</div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ========================================= */}
        {/* ✨ 스킬 상세 팝업 (마이페이지 아이템 팝업 스타일) */}
        {/* ========================================= */}
        {selectedSkillDetail && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out] select-none"
            style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', WebkitTapHighlightColor: 'transparent' }}
            onClick={() => setSelectedSkillDetail(null)} 
          >
            <div className="relative w-full max-w-[280px]" onClick={(e) => e.stopPropagation()}>
              <div className="w-full aspect-[4/5] flex flex-col bg-transparent shadow-[0_10px_40px_rgba(0,0,0,0.9)] rounded-lg overflow-hidden">
                
                {/* 👑 상단 50%: 스킬 이미지 영역 */}
                <div className="flex-1 relative flex justify-center items-center bg-gradient-to-b from-[#2a1a10] to-[#1a1008]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] opacity-80 pointer-events-none"></div>
                  
                  <div className="relative z-10 w-28 h-28 flex items-center justify-center">
                    <img 
                      src={selectedSkillDetail.icon} 
                      alt={selectedSkillDetail.name} 
                      className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] animate-pulse" 
                      draggable="false" 
                    />
                  </div>
                </div>

                {/* 📜 하단 50%: 스킬 설명 영역 */}
                <div className="flex-1 bg-[#150d08] p-5 flex flex-col items-center text-center relative border-t border-[#a6845c]/30">
                  <span className="text-[#f5d5a9] font-serif font-black text-lg tracking-widest drop-shadow-md mb-1.5 uppercase leading-tight">
                    {selectedSkillDetail.name}
                  </span>
                  
                  <span className={`text-[9px] font-bold tracking-widest mb-3 px-2 py-0.5 rounded-sm border uppercase bg-black/40 ${selectedSkillDetail.type === 'active' ? 'border-red-500/80 text-red-400' : 'border-blue-500/80 text-blue-400'}`}>
                    {selectedSkillDetail.type === 'active' ? 'ACTIVE SKILL' : 'PASSIVE SKILL'}
                  </span>
                  
                  <p className="text-[#d8b486] text-[11px] font-medium leading-relaxed break-keep mt-1 opacity-90 h-[50px] overflow-y-auto custom-scrollbar">
                    {selectedSkillDetail.description}
                  </p>
                  
                  {/* 하단 스탯 (MP, 계수, 턴 등) */}
                  <div className="mt-auto flex w-full items-center justify-center gap-4 opacity-80 pt-4 border-t border-dashed border-[#5c3e23]/50">
                    {selectedSkillDetail.mpCost && (
                      <div className="flex flex-col items-center">
                        <span className="text-[#a6845c] text-[9px] font-bold tracking-widest uppercase mb-0.5">MP Cost</span>
                        <span className="text-blue-400 font-black text-[12px] drop-shadow-md">{selectedSkillDetail.mpCost}</span>
                      </div>
                    )}
                    {selectedSkillDetail.power && (
                      <div className="flex flex-col items-center">
                        <span className="text-[#a6845c] text-[9px] font-bold tracking-widest uppercase mb-0.5">Power</span>
                        <span className="text-red-400 font-black text-[12px] drop-shadow-md">{selectedSkillDetail.power * 100}%</span>
                      </div>
                    )}
                    {selectedSkillDetail.flatDamage && (
                      <div className="flex flex-col items-center">
                        <span className="text-[#a6845c] text-[9px] font-bold tracking-widest uppercase mb-0.5">Damage</span>
                        <span className="text-red-400 font-black text-[12px] drop-shadow-md">{selectedSkillDetail.flatDamage}</span>
                      </div>
                    )}
                    {selectedSkillDetail.value !== undefined && (
                      <div className="flex flex-col items-center">
                        <span className="text-[#a6845c] text-[9px] font-bold tracking-widest uppercase mb-0.5">Effect</span>
                        <span className="text-green-400 font-black text-[12px] drop-shadow-md">
                          {selectedSkillDetail.value >= 1 ? `+${selectedSkillDetail.value}` : `+${selectedSkillDetail.value * 100}%`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* 🧪 기사 레벨업 (포션 먹이기) 모달 */}
        {/* ========================================= */}
        {showLevelUpModal && selectedKnight !== 'knight_main' && (
          <div 
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]"
            onClick={() => setShowLevelUpModal(false)} // 💡 배경 클릭 시 모달 닫기
          >
            <div 
              className="relative w-full max-w-[300px] rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,1)] flex flex-col mt-10"
              onClick={(e) => e.stopPropagation()} // 💡 모달 내부 클릭 시 닫히는 것 방지
            >
              {/* 💡 X 닫기 버튼 제거됨 */}
              <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/yangpiji-bg.webp')" }}></div>
              <div className="relative z-10 flex flex-col p-5">
                <h3 className="text-[#3a2210] font-black text-lg text-center leading-tight drop-shadow-sm mb-4">
                  Level Up!
                </h3>
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-1 px-1">
                    <span className="text-[#5c3e23] font-serif font-black text-xs tracking-wider">Lv.{activeKnightLevel}</span>
                    <span className="text-[#8c6543] font-bold text-[10px]">
                      {activeKnightExp.toLocaleString()} / {requiredKnightExp.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#3a2210]/20 rounded-sm overflow-hidden border border-[#5c3e23]/40 shadow-inner relative">
                    {/* 💡 게이지 색상을 짙은 갈색 톤으로 변경 */}
                    <div className="h-full bg-gradient-to-r from-[#5c3e23] to-[#8c6543] transition-all duration-300" style={{ width: `${knightExpPercent}%` }}></div>
                  </div>
                </div>
              {/* 🧪 경험치 포션 3종 (소, 중, 대) 배열 */}
              <div className="flex justify-between items-center gap-2">
                {[
                  { id: `potion_exp_${activeKnightBase.attribute || 'neutral'}_small`, defaultName: 'Small' },
                  { id: `potion_exp_${activeKnightBase.attribute || 'neutral'}_medium`, defaultName: 'Medium' },
                  { id: `potion_exp_${activeKnightBase.attribute || 'neutral'}_large`, defaultName: 'Large' }
                ].map((potionObj) => {
                  const itemData = ITEM_DATABASE[potionObj.id];
                  const potionCount = items[potionObj.id] || 0;
                  
                  const potionName = itemData?.name || potionObj.defaultName;
                  const potionExp = itemData?.expAmount || itemData?.expGrant || 0;
                  
                  const imgSrc = itemData?.image || (itemData?.icon && itemData.icon.includes('/') ? itemData.icon : null);
                  const iconEmoji = !imgSrc ? (itemData?.icon || '🧪') : null;

                  return (
                    <div key={potionObj.id} className="flex flex-col items-center w-1/3">
                      <div 
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (potionCount < 1) { alert("물약이 부족합니다!"); return; }
                          if (potionExp === 0) { alert("물약 데이터가 없습니다!"); return; }
                          
                          const { newLevel, newExp } = processKnightExpGain(activeKnightLevel, activeKnightExp, potionExp);
                          const userDocRef = doc(db, 'users', user.uid);
                          await updateDoc(userDocRef, {
                            [`inventory.items.${potionObj.id}`]: increment(-1),
                            [`knightStats.${selectedKnight}.level`]: newLevel,
                            [`knightStats.${selectedKnight}.exp`]: newExp
                          });
                        }}
                        className={`w-full aspect-square bg-[#3a2210]/10 border border-[#5c3e23]/60 rounded-sm relative flex items-center justify-center shadow-[inset_0_2px_5px_rgba(0,0,0,0.2)] transition-all group select-none 
                          ${potionCount > 0 ? 'cursor-pointer hover:border-[#3a2210] active:scale-95' : 'opacity-60 cursor-not-allowed'}`}
                      >
                        <span className="absolute -top-2 -right-1 bg-black text-[#f5d5a9] font-black text-[9px] px-1.5 py-0.5 rounded-full shadow-md border border-[#5c3e23] z-20">
                          {potionCount}
                        </span>
                        
                        <div className="w-14 h-14 flex items-center justify-center text-xl drop-shadow-md group-hover:scale-110 transition-transform">
                          {imgSrc ? (
                            <img src={imgSrc} alt={potionName} className="w-full h-full object-contain" />
                          ) : (
                            iconEmoji
                          )}
                        </div>
                      </div>
                      
                      <span className="text-[#5c3e23] font-bold text-[10px] mt-1 text-center leading-tight">
                        {potionName}<br/>(+{potionExp})
                      </span>
                    </div>
                  );
                })}
              </div>
              </div>
            </div>
          </div>
        )}

{showDismissPopup && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="w-full max-w-xs border-2 border-red-900 rounded-md shadow-[0_10px_40px_rgba(220,38,38,0.4)] relative overflow-hidden flex flex-col">
              
              {/* 뒷배경 흑백+붉은톤 필터 적용 */}
              <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/yangpiji-bg.webp')", filter: 'grayscale(0.8) sepia(0.5) hue-rotate(-50deg)' }}></div>
              <div className="absolute inset-0 bg-black/70 z-10"></div>
              
              <div className="relative z-20 flex flex-col p-6 items-center text-center">
                <div className="w-12 h-12 bg-black/80 border-[2px] border-red-600 rounded-full flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(220,38,38,0.8)]">
                  <span className="text-red-500 font-black text-2xl animate-pulse">!</span>
                </div>
                
                <h3 className="text-red-500 font-black text-lg mb-2 drop-shadow-md tracking-widest">방출 경고</h3>
                <p className="text-[#d8b486] font-bold text-xs mb-2 break-keep leading-relaxed">
                  선택하신 기사를 기사단에서 방출하시겠습니까?
                </p>
                
                <div className="bg-black/60 border border-red-900/50 px-2 py-1.5 rounded-sm mb-6 w-full">
                  <p className="text-red-400 font-black text-[10px] tracking-wide">
                    ※ 소환과 성장에 사용 된 재화는<br/>돌려받을 수 없습니다.
                  </p>
                </div>
                
                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => setShowDismissPopup(false)}
                    className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-[#d8b486] font-bold text-xs py-2.5 rounded-sm transition-colors border border-neutral-700 shadow-md active:scale-95"
                  >
                    취소
                  </button>
                  <button 
                    onClick={handleConfirmDismiss}
                    className="flex-1 bg-red-950 hover:bg-red-900 text-red-300 font-bold text-xs py-2.5 rounded-sm transition-colors border border-red-700 shadow-[0_0_10px_rgba(220,38,38,0.4)] active:scale-95"
                  >
                    방출 확인
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
      </div>
    );
  }

// 💡 파티 전체 스탯 계산 (기사 속성 시너지 개별 적용)
  const myPartyKnights = unlockedKnights.map(id => {
    const kBase = KNIGHT_DATABASE[id];
    if (!kBase) return null;
    const kLevel = id === 'knight_main' ? userLevel : (userData.knightStats?.[id]?.level || 1);
    
    let finalEquipBonus = { str: 0, agi: 0, int: 0, vit: 0, luk: 0 };
    ['WEAPON', 'HELMET', 'SHIELD', 'ARMOR'].forEach(part => {
      const state = userEquipment[part] || defaultEquip;
      const equipKey = `tier_${state.tier}_${state.element || 'neutral'}`;
      const dbData = EQUIP_DATABASE[part]?.evolutions[equipKey] || EQUIP_DATABASE[part]?.evolutions['tier_0_neutral'];
      const growth = EQUIP_DATABASE[part]?.enhanceGrowth?.[`tier_${state.tier}`] || EQUIP_DATABASE[part]?.enhanceGrowth?.tier_0 || { str:0, agi:0, int:0, vit:0, luk:0 };
      
      let baseS = {
        str: (dbData?.baseStat?.str || 0) + ((growth.str || 0) * state.enhance),
        agi: (dbData?.baseStat?.agi || 0) + ((growth.agi || 0) * state.enhance),
        int: (dbData?.baseStat?.int || 0) + ((growth.int || 0) * state.enhance),
        vit: (dbData?.baseStat?.vit || 0) + ((growth.vit || 0) * state.enhance),
        luk: (dbData?.baseStat?.luk || 0) + ((growth.luk || 0) * state.enhance),
      };

      const multiplier = (kBase.attribute !== 'neutral' && kBase.attribute === dbData?.element) ? 1.2 : 1.0;
      finalEquipBonus.str += Math.floor(baseS.str * multiplier);
      finalEquipBonus.agi += Math.floor(baseS.agi * multiplier);
      finalEquipBonus.int += Math.floor(baseS.int * multiplier);
      finalEquipBonus.vit += Math.floor(baseS.vit * multiplier);
      finalEquipBonus.luk += Math.floor(baseS.luk * multiplier);
    });

    return {
      id,
      name: id === 'knight_main' ? userNickname : kBase.name,
      element: kBase.attribute, 
      passiveSkill: id === 'knight_main' ? (userData.mainPassive || kBase.passiveSkill) : kBase.passiveSkill,
      str: kBase.baseStats.str + (kBase.statGrowth.str * (kLevel - 1)) + finalEquipBonus.str,
      agi: kBase.baseStats.agi + (kBase.statGrowth.agi * (kLevel - 1)) + finalEquipBonus.agi,
      int: kBase.baseStats.int + (kBase.statGrowth.int * (kLevel - 1)) + finalEquipBonus.int,
      vit: kBase.baseStats.vit + (kBase.statGrowth.vit * (kLevel - 1)) + finalEquipBonus.vit,
      luk: kBase.baseStats.luk + (kBase.statGrowth.luk * (kLevel - 1)) + finalEquipBonus.luk,
      skillBonus: 0
    };
  }).filter(Boolean);

  const partyStats = calculatePartyStats(myPartyKnights);
  const elementalBP = getAllElementsBP(myPartyKnights);
  const totalCombatPower = partyStats.baseAttackPower + (partyStats.defense * 2);

  const elementDisplay = {
    fire: { name: '불 (Fire)', color: 'text-red-500' },
    water: { name: '물 (Water)', color: 'text-blue-500' },
    ice: { name: '얼음 (Ice)', color: 'text-cyan-400' },
    poison: { name: '독 (Poison)', color: 'text-green-500' },
    cure: { name: '치유 (Cure)', color: 'text-emerald-400' },
    vain: { name: '공허 (Void)', color: 'text-purple-400' }, // 💡 공허 던전 속성명(vain) 매핑
    light: { name: '빛 (Light)', color: 'text-yellow-500' },
    neutral: { name: '무속성', color: 'text-neutral-400' }
  };

  // =========================================
  // ⚔️ 화면 1. 기사단 목록(갤러리) 화면 
  // =========================================
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center px-6 pb-6 pt-0 animate-[fadeIn_0.5s_ease-in-out] overflow-hidden">

        {/* ✨ 인게임 토스트 알림 컴포넌트 (체력 토스트 스타일) */}
        {toastMessage && (
          <div 
            className="fixed top-28 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center justify-center pointer-events-none w-max max-w-[90%]"
            style={{ animation: 'toastFadeInOut 2.5s ease-in-out forwards' }}
          >
            <div className={`bg-black/60 backdrop-blur-md border px-6 py-2 rounded-md flex items-center justify-center text-center shadow-xl
              ${toastMessage.type === 'success' 
                ? 'border-green-900/50 shadow-[0_0_15px_rgba(34,197,94,0.5)]' 
                : 'border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.5)]'}`}
            >
              <span className={`font-serif font-black tracking-wider text-sm italic drop-shadow-md whitespace-pre-line opacity-90
                ${toastMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}
              >
                {toastMessage.text}
              </span>
            </div>
          </div>
        )}
      
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
        @keyframes toastFadeInOut {
          0% { opacity: 0; transform: translate(-50%, -10px); }
          15% { opacity: 1; transform: translate(-50%, 0); }
          85% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -10px); }
        }
      `}</style>

      <div 
        className="absolute inset-x-0 top-[15%] bottom-0 bg-cover bg-bottom bg-no-repeat opacity-60 z-0 pointer-events-none"
        style={{ 
          backgroundImage: "url('/mypage/mypage-bg.webp')",
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)', 
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)' 
        }}
      ></div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center h-screen">
        <div className="w-full max-w-sm mt-2 mb-0 mx-auto relative flex justify-center pointer-events-none z-20 shrink-0">
          <div className="w-full flex justify-center" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' }}>
            <img src="/knights/knights-title.webp" alt="Knights Title" className="w-[85%] h-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.2)]" />
          </div>
        </div>

        <div className="w-full max-w-sm h-12 -mt-1 mb-4 flex justify-between items-center relative z-30 shrink-0">
          <div className="absolute top-0 w-[100vw] left-1/2 -translate-x-1/2 h-full bg-cover bg-center pointer-events-none -z-10" style={{ backgroundImage: "url('/header/header-bg.webp')", WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)' }}>
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <button onClick={onBack} className="transition-all duration-150 active:scale-90 px-2 outline-none">
            <img src="/header/backkey.webp" alt="Back" className="w-6 h-6 object-contain" />
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-[4px] drop-shadow-md z-20 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <img 
                key={i} 
                src="/header/hpball.webp" 
                alt="HP" 
                className={`w-[18px] h-[18px] object-contain transition-all duration-500 ${
                  i < hp 
                    ? 'opacity-100 drop-shadow-[0_0_5px_rgba(220,38,38,0.95)]' 
                    : 'opacity-20 grayscale saturate-50'
                }`} 
                draggable="false"
              />
            ))}
          </div>
          
          <div className="flex flex-col items-end mr-3 z-20 select-none">
            <button 
              onClick={() => setShowAnalysis(true)}
              className="text-[#d8b486] font-serif font-black text-[13px] tracking-[0.2em] drop-shadow-[0_2px_4px_rgba(0,0,0,1)] hover:text-amber-400 hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] active:scale-95 transition-all outline-none cursor-pointer"
            >
              STATUS
            </button>
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
              <img src="/knights/summon-bg.webp" alt="Summon Altar" className="absolute inset-0 w-full h-full object-cover z-0" />
              
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
                        // 👇👇👇 핵심 수정: 중앙에 있을 때 한 번 더 누르면 상세 화면으로 이동합니다! 👇👇👇
                        onClick={() => {
                          if (isCenter) {
                            setSelectedKnight(knight.id); // 중앙 기사 클릭 -> 스탯 미리보기 진입
                          } else {
                            setFocusedIndex(idx); // 양옆 기사 클릭 -> 중앙으로 포커스 이동
                          }
                        }}
                        // 👆👆👆 수정 끝 👆👆👆
                        className={`absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-out flex flex-col items-center
                          ${isCenter ? 'z-30 scale-100 opacity-100 cursor-pointer' : 'z-20 scale-75 opacity-40 grayscale-[40%] hover:opacity-60 cursor-pointer'}
                          ${isLeft ? '-translate-x-[75%]' : ''}
                          ${isRight ? 'translate-x-[75%]' : ''}
                        `}
                        style={{ height: '85%' }}
                      >
                        {/* 1:2 비율 기사 프로필 */}
                        <img 
                          src={knight.image} 
                          alt={knight.name} 
                          className="h-full aspect-[1/2] object-cover rounded-md border-[1.5px] border-[#8c6543] shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
                        />
                        
                            {/* 💡 소환 폰트 버튼 (버그 수정: 항상 활성화하여 부족 알림창이 뜨게 하고, 숨쉬기 고정) */}
                            {isCenter && (
                          // 💡 핵심: top-full을 써서 이미지의 맨 아래 경계선에 컨테이너의 윗부분을 딱 붙입니다.
                          // mt-1을 주어 이미지와 이름 사이에 1px 정도의 숨 쉴 틈만 줍니다.
                          <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 flex flex-col items-center z-50 w-max">
                            
                            {/* ✨ 기사 이름 (이미지 하단에 바짝 붙음) */}
                            <span className="text-[#a6845c] font-serif font-bold text-[11px] tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)] whitespace-nowrap">
                              {knight.name}
                            </span>

                            {/* 🔘 소환 버튼 (이름 아래에 mt-2.5로 적당한 간격을 두고 띄움) */}
                            {isOwned ? (
                              <span className="font-serif tracking-widest text-sm font-black text-neutral-500 drop-shadow-[0_2px_5px_rgba(0,0,0,1)] whitespace-nowrap mt-2.5">
                                Owned
                              </span>
                            ) : (
                              <button
                                onClick={(e) => { 
                                  e.preventDefault(); 
                                  e.stopPropagation(); 
                                  handleSummon(knight); 
                                }}
                                className="font-serif tracking-widest text-base font-black bg-transparent outline-none transition-all cursor-pointer text-[#fffff0] animate-pulse drop-shadow-[0_0_15px_rgba(0,0,0,1)] hover:scale-110 active:scale-95 whitespace-nowrap mt-2.5"
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
        <div 
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black select-none overflow-hidden cursor-pointer"
          onClick={() => {
            // 💡 로딩이 끝나고 텍스트가 뜬 상태일 때만 화면 터치로 닫기 허용
            if (showCinematicText) {
              closeCinematic();
            }
          }}
        >
          {/* 1. 번쩍이는 섬광 효과 */}
          <div className="absolute inset-0 bg-white mix-blend-overlay z-30 pointer-events-none opacity-0" style={{ animation: 'cinematicFlash 2.5s ease-in-out forwards' }} />
          
          {/* 2. 화면을 꽉 채우는 기사 이미지 */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <img 
              src={summoningKnight.fullImage || summoningKnight.image} 
              alt={summoningKnight.name} 
              className="w-full h-full object-cover object-center opacity-0"
              style={{ animation: 'cinematicRise 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s forwards' }}
            />
          </div>

          {/* 3. 강력한 테두리 그라데이션 (다크 판타지 비네팅 효과) */}
          <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_20%,_black_100%)] opacity-95"></div>
          <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-black via-black/80 to-transparent h-full"></div>
          <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-black/80 via-transparent to-transparent"></div>

          {/* 4. 하단 폰트 연출 영역 */}
          <div className="absolute bottom-24 w-full text-center z-40 px-4">
            {showCinematicText ? (
              <div className="animate-[fadeIn_1s_ease-out_forwards] flex flex-col items-center">
                {/* 💡 폰트를 게임 컨셉에 맞게 고급스러운 명조체(Serif)와 이탤릭 적용 */}
                <h4 className="text-yellow-400 font-serif font-black text-4xl tracking-[0.25em] drop-shadow-[0_0_20px_rgba(250,204,21,0.8)] italic">
                  {summoningKnight.name}
                </h4>
                
                {/* 💡 버튼을 없애고 깜빡이는 터치 유도 문구 삽입 */}
                <div className="mt-16 text-[#a6845c]/70 font-serif tracking-[0.3em] text-[12px] animate-pulse">
                  - Continue -
                </div>
              </div>
            ) : (
              <div className="text-[#a6845c] font-serif font-black tracking-[0.5em] text-xs animate-pulse drop-shadow-md">
                시공의 틈을 여는 중...
              </div>
            )}
          </div>
        </div>
      )}

      {newAchievement && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black animate-[fadeIn_0.5s_ease-out] select-none cursor-pointer"
          onClick={() => setNewAchievement(null)} // 💡 화면 터치 시 자연스럽게 닫힘
        >
          {/* 배경 이미지 */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/achievement-bg.jpg')" }}
          ></div>

          {/* 💡 중앙 텍스트 영역 (이미지 가운데 어두운 빈 공간에 딱 맞게 배치) */}
          <div className="absolute top-1/2 left-0 w-full -translate-y-[45%] flex flex-col items-center justify-center pointer-events-none">
            <span className={`font-serif font-black text-4xl tracking-widest mb-3 text-center px-4 leading-tight ${newAchievement.textColor} ${newAchievement.glow}`}>
              {newAchievement.name}
            </span>
            <span className="text-neutral-300 font-bold text-[13px] tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              {newAchievement.description}
            </span>
          </div>

          {/* 하단 터치 유도 문구 */}
          <div className="absolute bottom-12 w-full text-center pointer-events-none">
            <span className="text-white/60 font-serif tracking-[0.3em] text-[10px] animate-pulse">
              - 화면을 터치하여 계속 -
            </span>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 🏆 전투력 분석 팝업 (여기에 통째로 추가) */}
      {/* ========================================== */}
      {showAnalysis && (
        <div 
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setShowAnalysis(false)}
        >
          <div 
            className="w-full max-w-sm bg-neutral-950 rounded-xl p-5 shadow-[0_0_40px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-cover bg-center z-0 opacity-20" style={{ backgroundImage: "url('/yangpiji-bg.webp')" }}></div>
            
            <div className="relative z-10">
              <h2 className="text-xl text-center text-[#f5d5a9] font-black font-serif tracking-widest mb-5 drop-shadow-md border-b border-[#5c3e23] pb-3">
                KNIGHTS STATS
              </h2>

              <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="bg-black/60 border border-[#5c3e23]/50 rounded-md p-2 flex flex-col items-center">
                  <span className="text-[#a6845c] text-[10px] font-bold mb-0.5">Total HP</span>
                  <span className="text-red-400 font-black text-base">{partyStats.maxHp.toLocaleString()}</span>
                </div>
                <div className="bg-black/60 border border-[#5c3e23]/50 rounded-md p-2 flex flex-col items-center">
                  <span className="text-[#a6845c] text-[10px] font-bold mb-0.5">Total MP</span>
                  <span className="text-blue-400 font-black text-base">{partyStats.maxMp.toLocaleString()}</span>
                </div>
                <div className="bg-black/60 border border-[#5c3e23]/50 rounded-md p-2 flex flex-col items-center">
                  <span className="text-[#a6845c] text-[10px] font-bold mb-0.5">DEF</span>
                  <span className="text-neutral-200 font-black text-base">{partyStats.defense.toLocaleString()}</span>
                </div>
                <div className="bg-black/60 border border-[#5c3e23]/50 rounded-md p-2 flex flex-col items-center">
                  <span className="text-[#a6845c] text-[10px] font-bold mb-0.5">AVR / CRI</span>
                  <span className="text-yellow-400 font-black text-base">{partyStats.evasionRate}% / {partyStats.critRate}%</span>
                </div>
              </div>

              <div className="bg-black/40 border border-[#4a2c11] rounded-md p-3">
                <h3 className="text-center text-[#d8b486] font-bold text-xs tracking-widest mb-3">
                  ATK by Attribute
                </h3>
                
                <div className="space-y-1.5 h-40 overflow-y-auto custom-scrollbar pr-1">
                  {Object.entries(elementalBP).map(([element, bp]) => {
                    const display = elementDisplay[element] || elementDisplay['neutral'];
                    return (
                      <div key={element} className="flex justify-between items-center bg-black/60 border border-neutral-800/50 rounded px-3 py-1.5">
                        <span className={`font-black tracking-wider text-[11px] ${display.color}`}>
                          {display.name}
                        </span>
                        <span className="text-white font-black tabular-nums tracking-wider text-sm">
                          {bp.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
