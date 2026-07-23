import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

import { RAID_BOSS_DATABASE } from '../constants/raidBossData';
import { KNIGHT_DATABASE } from '../constants/knightData';
import { EQUIP_DATABASE } from '../constants/equipData'; 
import { calculatePartyStats, calculateTurnDamage } from '../utils/combatUtils';

export default function BossBattle({ bossId = 'dantalion', onBack }) {
  const { user } = useAuth();

  const bossData = RAID_BOSS_DATABASE[bossId];
  const [bossHp, setBossHp] = useState(bossData?.stats?.maxHp || 100);

  const [partyKnights, setPartyKnights] = useState(Array(6).fill(null));
  const [partyStats, setPartyStats] = useState(null);
  const [partyHp, setPartyHp] = useState(0);
  const [partyMp, setPartyMp] = useState(0);

  // ✨ 1. 인트로 애니메이션 상태
  const [introStage, setIntroStage] = useState('loading'); 

  // ✨ 2. 전투 이펙트 상태
  const [isAnimating, setIsAnimating] = useState(false); 
  const [bossEffect, setBossEffect] = useState(null);    
  const [partyEffect, setPartyEffect] = useState(null);  
  const [battleResult, setBattleResult] = useState(null); 

  // 🎬 데이터 로딩 후 인트로 타이머 실행
  useEffect(() => {
    if (partyStats && bossData) {
      setIntroStage('text'); 
      setTimeout(() => setIntroStage('slash'), 800);  
      setTimeout(() => setIntroStage('split'), 950);  
      setTimeout(() => setIntroStage('done'), 1500);  
    }
  }, [partyStats, bossData]);

  // 📊 파이어베이스 데이터 세팅
  useEffect(() => {
    if (!user) return;
    const fetchBattleData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userLevel = userData.level || 1; 
          const userNickname = userData.nickname || user.displayName || '무명의 용사';

          const defaultEquip = { tier: 0, element: 'neutral', enhance: 0 };
          const userEquipment = userData.equipment || {
            WEAPON: { ...defaultEquip }, HELMET: { ...defaultEquip },
            SHIELD: { ...defaultEquip }, ARMOR: { ...defaultEquip }
          };

          let equipBonus = { str: 0, agi: 0, int: 0, vit: 0, luk: 0 };

          ['WEAPON', 'HELMET', 'SHIELD', 'ARMOR'].forEach(part => {
            const state = userEquipment[part] || defaultEquip;
            const equipKey = `tier_${state.tier}_${state.element || 'neutral'}`;
            const dbData = EQUIP_DATABASE[part]?.evolutions[equipKey] || EQUIP_DATABASE[part]?.evolutions['tier_0_neutral'];
            const growth = EQUIP_DATABASE[part]?.enhanceGrowth || { str:0, agi:0, int:0, vit:0, luk:0 };

            if(dbData && dbData.baseStat) {
              equipBonus.str += (dbData.baseStat.str || 0) + ((growth.str || 0) * state.enhance);
              equipBonus.agi += (dbData.baseStat.agi || 0) + ((growth.agi || 0) * state.enhance);
              equipBonus.int += (dbData.baseStat.int || 0) + ((growth.int || 0) * state.enhance);
              equipBonus.vit += (dbData.baseStat.vit || 0) + ((growth.vit || 0) * state.enhance);
              equipBonus.luk += (dbData.baseStat.luk || 0) + ((growth.luk || 0) * state.enhance);
            }
          });

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

              const flatKnight = {
                id,
                name: id === 'knight_main' ? userNickname : kDb.name,
                image: kDb.image,
                str: kDb.baseStats.str + (kDb.statGrowth.str * lvMultiplier) + equipBonus.str,
                agi: kDb.baseStats.agi + (kDb.statGrowth.agi * lvMultiplier) + equipBonus.agi,
                int: kDb.baseStats.int + (kDb.statGrowth.int * lvMultiplier) + equipBonus.int,
                vit: kDb.baseStats.vit + (kDb.statGrowth.vit * lvMultiplier) + equipBonus.vit,
                luk: kDb.baseStats.luk + (kDb.statGrowth.luk * lvMultiplier) + equipBonus.luk,
              };

              slots[index] = flatKnight; 
              activeKnights.push(flatKnight);
            }
          });

          setPartyKnights(slots);

          const stats = calculatePartyStats(activeKnights);
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
  // ⚔️ [완벽한 턴제] 기사단 타격 -> 1초 딜레이 -> 보스 반격
  // ==========================================================
  const handleAttack = () => {
    // 인트로 중이거나 전투 종료 시 클릭 방지
    if (bossHp <= 0 || partyHp <= 0 || isAnimating || battleResult || introStage !== 'done') return; 
    setIsAnimating(true); 

    const knightAttack = calculateTurnDamage(partyStats, bossData.stats, true);
    let currentBossHp = Math.max(0, bossHp - knightAttack.damage);
    
    setBossEffect({
      damage: knightAttack.damage,
      isCrit: knightAttack.isCrit,
      isMiss: knightAttack.isMiss,
      id: Date.now() 
    });
    setBossHp(currentBossHp);

    setTimeout(() => {
      setBossEffect(null); 

      if (currentBossHp <= 0) {
        setBattleResult('win');
        setIsAnimating(false);
        return;
      }

      const bossAttack = calculateTurnDamage(bossData.stats, partyStats, false);
      let currentPartyHp = Math.max(0, partyHp - bossAttack.damage);

      setPartyEffect({
        damage: bossAttack.damage,
        isCrit: bossAttack.isCrit,
        isMiss: bossAttack.isMiss,
        id: Date.now()
      });
      setPartyHp(currentPartyHp);

      setTimeout(() => {
        setPartyEffect(null);

        if (currentPartyHp <= 0) {
          setBattleResult('lose');
        } else {
          setPartyMp(prevMp => Math.min(partyStats.maxMp, prevMp + partyStats.mpRegen));
        }
        setIsAnimating(false); 
      }, 1000);

    }, 1000);
  };

  if (!bossData) return <div className="fixed inset-0 bg-black z-50 flex items-center justify-center text-red-500 font-bold">보스 데이터 로딩 실패 ({bossId})</div>;
  if (!partyStats) return <div className="fixed inset-0 bg-black z-50"></div>; // 부드러운 검은 화면 대기

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black select-none touch-manipulation overflow-hidden">
      
      {/* ⚔️ 통합 애니메이션 스타일 (인트로 + 배틀 타격) */}
      <style>{`
        /* 인트로 애니메이션 */
        @keyframes textPunch { 0% { transform: scale(2.5); opacity: 0; filter: blur(5px); } 40% { transform: scale(0.9); opacity: 1; filter: blur(0); } 60% { transform: scale(1.05); } 100% { transform: scale(1); } }
        @keyframes flash { 0% { opacity: 0; } 30% { opacity: 1; } 100% { opacity: 0; } }
        .split-top { clip-path: polygon(0 0, 100% 0, 100% 45%, 0 55%); transition: transform 0.5s cubic-bezier(0.5, 0, 0.2, 1), opacity 0.5s; }
        .split-bottom { clip-path: polygon(0 55%, 100% 45%, 100% 100%, 0 100%); transition: transform 0.5s cubic-bezier(0.5, 0, 0.2, 1), opacity 0.5s; }
        .slash-line { position: absolute; top: 50%; left: -10%; width: 120%; height: 3px; background: #fff; box-shadow: 0 0 15px #fff, 0 0 30px #dc2626; transform: rotate(-5deg) scaleX(0); transform-origin: left center; opacity: 0; transition: transform 0.15s ease-out, opacity 0.15s; }
        .slash-line.active { transform: rotate(-5deg) scaleX(1); opacity: 1; }
        .slash-line.fade { opacity: 0; transform: rotate(-5deg) scaleX(1) scaleY(10); transition: transform 0.3s ease-out, opacity 0.3s ease-out; }
        
        /* 타격 애니메이션 */
        @keyframes floatUpDamage { 0% { transform: translateY(0) scale(0.5); opacity: 0; } 20% { transform: translateY(-20px) scale(1.3); opacity: 1; } 40% { transform: translateY(-30px) scale(1); opacity: 1; } 100% { transform: translateY(-70px) scale(1); opacity: 0; } }
        @keyframes slashHit { 0% { transform: rotate(-15deg) scaleX(0); opacity: 1; } 50% { transform: rotate(-15deg) scaleX(1); opacity: 1; } 100% { transform: rotate(-15deg) scaleX(1.5) scaleY(4); opacity: 0; } }
        @keyframes shakeHit { 0%, 100% { transform: translate(0, 0); } 20% { transform: translate(-8px, 6px); } 40% { transform: translate(6px, -8px); } 60% { transform: translate(-6px, -6px); } 80% { transform: translate(8px, 8px); } }
      `}</style>

      {/* 🎬 1. BATTLE START 사선 인트로 */}
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

      {/* 🏆 전투 종료 팝업 */}
      {battleResult && (
        <div className="absolute inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center animate-[fadeIn_0.5s_ease-out]">
          <span className={`font-serif font-black text-5xl tracking-widest uppercase drop-shadow-[0_0_20px_rgba(0,0,0,1)] ${battleResult === 'win' ? 'text-yellow-400' : 'text-red-600'}`}>
            {battleResult === 'win' ? 'VICTORY' : 'DEFEATED'}
          </span>
          <button onClick={onBack} className="mt-10 px-8 py-3 bg-[#110a08] text-[#f5d5a9] border border-[#a6845c] rounded-md font-serif font-bold tracking-widest active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
            RETURN
          </button>
        </div>
      )}

      {/* 배경: 보스 이미지 */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 z-0" style={{ backgroundImage: `url('${bossData.image}')` }}></div>
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/90 via-black/40 to-transparent z-0 pointer-events-none"></div>
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent z-0 pointer-events-none"></div>

      {/* 👑 상단: 보스 영역 (타격 시 화면 흔들림 효과) */}
      <div className={`relative z-10 w-full px-4 pt-8 flex flex-col items-center gap-2 ${bossEffect ? 'animate-[shakeHit_0.3s_ease-in-out]' : ''}`}>
        <button onClick={onBack} className="absolute left-4 top-8 w-8 h-8 flex items-center justify-center bg-black/50 border border-neutral-700 rounded-full text-white active:scale-90 transition-all">✕</button>
        <span className="text-red-500 font-black text-xl tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)] uppercase">{bossData.name}</span>
        
        <div className="w-full max-w-sm h-4 bg-black/80 border-[1.5px] border-red-900/50 rounded-sm overflow-hidden relative shadow-[0_0_10px_rgba(220,38,38,0.3)]">
          <div className="h-full bg-gradient-to-r from-red-900 to-red-500 transition-all duration-300" style={{ width: `${Math.max(0, (bossHp / bossData.stats.maxHp) * 100)}%` }}></div>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">{bossHp} / {bossData.stats.maxHp}</span>
        </div>

        {/* 💥 보스 피격 사선 & 데미지 팝업 */}
        {bossEffect && (
          <div key={`boss-${bossEffect.id}`} className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 translate-y-16">
            {!bossEffect.isMiss && <div className="absolute w-[150%] h-3 bg-white rounded-full shadow-[0_0_20px_#fff,0_0_40px_#ef4444] animate-[slashHit_0.3s_ease-out_forwards]"></div>}
            <span className={`absolute font-black italic tracking-wider animate-[floatUpDamage_1s_ease-out_forwards] ${bossEffect.isMiss ? 'text-gray-400 text-4xl' : (bossEffect.isCrit ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,1)] text-6xl' : 'text-white drop-shadow-[0_0_10px_rgba(220,38,38,1)] text-5xl')}`}>
              {bossEffect.isMiss ? 'MISS' : bossEffect.damage}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 w-full relative z-10 flex flex-col items-center justify-center px-4"></div>

      {/* 🛡️ 하단: 기사단 영역 (타격 시 화면 흔들림 효과) */}
      <div className={`relative z-10 w-full px-2 pb-6 flex flex-col gap-3 ${partyEffect ? 'animate-[shakeHit_0.3s_ease-in-out]' : ''}`}>
        
        {/* 💥 기사단 피격 사선 & 데미지 팝업 */}
        {partyEffect && (
          <div key={`party-${partyEffect.id}`} className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 -translate-y-24">
            {!partyEffect.isMiss && <div className="absolute w-[120%] h-3 bg-red-600 rounded-full shadow-[0_0_20px_#ef4444,0_0_40px_#991b1b] animate-[slashHit_0.3s_ease-out_forwards]"></div>}
            <span className={`absolute font-black italic tracking-wider animate-[floatUpDamage_1s_ease-out_forwards] ${partyEffect.isMiss ? 'text-gray-400 text-4xl' : (partyEffect.isCrit ? 'text-orange-500 drop-shadow-[0_0_15px_rgba(234,179,8,1)] text-6xl' : 'text-red-500 drop-shadow-[0_0_10px_rgba(0,0,0,1)] text-5xl')}`}>
              {partyEffect.isMiss ? 'MISS' : partyEffect.damage}
            </span>
          </div>
        )}

        <div className="w-full flex justify-between gap-1 px-1">
          {partyKnights.map((knight, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              {knight ? (
                <>
                  <button className="w-7 h-7 bg-[#1a1008]/80 border border-[#a6845c]/50 rounded-md shadow-inner flex items-center justify-center active:scale-95 transition-all">
                    <span className="text-[#f5d5a9] text-[9px] font-bold">S</span>
                  </button>
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
          ))}
        </div>

        <div className="px-1">
          <button 
            onClick={handleAttack}
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
    </div>
  );
}
