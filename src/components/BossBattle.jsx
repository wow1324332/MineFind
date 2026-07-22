import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

import { RAID_BOSS_DATABASE } from '../constants/raidBossData';
import { KNIGHT_DATABASE } from '../constants/knightData';
import { calculatePartyStats } from '../utils/combatUtils';

export default function BossBattle({ bossId = 'dantalion', onBack }) {
  const { user } = useAuth();

  const bossData = RAID_BOSS_DATABASE[bossId];
  const [bossHp, setBossHp] = useState(bossData?.stats?.maxHp || 100);

  const [partyKnights, setPartyKnights] = useState(Array(6).fill(null));
  const [partyStats, setPartyStats] = useState(null);
  const [partyHp, setPartyHp] = useState(0);
  const [partyMp, setPartyMp] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchBattleData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          
          // 💡 수정 완료: 'party' 대신 실제 파이어베이스 필드명인 'unlockedKnights' 사용
          let myPartyIds = data.unlockedKnights || ['knight_main'];
          if (!myPartyIds.includes('knight_main')) {
            myPartyIds = ['knight_main', ...myPartyIds];
          }
          
          const slots = Array(6).fill(null);
          const activeKnights = [];

          myPartyIds.forEach((id, index) => {
            if (index < 6 && KNIGHT_DATABASE[id]) {
              const knightObj = KNIGHT_DATABASE[id];
              slots[index] = knightObj; 
              activeKnights.push(knightObj);
            }
          });

          setPartyKnights(slots);

          const stats = calculatePartyStats(activeKnights);
          setPartyStats(stats);
          setPartyHp(stats.maxHp);
          setPartyMp(stats.maxMp);
        }
      } catch (error) {
        console.error("전투 데이터 로딩 실패:", error);
      }
    };
    fetchBattleData();
  }, [user]);

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

      {/* ========================================= */}
      {/* 👑 상단 영역: 실제 보스 체력바 & 스킬 */}
      {/* ========================================= */}
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

      {/* 👁️ 중간 영역 (시야 확보) */}
      <div className="flex-1 w-full relative z-10"></div>

      {/* ========================================= */}
      {/* 🛡️ 하단 영역: 기사단 UI */}
      {/* ========================================= */}
      <div className="relative z-10 w-full px-2 pb-6 flex flex-col gap-3">
        
        {/* 1. 기사단 스킬 & 프로필 (6칸 고정) */}
        <div className="w-full flex justify-between gap-1 px-1">
          {partyKnights.map((knight, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              
              {knight ? (
                /* ✨ 기사가 배치된 자리 */
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
                /* 💀 빈 자리 비활성 처리 */
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

        {/* 2. Attack (평타) 버튼 */}
        <div className="px-1">
          <button 
            onClick={() => console.log('전투 로직 실행!')}
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
