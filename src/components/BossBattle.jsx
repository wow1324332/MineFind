import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

import { RAID_BOSS_DATABASE } from '../constants/raidBossData';
import { KNIGHT_DATABASE } from '../constants/knightData';
import { EQUIP_DATABASE } from '../constants/equipData'; 
import { calculatePartyStats, calculateTurnDamage } from '../utils/combatUtils';
import { SKILL_DATABASE } from '../constants/skillData'; 
import { DUNGEON_INFO } from '../constants/dungeonData';
import { ITEM_DATABASE } from '../constants/itemData';

export default function BossBattle({ bossId = 'dantalion', onBack }) {
  const { user } = useAuth();

  const bossData = RAID_BOSS_DATABASE[bossId];
  const [bossHp, setBossHp] = useState(bossData?.stats?.maxHp || 100);

  const [partyKnights, setPartyKnights] = useState(Array(6).fill(null));
  const [partyStats, setPartyStats] = useState(null);
  const [partyHp, setPartyHp] = useState(0);
  const [partyMp, setPartyMp] = useState(0);

  const [introStage, setIntroStage] = useState('loading'); 

  const [isAnimating, setIsAnimating] = useState(false); 
  const [bossEffect, setBossEffect] = useState(null);    
  const [partyEffect, setPartyEffect] = useState(null);  
  const [battleResult, setBattleResult] = useState(null); 
  const [showExitPopup, setShowExitPopup] = useState(false);
  
  // ✨ 스킬 컷인 애니메이션 상태 추가
  const [skillCutin, setSkillCutin] = useState(null);
  const [earnedRewards, setEarnedRewards] = useState(null);

  useEffect(() => {
    if (partyStats && bossData) {
      setIntroStage('text'); 
      setTimeout(() => setIntroStage('slash'), 800);  
      setTimeout(() => setIntroStage('split'), 950);  
      setTimeout(() => setIntroStage('done'), 1500);  
    }
  }, [partyStats, bossData]);

  useEffect(() => {
    if (!user) return;
    const fetchBattleData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userLevel = userData.level || 1; 
          const userNickname = userData.nickname || user.displayName || '무명의 용사';

          let myPartyIds = userData.unlockedKnights || ['knight_main'];
          if (!myPartyIds.includes('knight_main')) {
            myPartyIds = ['knight_main', ...myPartyIds];
          }
          
          const slots = Array(6).fill(null);
          const activeKnights = [];

          myPartyIds.forEach((id, index) => {
            if (index < 6 && KNIGHT_DATABASE[id]) {
              const kDb = KNIGHT_DATABASE[id];
              const kLevel = id === 'knight_main' ? userLevel : (userData.knightStats?.[id]?.level || 1);
              const lvMultiplier = kLevel - 1;

              let kEquip = {
                WEAPON: { tier: 0, element: 'neutral', enhance: 0 }, HELMET: { tier: 0, element: 'neutral', enhance: 0 },
                SHIELD: { tier: 0, element: 'neutral', enhance: 0 }, ARMOR: { tier: 0, element: 'neutral', enhance: 0 }
              };
              
              if (id === 'knight_main' && userData.equipment) {
                kEquip = { ...kEquip, ...userData.equipment };
              } else if (userData.knightStats?.[id]?.equipment) {
                kEquip = { ...kEquip, ...userData.knightStats[id].equipment };
              }

              let finalEquipBonus = { str: 0, agi: 0, int: 0, vit: 0, luk: 0 };
              ['WEAPON', 'HELMET', 'SHIELD', 'ARMOR'].forEach(part => {
                 const state = kEquip[part];
                 const equipKey = `tier_${state.tier}_${state.element || 'neutral'}`;
                 const dbData = EQUIP_DATABASE[part]?.evolutions[equipKey] || EQUIP_DATABASE[part]?.evolutions['tier_0_neutral'];
                 const growth = EQUIP_DATABASE[part]?.enhanceGrowth?.[`tier_${state.tier}`] || EQUIP_DATABASE[part]?.enhanceGrowth?.tier_0 || { str:0, agi:0, int:0, vit:0, luk:0 };
                 
                 const isSynergy = kDb.attribute !== 'neutral' && kDb.attribute === dbData.element;
                 const multiplier = isSynergy ? 1.2 : 1.0;

                 finalEquipBonus.str += Math.floor((dbData.baseStat.str + growth.str * state.enhance) * multiplier);
                 finalEquipBonus.agi += Math.floor((dbData.baseStat.agi + growth.agi * state.enhance) * multiplier);
                 finalEquipBonus.int += Math.floor((dbData.baseStat.int + growth.int * state.enhance) * multiplier);
                 finalEquipBonus.vit += Math.floor((dbData.baseStat.vit + growth.vit * state.enhance) * multiplier);
                 finalEquipBonus.luk += Math.floor((dbData.baseStat.luk + growth.luk * state.enhance) * multiplier);
              });

              const flatKnight = {
                id,
                name: id === 'knight_main' ? userNickname : kDb.name,
                image: kDb.image,
                attribute: kDb.attribute, 
                activeSkill: kDb.activeSkill, 
                passiveSkill: id === 'knight_main' ? (userData.mainPassive || kDb.passiveSkill) : kDb.passiveSkill, 
                str: kDb.baseStats.str + (kDb.statGrowth.str * lvMultiplier) + finalEquipBonus.str,
                agi: kDb.baseStats.agi + (kDb.statGrowth.agi * lvMultiplier) + finalEquipBonus.agi,
                int: kDb.baseStats.int + (kDb.statGrowth.int * lvMultiplier) + finalEquipBonus.int,
                vit: kDb.baseStats.vit + (kDb.statGrowth.vit * lvMultiplier) + finalEquipBonus.vit,
                luk: kDb.baseStats.luk + (kDb.statGrowth.luk * lvMultiplier) + finalEquipBonus.luk,
              };

              slots[index] = flatKnight; 
              activeKnights.push(flatKnight);
            }
          });

          setPartyKnights(slots);

          const stats = calculatePartyStats(activeKnights, bossData.element || 'neutral');
          setPartyStats(stats);
          setPartyHp(stats.maxHp); 
          setPartyMp(0); 
        }
      } catch (error) {
        console.error("전투 데이터 로딩 실패:", error);
      }
    };
    fetchBattleData();
  }, [user]);


  // ==========================================================
  // ⚔️ [기존 만능 턴 엔진 캡슐화] 0.1%도 변경 안 된 기존 로직입니다.
  // ==========================================================
  const processCombatSequence = (actionType, skill) => {
    let currentBossHp = bossHp;
    let currentPartyHp = partyHp;
    let currentPartyMp = partyMp;

    if (actionType === 'SKILL' && skill) {
      currentPartyMp -= skill.mpCost;
      setPartyMp(currentPartyMp);

      if (skill.subType === 'attack' || skill.subType === 'dot' || skill.subType === 'debuff') {
        const attackRes = calculateTurnDamage(partyStats, bossData.stats, true, skill);
        currentBossHp = Math.max(0, currentBossHp - attackRes.damage);
        
        const extraText = skill.subType === 'dot' ? '\n(맹독)' : (skill.subType === 'debuff' ? '\n(약화)' : '');
        setBossEffect({ damage: attackRes.damage + extraText, isCrit: attackRes.isCrit, isMiss: attackRes.isMiss, id: Date.now(), isSkill: true });
      } 
      else if (skill.subType === 'heal') {
        const healAmount = Math.floor(partyStats.baseAttackPower * skill.power);
        currentPartyHp = Math.min(partyStats.maxHp, currentPartyHp + healAmount);
        setPartyEffect({ damage: `+${healAmount} HEAL`, isHeal: true, id: Date.now() });
      } 
      else if (skill.subType === 'buff' || skill.subType === 'evade') {
        setPartyEffect({ damage: `BUFF ON!`, isBuff: true, id: Date.now() });
      }
    } else {
      const attackRes = calculateTurnDamage(partyStats, bossData.stats, true, null);
      currentBossHp = Math.max(0, currentBossHp - attackRes.damage);
      setBossEffect({ damage: attackRes.damage, isCrit: attackRes.isCrit, isMiss: attackRes.isMiss, id: Date.now() });
    }
    
    setBossHp(currentBossHp);

    setTimeout(() => {
      setBossEffect(null); 
      setPartyEffect(null);

      if (currentBossHp <= 0) {
        // 💡 1. 확률에 따른 드랍 아이템 및 보상 계산
        const rGold = bossData.rewards?.gold || 0;
        const rExp = bossData.rewards?.exp || 0;
        const rItems = {};
        
        if (bossData.rewards?.dropItems) {
          bossData.rewards.dropItems.forEach(drop => {
            if (Math.random() <= drop.chance) {
              rItems[drop.itemId] = (rItems[drop.itemId] || 0) + 1;
            }
          });
        }

        setEarnedRewards({ gold: rGold, earnedExp: rExp, items: rItems });
        setBattleResult('win');
        setIsAnimating(false);

        // 💡 2. 파이어베이스 DB에 안전하게 즉시 저장 (증발 방지용 비동기 처리)
        (async () => {
          try {
            const userDocRef = doc(db, 'users', user.uid);
            const updates = {
              'inventory.gold': increment(rGold),
              exp: increment(rExp)
            };
            Object.entries(rItems).forEach(([itemId, count]) => {
              updates[`inventory.items.${itemId}`] = increment(count);
            });
            await updateDoc(userDocRef, updates);
          } catch (err) {
            console.error("보상 저장 실패:", err);
          }
        })();

        return;
      }

      const bossAttack = calculateTurnDamage(bossData.stats, partyStats, false);
      
      if (actionType === 'SKILL' && skill && skill.subType === 'evade') {
        bossAttack.damage = 0;
        bossAttack.isMiss = true;
      }

      currentPartyHp = Math.max(0, currentPartyHp - bossAttack.damage);
      setPartyEffect({ damage: bossAttack.damage, isCrit: bossAttack.isCrit, isMiss: bossAttack.isMiss, id: Date.now() });
      setPartyHp(currentPartyHp);

      setTimeout(() => {
        setPartyEffect(null);

        if (currentPartyHp <= 0) {
          // 💡 1. 패배 시 보상(defeatRewards) 계산
          const rGold = bossData.defeatRewards?.gold || 0;
          const rExp = bossData.defeatRewards?.exp || 0;
          const rItems = {};
          
          if (bossData.defeatRewards?.dropItems) {
            bossData.defeatRewards.dropItems.forEach(drop => {
              if (Math.random() <= drop.chance) {
                rItems[drop.itemId] = (rItems[drop.itemId] || 0) + 1;
              }
            });
          }

          setEarnedRewards({ gold: rGold, earnedExp: rExp, items: rItems });
          setBattleResult('lose');
          setIsAnimating(false);

          // 💡 2. 파이어베이스 DB에 위로 보상 안전하게 저장
          if (rGold > 0 || rExp > 0 || Object.keys(rItems).length > 0) {
            (async () => {
              try {
                const userDocRef = doc(db, 'users', user.uid);
                const updates = {};
                if (rGold > 0) updates['inventory.gold'] = increment(rGold);
                if (rExp > 0) updates.exp = increment(rExp);
                
                Object.entries(rItems).forEach(([itemId, count]) => {
                  updates[`inventory.items.${itemId}`] = increment(count);
                });
                await updateDoc(userDocRef, updates);
              } catch (err) {
                console.error("패배 보상 저장 실패:", err);
              }
            })();
          }
        } else {
          setPartyMp(prevMp => Math.min(partyStats.maxMp, prevMp + partyStats.mpRegen));
          setIsAnimating(false); 
        }
      }, 1000);

    }, 1000);
  };


  // ==========================================================
  // ⚔️ [신규 발동기] 스킬일 경우 애니메이션부터 재생하고 엔진을 부릅니다!
  // ==========================================================
  const handleAction = (actionType = 'ATTACK', skill = null, casterKnight = null) => {
    if (bossHp <= 0 || partyHp <= 0 || isAnimating || battleResult || introStage !== 'done') return; 
    setIsAnimating(true); 

    if (actionType === 'SKILL' && skill && casterKnight) {
      // 🎬 1. 스킬 연출 시작!
      setSkillCutin({ knight: casterKnight, skill, stage: 'enter' });
      
      // 타이밍 조절: 0.3초(등장) -> 1.1초(기합) -> 1.25초(참격 플래시) -> 1.75초(갈라짐 완료 & 데미지 터짐)
      setTimeout(() => setSkillCutin(prev => prev ? { ...prev, stage: 'pause' } : null), 300);
      setTimeout(() => setSkillCutin(prev => prev ? { ...prev, stage: 'slash' } : null), 1100);
      setTimeout(() => setSkillCutin(prev => prev ? { ...prev, stage: 'split' } : null), 1250);
      
      // 🎬 2. 연출이 박살나며 끝나는 순간, 원장님의 기존 데미지 로직 실행!
      setTimeout(() => {
        setSkillCutin(null);
        processCombatSequence(actionType, skill);
      }, 1750);
    } else {
      // 일반 평타는 애니메이션 없이 바로 엔진 실행
      processCombatSequence(actionType, skill);
    }
  };


