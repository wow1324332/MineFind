import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

import { DUNGEON_INFO } from '../constants/dungeonData'; 
import { RAID_BOSS_DATABASE } from '../constants/raidBossData';
import { KNIGHT_DATABASE } from '../constants/knightData';
import { EQUIP_DATABASE } from '../constants/equipData';
import { ITEM_DATABASE } from '../constants/itemData';
// ✨ 속성 상성을 계산하는 calculateEffectiveBP 추가!
import { calculatePartyStats, calculateEffectiveBP } from '../utils/combatUtils'; 

import BossBattle from './BossBattle';

export default function BossDungeon({ hp, onBack, onLogout, bossId }) {
  const dungeon = DUNGEON_INFO[bossId]; 
  const { user } = useAuth();

  // ✨ 1. 상세보기 팝업용 보스 ID (null이면 리스트, ID가 있으면 팝업)
  const [previewBossId, setPreviewBossId] = useState(null);
  
  // ✨ 2. 실제 전투 진입용 보스 ID
  const [battleBossId, setBattleBossId] = useState(null);

  // ✨ 3. 팝업에서 내 기사단 스펙을 보여주기 위한 상태
  const [partyData, setPartyData] = useState(null);

  // ==========================================
  // 🛡️ 유저 파티 스펙 실시간 로딩 (상성 계산용)
  // ==========================================
  useEffect(() => {
    if (!user) return;
    const fetchParty = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userLevel = userData.level || 1;

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

            if(dbData) {
              equipBonus.str += (dbData.baseStat?.str || 0) + ((growth.str || 0) * state.enhance);
              equipBonus.agi += (dbData.baseStat?.agi || 0) + ((growth.agi || 0) * state.enhance);
              equipBonus.int += (dbData.baseStat?.int || 0) + ((growth.int || 0) * state.enhance);
              equipBonus.vit += (dbData.baseStat?.vit || 0) + ((growth.vit || 0) * state.enhance);
              equipBonus.luk += (dbData.baseStat?.luk || 0) + ((growth.luk || 0) * state.enhance);
            }
          });

          let myPartyIds = userData.unlockedKnights || ['knight_main'];
          if (!myPartyIds.includes('knight_main')) myPartyIds = ['knight_main', ...myPartyIds];
          
          const activeKnights = [];
          myPartyIds.forEach((id, index) => {
            if (index < 6 && KNIGHT_DATABASE[id]) {
              const kDb = KNIGHT_DATABASE[id];
              const kLevel = id === 'knight_main' ? userLevel : (userData.knightStats?.[id]?.level || 1);
              const lvMultiplier = kLevel - 1;

              activeKnights.push({
                ...kDb,
                element: kDb.attribute, // calculateEffectiveBP가 참조할 속성
                str: kDb.baseStats.str + (kDb.statGrowth.str * lvMultiplier) + equipBonus.str,
                agi: kDb.baseStats.agi + (kDb.statGrowth.agi * lvMultiplier) + equipBonus.agi,
                int: kDb.baseStats.int + (kDb.statGrowth.int * lvMultiplier) + equipBonus.int,
                vit: kDb.baseStats.vit + (kDb.statGrowth.vit * lvMultiplier) + equipBonus.vit,
                luk: kDb.baseStats.luk + (kDb.statGrowth.luk * lvMultiplier) + equipBonus.luk,
              });
            }
          });

          const stats = calculatePartyStats(activeKnights);
          setPartyData({ knights: activeKnights, stats });
        }
      } catch (error) {
        console.error("파티 데이터 로딩 실패:", error);
      }
    };
    fetchParty();
  }, [user]);

  if (!dungeon) return null; // 🚨 방어 코드

  // ==========================================
  // 🔮 팝업 렌더링용 보스 정보 추출
  // ==========================================
  const pBoss = previewBossId ? RAID_BOSS_DATABASE[previewBossId] : null;
  
  // 💡 속성 상성이 완벽하게 반영된 내 기사단의 진짜 공격력!
  const myEffectiveAtk = pBoss && partyData 
    ? calculateEffectiveBP(partyData.knights, pBoss.attribute || pBoss.element || 'fire') 
    : 0;

  // 💡 임시 보상 데이터 (나중에 raidBossData.js에 rewards 추가하시면 자동으로 덮어씌워집니다)
  const previewRewards = pBoss?.rewards || { gold: 5000, exp: 1200, dropItems: ['con_soul_1'] };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-black text-white pt-6 px-4 select-none touch-manipulation">
      
      {/* 1️⃣ 배경 & 그라데이션 */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 z-0" style={{ backgroundImage: `url('${dungeon?.boardBg}')` }}></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_#000000_100%)] pointer-events-none z-0"></div>
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-0"></div>
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none z-0"></div>

      {/* 2️⃣ 상단 타이틀 */}
      <div className="w-full max-w-sm flex justify-center relative z-10 mb-2">
        <div className="w-full" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)' }}>
          <img src={dungeon?.titleImg} alt="Title" className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.5)] block" draggable="false" />
        </div>
      </div>

      {/* 3️⃣ 돌담 헤더 */}
      <div className="w-full max-w-sm h-12 flex justify-between items-center relative z-10 mb-4">
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-[100vw] h-24 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-none -z-10"></div>
        <div className="absolute top-0 w-[100vw] left-1/2 -translate-x-1/2 h-full bg-cover bg-center pointer-events-none -z-10" style={{ backgroundImage: "url('/header/header-bg.webp')", WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 60%, transparent 100%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 60%, transparent 100%)' }}>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <button onClick={onBack} className="transition-all duration-150 active:scale-90 px-2 outline-none" style={{ WebkitTapHighlightColor: 'transparent' }}>
          <img src="/header/backkey.webp" alt="Back" className="w-8 h-8 object-contain" draggable="false" />
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-[4px] z-20 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <img key={i} src="/header/hpball.webp" alt="HP" className={`w-[18px] h-[18px] object-contain ${i < hp ? 'opacity-100 drop-shadow-[0_0_5px_rgba(220,38,38,0.95)]' : 'opacity-20 grayscale saturate-50'}`} draggable="false" />
          ))}
        </div>
        <button onClick={onLogout} className="transition-all duration-150 active:scale-90 px-2 outline-none" style={{ WebkitTapHighlightColor: 'transparent' }}>
          <img src="/header/logout.webp" alt="Logout" className="w-8 h-8 object-contain" draggable="false" />
        </button>
      </div>

      {/* 4️⃣ 세부 보스 선택 리스트 */}
      <div 
        className="relative z-10 w-full max-w-sm flex-1 overflow-y-auto pb-10 space-y-4 px-2 pt-4" 
        style={{ 
          scrollbarWidth: 'none', msOverflowStyle: 'none', 
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)', 
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)' 
        }}
      >
        <style>{`::-webkit-scrollbar { display: none; }`}</style>
        
        {/* 🔥 단탈리온 버튼 */}
        <button 
          onClick={() => setPreviewBossId('dantalion')} // ✨ 전투 진입이 아닌 '팝업창 띄우기'로 변경!
          className="w-full relative group transition-all duration-200 active:scale-[0.98] select-none" 
          style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
        >
          <div className="relative w-full aspect-[4/1] bg-black/60 rounded-xl overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.8)] flex items-center justify-between px-4 border-[1px] border-red-900/30 group-hover:border-red-900/80">
            <div 
              className="absolute inset-0 bg-cover opacity-60 group-hover:opacity-90 transition-opacity duration-300" 
              style={{ backgroundImage: "url('/bossraid/raidboss-dantalion.webp')", backgroundPosition: "center 20%" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
            
            <div className="relative z-10 flex flex-col text-left">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest drop-shadow-md">Hell of Flame</span>
              <span className="text-xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] tracking-widest font-serif mt-0.5">Dantalion</span>
            </div>
            
            <div className="relative z-10 w-12 h-12 flex items-center justify-center drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
              <img src="/loading-icon.webp" alt="Enter" className="w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" draggable="false"/>
            </div>
          </div>
        </button>
      </div>

      {/* ========================================= */}
      {/* 📜 보스 스펙 및 보상 미리보기 팝업 */}
      {/* ========================================= */}
      {previewBossId && pBoss && partyData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-sm border-2 border-red-900/80 rounded-lg shadow-[0_10px_40px_rgba(220,38,38,0.3)] relative overflow-hidden flex flex-col">
            
            {/* 팝업 배경 */}
            <div className="absolute inset-0 bg-cover bg-center z-0 opacity-30" style={{ backgroundImage: "url('/yangpiji-bg.webp')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90 z-10"></div>
            
            <div className="relative z-20 flex flex-col p-5">
              
              <button onClick={() => setPreviewBossId(null)} className="absolute top-3 right-3 text-red-500/60 hover:text-red-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>

              <h2 className="text-center text-red-500 font-serif font-black text-lg tracking-[0.2em] uppercase mb-4 drop-shadow-md border-b border-red-900/50 pb-2">
                Boss Information
              </h2>

              {/* 보스 프로필 요약 */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-md border border-red-900 overflow-hidden shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                  <img src={pBoss.image} alt={pBoss.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="flex flex-col">
                  <span className="text-red-400 font-bold text-[10px] tracking-widest uppercase">{pBoss.attribute || 'Fire'} Element</span>
                  <span className="text-white font-serif font-black text-xl tracking-wider">{pBoss.name}</span>
                </div>
              </div>

              {/* ⚔️ 전투력 비교 섹션 (VS) */}
              <div className="bg-black/60 border border-[#a6845c]/30 rounded-md p-3 mb-4 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-red-900 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(220,38,38,0.8)] z-10">
                  <span className="text-white text-[9px] font-black italic">VS</span>
                </div>

                <div className="flex justify-between relative z-0">
                  
                  {/* 왼쪽: 내 기사단 */}
                  <div className="flex flex-col items-center w-[45%]">
                    <span className="text-[#d8b486] font-bold text-[10px] mb-2 tracking-widest">My Knights</span>
                    <div className="w-full flex justify-between px-1 mb-1">
                      <span className="text-neutral-400 text-[10px]">ATK (속성적용)</span>
                      <span className="text-yellow-400 font-black text-xs">{myEffectiveAtk.toLocaleString()}</span>
                    </div>
                    <div className="w-full flex justify-between px-1 mb-1">
                      <span className="text-neutral-400 text-[10px]">DEF</span>
                      <span className="text-neutral-200 font-black text-xs">{partyData.stats.defense.toLocaleString()}</span>
                    </div>
                    <div className="w-full flex justify-between px-1">
                      <span className="text-neutral-400 text-[10px]">HP</span>
                      <span className="text-green-400 font-black text-xs">{partyData.stats.maxHp.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* 오른쪽: 보스 */}
                  <div className="flex flex-col items-center w-[45%]">
                    <span className="text-red-400 font-bold text-[10px] mb-2 tracking-widest">Boss Stats</span>
                    <div className="w-full flex justify-between px-1 mb-1">
                      <span className="text-neutral-400 text-[10px]">ATK</span>
                      <span className="text-red-400 font-black text-xs">{pBoss.stats.atk || pBoss.stats.baseAttackPower || 50}</span>
                    </div>
                    <div className="w-full flex justify-between px-1 mb-1">
                      <span className="text-neutral-400 text-[10px]">DEF</span>
                      <span className="text-neutral-200 font-black text-xs">{pBoss.stats.def || pBoss.stats.defense || 20}</span>
                    </div>
                    <div className="w-full flex justify-between px-1">
                      <span className="text-neutral-400 text-[10px]">HP</span>
                      <span className="text-green-400 font-black text-xs">{pBoss.stats.maxHp.toLocaleString()}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* 🎁 예상 보상 섹션 */}
              <div className="bg-[#3a2210]/20 border border-[#8c6543]/40 rounded-md p-3 mb-6">
                <div className="text-center text-[#d8b486] font-bold text-[10px] tracking-widest mb-2 border-b border-[#8c6543]/30 pb-1">Expected Rewards</div>
                
                <div className="flex justify-around mb-3">
                  <div className="flex flex-col items-center">
                    <span className="text-[#f5d5a9] font-black text-sm">{previewRewards.gold.toLocaleString()}</span>
                    <span className="text-[#a6845c] text-[9px] uppercase">Gold</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-blue-400 font-black text-sm">{previewRewards.exp.toLocaleString()}</span>
                    <span className="text-[#a6845c] text-[9px] uppercase">EXP</span>
                  </div>
                </div>

                {/* 드랍 아이템 */}
                <div className="flex justify-center gap-2">
                  {previewRewards.dropItems.map((itemId, idx) => {
                    const item = ITEM_DATABASE[itemId];
                    if (!item) return null;
                    return (
                      <div key={idx} className="w-10 h-10 bg-black/60 rounded-sm border border-[#5c3e23] flex items-center justify-center p-1 relative group">
                        <img src={item.image || item.icon} alt={item.name} className="w-full h-full object-contain" />
                        <span className="absolute -top-6 text-[9px] text-[#f5d5a9] bg-black/90 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-[#8c6543]/50">
                          {item.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 버튼 그룹 */}
              <div className="flex gap-2">
                <button 
                  onClick={() => setPreviewBossId(null)}
                  className="w-1/3 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 font-bold text-xs py-3 rounded-sm transition-colors border border-neutral-700 shadow-md active:scale-95 uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setBattleBossId(previewBossId); // ✨ 팝업 닫고 진짜 전투로 진입!
                    setPreviewBossId(null);
                  }}
                  className="flex-1 bg-red-950 hover:bg-red-900 text-red-300 font-black text-sm py-3 rounded-sm transition-colors border border-red-700 shadow-[0_0_15px_rgba(220,38,38,0.5)] active:scale-95 uppercase tracking-widest"
                >
                  Challenge
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* ⚔️ Challenge 버튼 클릭 시 진짜 전투 화면 덮어씌우기 */}
      {/* ========================================= */}
      {battleBossId && (
        <BossBattle 
          bossId={battleBossId} 
          onBack={() => setBattleBossId(null)} // 뒤로가기 시 보스 목록으로 복귀
        />
      )}

    </div>
  );
}
