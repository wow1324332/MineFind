import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

import { RAID_BOSS_DATABASE } from '../constants/raidBossData';
import { KNIGHT_DATABASE } from '../constants/knightData';
// ✨ 전투 공식 모두 가져오기!
import { calculatePartyStats, calculateTurnDamage } from '../utils/combatUtils';

export default function BossBattle({ bossId = 'dantalion', onBack }) {
  const { user } = useAuth();

  const bossData = RAID_BOSS_DATABASE[bossId];
  const [bossHp, setBossHp] = useState(bossData?.stats?.maxHp || 100);

  const [partyKnights, setPartyKnights] = useState(Array(6).fill(null));
  const [partyStats, setPartyStats] = useState(null);
  const [partyHp, setPartyHp] = useState(0);
  const [partyMp, setPartyMp] = useState(0); // ✨ 마나는 0부터 시작!

  // ✨ 화면 가운데에 데미지를 보여줄 전투 로그
  const [combatLog, setCombatLog] = useState('전투 준비 완료! 보스를 공격하세요.');

  useEffect(() => {
    if (!user) return;
    const fetchBattleData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          
          let myPartyIds = data.unlockedKnights || ['knight_main'];
          if (!myPartyIds.includes('knight_main')) {
            myPartyIds = ['knight_main', ...myPartyIds];
          }
          
          // 💡 유저의 기사단 레벨 데이터 (없으면 1레벨 기준)
          const userKnightStats = data.knightStats || {};

          const slots = Array(6).fill(null);
          const activeKnights = [];

          myPartyIds.forEach((id, index) => {
            if (index < 6 && KNIGHT_DATABASE[id]) {
              const kDb = KNIGHT_DATABASE[id];
              const kLevel = userKnightStats[id]?.level || 1;
              const lvMultiplier = kLevel - 1;

              // ✨ 핵심: baseStats와 statGrowth를 레벨에 맞춰 합산! (이게 빠져서 HP가 0이었습니다)
              const flatKnight = {
                ...kDb,
                str: kDb.baseStats.str + (kDb.statGrowth.str * lvMultiplier),
                agi: kDb.baseStats.agi + (kDb.statGrowth.agi * lvMultiplier),
                int: kDb.baseStats.int + (kDb.statGrowth.int * lvMultiplier),
                vit: kDb.baseStats.vit + (kDb.statGrowth.vit * lvMultiplier),
                luk: kDb.baseStats.luk + (kDb.statGrowth.luk * lvMultiplier),
              };

              slots[index] = flatKnight; 
              activeKnights.push(flatKnight);
            }
          });

          setPartyKnights(slots);

          const stats = calculatePartyStats(activeKnights);
          setPartyStats(stats);
          setPartyHp(stats.maxHp);
          setPartyMp(0); // ✨ 마나는 무조건 0으로 텅 빈 채 시작
        }
      } catch (error) {
        console.error("전투 데이터 로딩 실패:", error);
      }
    };
    fetchBattleData();
  }, [user]);

  // ==========================================================
  // ⚔️ [Attack] 버튼을 눌렀을 때 실행되는 진짜 전투 로직!
  // ==========================================================
  const handleAttack = () => {
    if (bossHp <= 0 || partyHp <= 0) return; // 죽었으면 작동안함

    let logText = "";

    // 1️⃣ 아군의 턴 (기사단 -> 보스 공격)
    const knightAttack = calculateTurnDamage(partyStats, bossData.stats, true);
    let currentBossHp = bossHp - knightAttack.damage;
    
    logText += `⚔️ 기사단 공격! [${knightAttack.damage}] 데미지! ${knightAttack.isCrit ? '(크리티컬!)' : ''}\n`;

    // 보스가 죽었는지 체크
    if (currentBossHp <= 0) {
      setBossHp(0);
      setCombatLog(logText + `🎉 [${bossData.name}] 처치 완료! 승리했습니다!`);
      // 추후 여기에 승리 보상 로직 연동
      return;
    }
    setBossHp(currentBossHp);

    // 2️⃣ 보스의 턴 (보스 -> 기사단 반격)
    const bossAttack = calculateTurnDamage(bossData.stats, partyStats, false);
    let currentPartyHp = partyHp - bossAttack.damage;

    logText += `💀 보스의 반격! [${bossAttack.damage}] 피해를 입었습니다. ${bossAttack.isCrit ? '(치명상!)' : ''}`;

    // 기사단이 죽었는지 체크
    if (currentPartyHp <= 0) {
      setPartyHp(0);
      setCombatLog(logText + `\n☠️ 기사단 전멸... 패배했습니다.`);
      return;
    }
    setPartyHp(currentPartyHp);

    // 3️⃣ 턴 종료 후 마나 회복 (mpRegen 만큼 증가, 최대치 안 넘게)
    setPartyMp(prevMp => Math.min(partyStats.maxMp, prevMp + partyStats.mpRegen));
    
    // 로그 화면에 출력
    setCombatLog(logText);
  };

  if (!bossData || !partyStats) return <div className="fixed inset-0 bg-black z-50"></div>;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black select-none touch-manipulation">
      
      {/* 1️⃣ 배경: 보스 이미지 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 z-0" 
        style={{ backgroundImage: `url('${bossData.image}')` }}
      ></div>
      
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/90 via-black/40 to-transparent z-0 pointer-events-none"></div>
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent z-0 pointer-events-none"></div>

      {/* 👑 상단 영역: 실제 보스 체력바 & 스킬 */}
      <div className="relative z-10 w-full px-4 pt-8 flex flex-col items-center gap-2">
        <button onClick={onBack} className="absolute left-4 top-8 w-8 h-8 flex items-center justify-center bg-black/50 border border-neutral-700 rounded-full text-white active:scale-90 transition-all">
          ✕
        </button>

        <span className="text-red-500 font-black text-xl tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)] uppercase">
          {bossData.name}
        </span>
        
        {/* 실제 보스 HP 바 */}
        <div className="w-full max-w-sm h-4 bg-black/80 border-[1.5px] border-red-900/50 rounded-sm overflow-hidden relative shadow-[0_0_10px_rgba(220,38,38,0.3)]">
          <div 
            className="h-full bg-gradient-to-r from-red-900 to-red-500 transition-all duration-300"
            style={{ width: `${Math.max(0, (bossHp / bossData.stats.maxHp) * 100)}%` }}
          ></div>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
            {bossHp} / {bossData.stats.maxHp}
          </span>
        </div>

        <div className="flex gap-2 mt-1">
          <div className="w-8 h-8 bg-black/60 border border-red-900/50 rounded-md shadow-inner flex items-center justify-center">
            <span className="text-red-500 text-[10px] font-black">S1</span>
          </div>
        </div>
      </div>

      {/* 👁️ 중간 영역: 전투 로그 텍스트 박스 */}
      <div className="flex-1 w-full relative z-10 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm bg-black/50 border border-yellow-900/30 rounded-md p-3 text-center backdrop-blur-sm min-h-[60px] flex items-center justify-center">
          <p className="text-[#f5d5a9] text-xs font-bold whitespace-pre-line leading-relaxed drop-shadow-md">
            {combatLog}
          </p>
        </div>
      </div>

      {/* 🛡️ 하단 영역: 기사단 UI */}
      <div className="relative z-10 w-full px-2 pb-6 flex flex-col gap-3">
        
        {/* 1. 기사단 스킬 & 프로필 (6칸 고정) */}
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

        {/* 2. Attack (평타) 버튼 -> ✨ 전투 로직 연결 완료! */}
        <div className="px-1">
          <button 
            onClick={handleAttack}
            className="w-full py-3 bg-gradient-to-b from-[#5c3e23] to-[#3a2618] border-[1.5px] border-[#a6845c] rounded-md shadow-[0_0_15px_rgba(0,0,0,0.8)] flex items-center justify-center active:scale-[0.98] transition-all"
          >
            <span className="text-[#f5d5a9] font-serif font-black text-xl tracking-[0.3em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              Attack
            </span>
          </button>
        </div>

        {/* 3. 기사단 종합 HP & MP 바 */}
        <div className="w-full px-1 flex flex-col gap-1.5">
          <div className="w-full h-3.5 bg-black/80 border border-[#4a2c11] rounded-sm overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-green-900 to-green-500 transition-all duration-300"
              style={{ width: `${Math.max(0, (partyHp / partyStats.maxHp) * 100)}%` }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white drop-shadow-md tracking-wider">
              HP {partyHp} / {partyStats.maxHp}
            </span>
          </div>

          <div className="w-full h-2.5 bg-black/80 border border-[#2c3e50] rounded-sm overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-blue-900 to-blue-500 transition-all duration-300"
              style={{ width: `${Math.max(0, (partyMp / partyStats.maxMp) * 100)}%` }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white drop-shadow-md tracking-wider">
              MP {partyMp} / {partyStats.maxMp}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