// ✨ 속성별 컷인 컬러 팔레트 추출기
  const getCutinColors = (element) => {
    switch(element) {
      case 'fire': return { bg: 'from-red-950 via-red-800 to-black', border: 'border-red-500/50', shadow: 'shadow-[0_0_30px_rgba(220,38,38,0.5)]', img: 'drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]', sub: 'text-red-300', main: 'drop-shadow-[0_0_20px_rgba(220,38,38,1)]' };
      case 'water': return { bg: 'from-blue-950 via-blue-800 to-black', border: 'border-blue-500/50', shadow: 'shadow-[0_0_30px_rgba(59,130,246,0.5)]', img: 'drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]', sub: 'text-blue-300', main: 'drop-shadow-[0_0_20px_rgba(59,130,246,1)]' };
      case 'ice': return { bg: 'from-cyan-950 via-cyan-800 to-black', border: 'border-cyan-400/50', shadow: 'shadow-[0_0_30px_rgba(34,211,238,0.5)]', img: 'drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]', sub: 'text-cyan-200', main: 'drop-shadow-[0_0_20px_rgba(34,211,238,1)]' };
      case 'poison': return { bg: 'from-green-950 via-green-800 to-black', border: 'border-green-500/50', shadow: 'shadow-[0_0_30px_rgba(34,197,94,0.5)]', img: 'drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]', sub: 'text-green-300', main: 'drop-shadow-[0_0_20px_rgba(34,197,94,1)]' };
      case 'cure': return { bg: 'from-emerald-950 via-emerald-800 to-black', border: 'border-emerald-400/50', shadow: 'shadow-[0_0_30px_rgba(16,185,129,0.5)]', img: 'drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]', sub: 'text-emerald-200', main: 'drop-shadow-[0_0_20px_rgba(16,185,129,1)]' };
      case 'vain': return { bg: 'from-purple-950 via-purple-800 to-black', border: 'border-purple-500/50', shadow: 'shadow-[0_0_30px_rgba(168,85,247,0.5)]', img: 'drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]', sub: 'text-purple-300', main: 'drop-shadow-[0_0_20px_rgba(168,85,247,1)]' };
      case 'light': return { bg: 'from-yellow-950 via-yellow-700 to-black', border: 'border-yellow-500/50', shadow: 'shadow-[0_0_30px_rgba(234,179,8,0.5)]', img: 'drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]', sub: 'text-yellow-200', main: 'drop-shadow-[0_0_20px_rgba(234,179,8,1)]' };
      default: return { bg: 'from-neutral-900 via-neutral-700 to-black', border: 'border-neutral-400/50', shadow: 'shadow-[0_0_30px_rgba(156,163,175,0.5)]', img: 'drop-shadow-[0_0_15px_rgba(156,163,175,0.8)]', sub: 'text-neutral-300', main: 'drop-shadow-[0_0_20px_rgba(156,163,175,1)]' };
    }
  };

    // ✨ 컷인 내용물 렌더링 함수 (속성 컬러 동적 적용)
    const renderCutinContent = () => {
    // 현재 스킬을 쓴 기사의 속성을 가져와서 컬러셋을 뽑아냅니다.
    const colors = getCutinColors(skillCutin.knight.attribute || skillCutin.skill.element);
    
    return (
      <div className={`w-full h-full bg-gradient-to-r ${colors.bg} flex items-center px-[10%] sm:px-[15%] border-y-[3px] ${colors.border} ${colors.shadow}`} style={{ transform: 'skewX(-15deg)', animation: 'cutinBand 0.3s ease-out forwards' }}>
         {/* 기사 초상화 크게 줌인 (속성별 그림자 색상 적용) */}
         <img src={skillCutin.knight.image} alt="Knight" className={`h-[200%] w-auto object-cover object-top opacity-90 ${colors.img} mix-blend-lighten -ml-10`} style={{ transform: 'skewX(15deg)', animation: 'cutinFace 0.5s ease-out forwards' }} />
         
         <div className="ml-auto flex flex-col items-end justify-center h-full" style={{ transform: 'skewX(15deg)' }}>
           {/* 서브 텍스트 (속성별 컬러) */}
           <span className={`${colors.sub} font-bold text-xs sm:text-sm tracking-[0.5em] uppercase mb-1 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]`} style={{ animation: 'cutinText 0.4s ease-out 0.1s both' }}>
             Skill Active
           </span>
           {/* 메인 스킬명 (속성별 네온 글로우) */}
           <span className={`text-white font-serif font-black text-3xl sm:text-4xl italic tracking-wider ${colors.main} whitespace-nowrap`} style={{ animation: 'cutinText 0.4s ease-out 0.2s both' }}>
             {skillCutin.skill.name}
           </span>
         </div>
      </div>
    );
  };

// 💡 보상 아이템을 예쁘게 그려주는 미니 렌더링 함수 (App.jsx에서 이식)
  const renderRewardsUI = () => {
    if (!earnedRewards) return null;
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[16rem] z-10 animate-[fadeIn_0.5s_ease-in-out]">
        <div className="bg-black/70 rounded-md p-4 border border-[#a6845c]/20 shadow-[0_0_30px_rgba(0,0,0,0.9)]">
          <h3 className="text-center font-serif text-[#d8b486] text-sm tracking-[0.3em] mb-4 drop-shadow-md uppercase">
            Acquired
          </h3>
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex justify-center items-center bg-black/40 rounded-sm py-1.5">
              <span className="text-[#f5d5a9] font-black text-[16px] tracking-widest font-serif drop-shadow-md">
                +{earnedRewards.gold} <span className="text-[10px] text-[#d8b486] ml-1 font-sans uppercase">Gold</span>
              </span>
            </div>
            <div className="flex justify-center items-center bg-black/40 rounded-sm py-1.5 border border-blue-900/30">
              <span className="text-blue-300 font-black text-[16px] tracking-widest font-serif drop-shadow-md">
                +{earnedRewards.earnedExp} <span className="text-[10px] text-blue-400/80 ml-1 font-sans uppercase">EXP</span>
              </span>
            </div>
          </div>
          {earnedRewards.items && Object.keys(earnedRewards.items).length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-2 pt-3 border-t border-[#a6845c]/20">
              {Object.entries(earnedRewards.items).map(([itemId, count]) => {
                const item = ITEM_DATABASE[itemId];
                if (!item) return null;
                return (
                  <div key={itemId} className="w-12 h-12 bg-black/40 rounded-sm flex items-center justify-center relative group border border-[#5c3e23]/30">
                    {item.icon.startsWith('/') ? (
                      <img src={item.icon} alt={item.name} className="w-[70%] h-[70%] object-contain drop-shadow-md" draggable="false" />
                    ) : (
                      <span className="text-2xl drop-shadow-md select-none">{item.icon}</span>
                    )}
                    <span className="absolute bottom-0 right-1 text-[10px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!bossData) return <div className="fixed inset-0 bg-black z-50 flex items-center justify-center text-red-500 font-bold">보스 데이터 로딩 실패 ({bossId})</div>;
  if (!partyStats) return <div className="fixed inset-0 bg-black z-50"></div>; 

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black select-none touch-manipulation overflow-hidden">
      
      <style>{`
        @keyframes textPunch { 0% { transform: scale(2.5); opacity: 0; filter: blur(5px); } 40% { transform: scale(0.9); opacity: 1; filter: blur(0); } 60% { transform: scale(1.05); } 100% { transform: scale(1); } }
        @keyframes flash { 0% { opacity: 0; } 30% { opacity: 1; } 100% { opacity: 0; } }
        .split-top { clip-path: polygon(0 0, 100% 0, 100% 45%, 0 55%); transition: transform 0.5s cubic-bezier(0.5, 0, 0.2, 1), opacity 0.5s; }
        .split-bottom { clip-path: polygon(0 55%, 100% 45%, 100% 100%, 0 100%); transition: transform 0.5s cubic-bezier(0.5, 0, 0.2, 1), opacity 0.5s; }
        .slash-line { position: absolute; top: 50%; left: -10%; width: 120%; height: 3px; background: #fff; box-shadow: 0 0 15px #fff, 0 0 30px #dc2626; transform: rotate(-5deg) scaleX(0); transform-origin: left center; opacity: 0; transition: transform 0.15s ease-out, opacity 0.15s; }
        .slash-line.active { transform: rotate(-5deg) scaleX(1); opacity: 1; }
        .slash-line.fade { opacity: 0; transform: rotate(-5deg) scaleX(1) scaleY(10); transition: transform 0.3s ease-out, opacity 0.3s ease-out; }
        
        @keyframes floatUpDamage { 0% { transform: translateY(0) scale(0.5); opacity: 0; } 20% { transform: translateY(-20px) scale(1.3); opacity: 1; } 40% { transform: translateY(-30px) scale(1); opacity: 1; } 100% { transform: translateY(-70px) scale(1); opacity: 0; } }
        @keyframes slashHit { 0% { transform: rotate(-15deg) scaleX(0); opacity: 1; } 50% { transform: rotate(-15deg) scaleX(1); opacity: 1; } 100% { transform: rotate(-15deg) scaleX(1.5) scaleY(4); opacity: 0; } }
        @keyframes shakeHit { 0%, 100% { transform: translate(0, 0); } 20% { transform: translate(-8px, 6px); } 40% { transform: translate(6px, -8px); } 60% { transform: translate(-6px, -6px); } 80% { transform: translate(8px, 8px); } }
        
        /* ✨ 스킬 컷인 전용 애니메이션 */
        @keyframes cutinBand { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(0) skewX(-15deg); } }
        @keyframes cutinFace { 0% { transform: scale(1.3) translateX(-30px) skewX(15deg); opacity: 0; } 100% { transform: scale(1.1) translateX(0) skewX(15deg); opacity: 1; } }
        @keyframes cutinText { 0% { transform: translateX(40px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        .cutin-split-top { clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%); transition: transform 0.4s cubic-bezier(0.5, 0, 0.2, 1), opacity 0.4s; }
        .cutin-split-bottom { clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%); transition: transform 0.4s cubic-bezier(0.5, 0, 0.2, 1), opacity 0.4s; }
      `}</style>

      {/* ✨ 스킬 컷인 연출 UI */}
      {skillCutin && (
        <div className="absolute inset-0 z-[250] flex items-center justify-center overflow-hidden pointer-events-none">
          {/* 배경 딤 처리 */}
          <div className={`absolute inset-0 transition-opacity duration-300 ${skillCutin.stage === 'enter' || skillCutin.stage === 'pause' ? 'bg-black/75' : 'bg-transparent'}`}></div>

          <div className="relative w-[150%] h-48 sm:h-56 flex items-center justify-center">
            
            {/* 상단 반갈죽 컨테이너 */}
            <div className={`absolute inset-0 w-full h-full flex items-center justify-center cutin-split-top ${skillCutin.stage === 'split' ? '-translate-x-12 -translate-y-12 opacity-0' : ''}`}>
              {renderCutinContent()}
            </div>
            
            {/* 하단 반갈죽 컨테이너 */}
            <div className={`absolute inset-0 w-full h-full flex items-center justify-center cutin-split-bottom ${skillCutin.stage === 'split' ? 'translate-x-12 translate-y-12 opacity-0' : ''}`}>
              {renderCutinContent()}
            </div>

            {/* 하얀색 참격선 (갈라질 때 발동) */}
            <div className={`slash-line ${skillCutin.stage === 'slash' ? 'active' : ''} ${skillCutin.stage === 'split' ? 'fade' : ''}`} style={{ background: '#fff', boxShadow: '0 0 20px #fff, 0 0 40px #ef4444' }}></div>
            
            {/* 참격 플래시 눈뽕 효과 */}
            {skillCutin.stage === 'slash' && <div className="absolute inset-0 bg-white" style={{ animation: 'flash 0.15s ease-out forwards' }}></div>}
          </div>
        </div>
      )}

      {/* BATTLE START 인트로 */}
      {introStage !== 'done' && introStage !== 'loading' && (
        <div className="absolute inset-0 z-[200] pointer-events-none overflow-hidden">
          <div className={`absolute inset-0 bg-black flex items-center justify-center split-top ${introStage === 'split' ? '-translate-x-8 -translate-y-12 opacity-0' : ''}`}>
             <span className="text-red-600 font-sans font-black text-2xl sm:text-3xl tracking-[0.3em] uppercase drop-shadow-[0_0_20px_rgba(220,38,38,1)] italic" style={{ animation: 'textPunch 0.5s ease-out forwards' }}>Battle Start</span>
          </div>
          <div className={`absolute inset-0 bg-black flex items-center justify-center split-bottom ${introStage === 'split' ? 'translate-x-8 translate-y-12 opacity-0' : ''}`}>
             <span className="text-red-600 font-sans font-black text-2xl sm:text-3xl tracking-[0.3em] uppercase drop-shadow-[0_0_20px_rgba(220,38,38,1)] italic" style={{ animation: 'textPunch 0.5s ease-out forwards' }}>Battle Start</span>
          </div>
          <div className={`slash-line ${introStage === 'slash' ? 'active' : ''} ${introStage === 'split' ? 'fade' : ''}`}></div>
          {introStage === 'slash' && <div className="absolute inset-0 bg-white" style={{ animation: 'flash 0.15s ease-out forwards' }}></div>}
        </div>
      )}

      {/* 🏆 전투 승리 화면 */}
      {battleResult === 'win' && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col justify-end pb-8"
          style={{ 
            backgroundImage: `url(${DUNGEON_INFO[bossData.element]?.winBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            animation: 'fadeInOverlay 1.0s cubic-bezier(0.25, 1, 0.5, 1) forwards'
          }}
        >
          <div className="absolute inset-0 bg-black/50 pointer-events-none z-0"></div>
          
          {/* 보상 카드 렌더링 */}
          {renderRewardsUI()}

          <div className="flex justify-center items-center gap-4 px-6 w-full max-w-md mx-auto relative z-10 mt-8">
            <button 
              onClick={onBack} 
              className="flex-1 transition-all duration-200 active:scale-95 hover:brightness-110 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] select-none"
            >
              <img src="/back.png" alt="Back" className="w-full max-w-[150px] mx-auto h-auto object-contain pointer-events-none" draggable="false" />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-0"></div>
        </div>
      )}

      {/* 💀 전투 패배 화면 */}
      {battleResult === 'lose' && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col justify-between pb-8 pt-12"
          style={{ 
            backgroundImage: `url(${DUNGEON_INFO[bossData.element]?.loseBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            animation: 'fadeInOverlay 1.4s cubic-bezier(0.25, 1, 0.5, 1) forwards'
          }}
        >
          <div className="absolute inset-0 bg-black/50 pointer-events-none z-0"></div>
          
          {/* 💡 상단/중앙: 패배 위로 보상 모달 렌더링 */}
          <div className="flex-1 flex items-center justify-center relative z-10 w-full">
            {renderRewardsUI()}
          </div>
          
          {/* 💡 하단: Back 버튼 영역 (크기 고정 및 절대적인 중앙 정렬) */}
          <div className="flex justify-center items-center w-full px-6 relative z-10 mt-4">
            <button 
              onClick={onBack} 
              className="w-full max-w-[160px] transition-all duration-200 active:scale-95 hover:brightness-110 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] select-none"
              style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
            >
              <img src="/back.png" alt="Back" className="w-full h-auto object-contain pointer-events-none" draggable="false" />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-0"></div>
        </div>
      )}

      {/* 배경: 보스 이미지 */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 z-0 ${bossEffect ? 'animate-[shakeHit_0.3s_ease-in-out]' : ''}`} 
        style={{ backgroundImage: `url('${bossData.image}')` }}
      ></div>
      
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/90 via-black/40 to-transparent z-0 pointer-events-none"></div>
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent z-0 pointer-events-none"></div>

      {/* 상단 UI (보스 영역) */}
      <div className={`relative z-10 w-full px-4 pt-10 flex flex-col items-center ${bossEffect ? 'animate-[shakeHit_0.3s_ease-in-out]' : ''}`}>
        
        <button 
          onClick={() => setShowExitPopup(true)} 
          className="absolute left-4 top-8 transition-all duration-150 active:scale-90 outline-none" 
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <img src="/header/backkey.webp" alt="Exit" className="w-8 h-8 object-contain drop-shadow-md" draggable="false" />
        </button>

        <div className="w-full max-w-sm flex flex-col items-end gap-1">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-800 font-serif font-black text-sm sm:text-base tracking-[0.3em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)] italic pr-1">
            {bossId}
          </span>
          
          <div className="w-full h-4 bg-black/80 border-[1.5px] border-red-900/50 rounded-full overflow-hidden relative shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <div className="h-full bg-gradient-to-r from-red-900 to-red-500 transition-all duration-300" style={{ width: `${Math.max(0, (bossHp / bossData.stats.maxHp) * 100)}%` }}></div>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">{bossHp} / {bossData.stats.maxHp}</span>
          </div>
        </div>

        {/* 💥 보스 피격 데미지 팝업 */}
        {bossEffect && (
          <div key={`boss-${bossEffect.id}`} className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 translate-y-16">
            {!bossEffect.isMiss && <div className={`absolute w-[150%] h-3 rounded-full animate-[slashHit_0.3s_ease-out_forwards] ${bossEffect.isSkill ? 'bg-purple-400 shadow-[0_0_20px_#c084fc,0_0_40px_#9333ea]' : 'bg-white shadow-[0_0_20px_#fff,0_0_40px_#ef4444]'}`}></div>}
            
            <span className={`absolute font-black italic tracking-wider whitespace-pre-line text-center animate-[floatUpDamage_1s_ease-out_forwards] ${bossEffect.isMiss ? 'text-gray-400 text-4xl' : (bossEffect.isCrit ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,1)] text-6xl' : (bossEffect.isSkill ? 'text-purple-300 drop-shadow-[0_0_10px_rgba(147,51,234,1)] text-5xl' : 'text-white drop-shadow-[0_0_10px_rgba(220,38,38,1)] text-5xl'))}`}>
              {bossEffect.isMiss ? 'MISS' : bossEffect.damage}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 w-full relative z-10 flex flex-col items-center justify-center px-4"></div>

      {/* 하단 UI (기사단 영역) */}
      <div className={`relative z-10 w-full px-2 pb-6 flex flex-col gap-3 ${partyEffect ? 'animate-[shakeHit_0.3s_ease-in-out]' : ''}`}>
        
        {/* 💥 기사단 피격 팝업 */}
        {partyEffect && (
          <div key={`party-${partyEffect.id}`} className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 -translate-y-24">
            {!partyEffect.isMiss && !partyEffect.isHeal && !partyEffect.isBuff && <div className="absolute w-[120%] h-3 bg-red-600 rounded-full shadow-[0_0_20px_#ef4444,0_0_40px_#991b1b] animate-[slashHit_0.3s_ease-out_forwards]"></div>}
            
            <span className={`absolute font-black italic tracking-wider animate-[floatUpDamage_1s_ease-out_forwards] ${
              partyEffect.isHeal ? 'text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,1)] text-5xl' : 
              partyEffect.isBuff ? 'text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,1)] text-4xl' :
              partyEffect.isMiss ? 'text-gray-400 text-4xl' : 
              (partyEffect.isCrit ? 'text-orange-500 drop-shadow-[0_0_15px_rgba(234,179,8,1)] text-6xl' : 'text-red-500 drop-shadow-[0_0_10px_rgba(0,0,0,1)] text-5xl')
            }`}>
              {partyEffect.isMiss ? 'MISS' : partyEffect.damage}
            </span>
          </div>
        )}

        <div className="w-full flex justify-between gap-1 px-1">
          {partyKnights.map((knight, idx) => {
            const skill = knight && knight.activeSkill ? SKILL_DATABASE[knight.activeSkill] : null;
            const canUseSkill = skill && partyMp >= skill.mpCost;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                {knight ? (
                  <>
                    {skill ? (
                      <button 
                        // ✨ 기사 객체(knight)를 함께 던져서 컷인에 얼굴이 나오게 합니다!
                        onClick={() => handleAction('SKILL', skill, knight)} 
                        disabled={!canUseSkill || isAnimating || battleResult || introStage !== 'done'}
                        className={`w-7 h-7 flex items-center justify-center transition-all ${canUseSkill ? 'active:scale-90 hover:brightness-110' : 'opacity-50 grayscale'}`}
                        style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                      >
                        <img src={skill.icon} alt="skill" className="w-full h-full object-contain drop-shadow-md" />
                      </button>
                    ) : (
                      <div className="w-7 h-7 bg-black/40 border border-[#3c2a1a]/30 rounded-md"></div>
                    )}
                    
                    <div className="w-full aspect-[1/2] bg-[#2a1a10] border border-[#5c3e23] rounded-sm overflow-hidden relative shadow-[0_5px_10px_rgba(0,0,0,0.8)]">
                      <img src={knight.image} alt={knight.name} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-7 h-7 bg-black/40 border border-[#3c2a1a]/30 rounded-md"></div>
                    <div className="w-full aspect-[1/2] bg-black/40 border border-[#3c2a1a]/30 rounded-sm flex items-center justify-center overflow-hidden">
                      <span className="text-[#3c2a1a] text-[8px] font-bold tracking-widest -rotate-90">EMPTY</span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="px-1">
          <button 
            onClick={() => handleAction('ATTACK')}
            disabled={isAnimating || battleResult || introStage !== 'done'}
            className={`w-full py-3 bg-gradient-to-b from-[#5c3e23] to-[#3a2618] border-[1.5px] border-[#a6845c] rounded-md shadow-[0_0_15px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all ${isAnimating || introStage !== 'done' ? 'opacity-50 grayscale' : 'active:scale-[0.98]'}`}
          >
            <span className="text-[#f5d5a9] font-serif font-black text-xl tracking-[0.3em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">Attack</span>
          </button>
        </div>

        <div className="w-full px-1 flex flex-col gap-1.5">
          <div className="w-full h-3.5 bg-black/80 border border-[#4a2c11] rounded-sm overflow-hidden relative">
            <div className="h-full bg-gradient-to-r from-green-900 to-green-500 transition-all duration-300" style={{ width: `${Math.max(0, (partyHp / partyStats.maxHp) * 100)}%` }}></div>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white drop-shadow-md tracking-wider">HP {partyHp} / {partyStats.maxHp}</span>
          </div>

          <div className="w-full h-2.5 bg-black/80 border border-[#2c3e50] rounded-sm overflow-hidden relative">
            <div className="h-full bg-gradient-to-r from-blue-900 to-blue-500 transition-all duration-300" style={{ width: `${Math.max(0, (partyMp / partyStats.maxMp) * 100)}%` }}></div>
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white drop-shadow-md tracking-wider">MP {partyMp} / {partyStats.maxMp}</span>
          </div>
        </div>

      </div>

      {/* 이탈 확인 팝업 UI */}
      {showExitPopup && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div 
            className="relative px-6 w-full max-w-[22rem] aspect-[1.3/1] flex flex-col items-center justify-center drop-shadow-[0_0_30px_rgba(0,0,0,1)]"
            style={{ 
              backgroundImage: "url('/popup-bg.png')",
              backgroundSize: '100% 100%', 
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/50 via-black/10 to-transparent pointer-events-none z-0 rounded-3xl"></div>

            <h3 className="text-xl font-black text-red-500 mb-2 drop-shadow-[0_2px_5px_rgba(0,0,0,1)] relative z-10">전투 이탈</h3>
            <p className="text-neutral-200 text-sm mb-5 leading-relaxed font-bold drop-shadow-[0_2px_5px_rgba(0,0,0,1)] relative z-10 text-center">
              정말 나가시겠습니까?<br/>
              진행 중인 보스 전투 기록이 <span className="text-red-400 font-black">사라집니다</span>.
            </p>
            
            <div className="flex justify-center items-center gap-1 w-full px-2 relative z-10">
              <button 
                onClick={onBack}
                className="w-24 transition-all duration-200 active:scale-95 hover:brightness-110 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] select-none"
                style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
              >
                <img src="/outkey.webp" alt="Confirm Exit" className="w-full h-auto object-contain pointer-events-none" draggable="false" />
              </button>
              
              <button 
                onClick={() => setShowExitPopup(false)}
                className="w-24 transition-all duration-200 active:scale-95 hover:brightness-110 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] select-none"
                style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
              >
                <img src="/continuekey.webp" alt="Cancel Exit" className="w-full h-auto object-contain pointer-events-none" draggable="false" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
