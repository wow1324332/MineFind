import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

import { DUNGEON_INFO } from '../constants/dungeonData'; 
import { RAID_BOSS_DATABASE } from '../constants/raidBossData';
import { KNIGHT_DATABASE } from '../constants/knightData';
import { EQUIP_DATABASE } from '../constants/equipData';
import { ITEM_DATABASE } from '../constants/itemData';
import { calculatePartyStats, calculateEffectiveBP } from '../utils/combatUtils'; 

import BossBattle from './BossBattle';

export default function BossDungeon({ hp, onBack, onLogout, bossId }) {
  const dungeon = DUNGEON_INFO[bossId]; 
  const { user } = useAuth();

  const [previewBossId, setPreviewBossId] = useState(null);
  const [battleBossId, setBattleBossId] = useState(null);
  const [partyData, setPartyData] = useState(null);

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
                element: kDb.attribute, 
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

  if (!dungeon) return null; 

  const pBoss = previewBossId ? RAID_BOSS_DATABASE[previewBossId] : null;
  const myEffectiveAtk = pBoss && partyData ? calculateEffectiveBP(partyData.knights, pBoss.attribute || pBoss.element || 'fire') : 0;
  const previewRewards = pBoss?.rewards || { gold: 5000, exp: 1200, dropItems: ['con_soul_1'] };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-black text-white pt-6 px-4 select-none touch-manipulation">
      
      {/* 배경 & 그라데이션 */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 z-0" style={{ backgroundImage: `url('${dungeon?.boardBg}')` }}></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_#000000_100%)] pointer-events-none z-0"></div>
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-0"></div>
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none z-0"></div>

      {/* 상단 타이틀 */}
      <div className="w-full max-w-sm flex justify-center relative z-10 mb-2">
        <div className="w-full" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)' }}>
          <img src={dungeon?.titleImg} alt="Title" className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.5)] block" draggable="false" />
        </div>
      </div>

      {/* 돌담 헤더 */}
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

      {/* 세부 보스 선택 리스트 */}
      <div 
        className="relative z-10 w-full max-w-sm flex-1 overflow-y-auto pb-10 space-y-4 px-2 pt-4" 
        style={{ 
          scrollbarWidth: 'none', msOverflowStyle: 'none', 
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)', 
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)' 
        }}
      >
        <style>{`::-webkit-scrollbar { display: none; }`}</style>
        
        {/* 단탈리온 버튼 */}
        <button 
          onClick={() => setPreviewBossId('dantalion')} 
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
      {/* 📜 심플 & 세련된 레이드 프리뷰 모달 (리뉴얼) */}
      {/* ========================================= */}
      {previewBossId && pBoss && partyData && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setPreviewBossId(null)} // 💡 바깥 영역 터치 시 닫기
        >
          {/* 테두리 없는 미니멀한 컨테이너 (너비 260px 정도로 작게) */}
          <div 
            className="w-full max-w-[260px] bg-[#0a0705] shadow-[0_10px_50px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col rounded-sm" 
            onClick={(e) => e.stopPropagation()} // 💡 내부 터치 시 안 닫히게 방어
          >
            
            {/* 1. 보스 크롭 배너 영역 (우측 치우침) */}
            <div className="relative w-full h-24 bg-black flex items-center">
              <div 
                className="absolute inset-0 bg-cover opacity-80"
                style={{ 
                  backgroundImage: `url('${pBoss.image}')`, 
                  backgroundPosition: 'right 20%', // 💡 우측 얼굴 위주로 크롭
                  backgroundSize: '150%' // 💡 줌인 효과
                }}
              />
              {/* 좌측 여백을 확보하기 위한 강력한 그라데이션 */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
              
              {/* 2. 보스 영문 이름 (좌측 빈 공간) */}
              <div className="relative z-10 px-5 flex flex-col">
                <span className="text-red-500/80 font-bold text-[8px] tracking-[0.3em] uppercase mb-0.5">
                  Boss
                </span>
                <span className="text-[#f5d5a9] font-serif font-black text-lg tracking-[0.2em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                  {pBoss.id || pBoss.name}
                </span>
              </div>
            </div>

            {/* 본문 컨텐츠 영역 */}
            <div className="px-5 py-4 flex flex-col gap-4 bg-gradient-to-b from-[#0a0705] to-black">
              
              {/* 3. 스탯 한 줄 나열 (ATK / HP) */}
              <div className="flex flex-col gap-2.5">
                
                {/* 기사단 스탯 */}
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                  <span className="text-[#a6845c] text-[9px] font-bold tracking-widest uppercase">Knights</span>
                  <div className="flex gap-3 text-[10px] font-black tracking-wider">
                    <span className="text-[#d8b486]">ATK {myEffectiveAtk.toLocaleString()}</span>
                    <span className="text-green-500/80">HP {partyData.stats.maxHp.toLocaleString()}</span>
                  </div>
                </div>

                {/* 보스 스탯 (데미지 범위 지원) */}
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                  <span className="text-red-600/80 text-[9px] font-bold tracking-widest uppercase">Boss</span>
                  <div className="flex gap-3 text-[10px] font-black tracking-wider">
                    <span className="text-red-400">
                      DMG {pBoss.stats.minAtk && pBoss.stats.maxAtk ? `${pBoss.stats.minAtk}~${pBoss.stats.maxAtk}` : (pBoss.stats.atk || 50)}
                    </span>
                    <span className="text-red-500/80">HP {(pBoss.stats.maxHp).toLocaleString()}</span>
                  </div>
                </div>

              </div>

              {/* 4. 보상 (골드/경험치/아이템) */}
              <div className="flex flex-col gap-3 mt-1">
                
                {/* 골드 & 경험치 한 줄 */}
                <div className="flex items-center justify-center gap-4 bg-black/40 rounded-sm py-1.5 border border-white/5">
                   <div className="flex items-center gap-1.5">
                     <span className="text-yellow-500/90 font-black text-[11px]">{previewRewards.gold.toLocaleString()}</span>
                     <span className="text-[#a6845c] text-[8px] tracking-widest uppercase">Gold</span>
                   </div>
                   <div className="w-[1px] h-2.5 bg-white/10"></div>
                   <div className="flex items-center gap-1.5">
                     <span className="text-blue-400/90 font-black text-[11px]">{previewRewards.exp.toLocaleString()}</span>
                     <span className="text-[#a6845c] text-[8px] tracking-widest uppercase">Exp</span>
                   </div>
                </div>

                {/* 5. 아이템 아이콘 일렬 나열 (이모지 완벽 지원) */}
                {previewRewards.dropItems && previewRewards.dropItems.length > 0 && (
                  <div className="flex justify-center gap-1.5">
                    {previewRewards.dropItems.map((itemId, idx) => {
                      const item = ITEM_DATABASE[itemId];
                      if (!item) return null; 
                      
                      // 이미지 파일이 있으면 이미지, 없으면 icon(이모지) 렌더링
                      const isImageFile = item.image || (item.icon && item.icon.startsWith('/'));
                      const imgSrc = item.image || item.icon;

                      return (
                        <div key={idx} className="w-7 h-7 bg-black/80 rounded-sm border border-[#5c3e23]/30 flex items-center justify-center p-0.5">
                          {isImageFile ? (
                            <img src={imgSrc} alt={item.name} className="w-full h-full object-contain opacity-90 drop-shadow-md" />
                          ) : (
                            <span className="text-[13px] drop-shadow-md">{item.icon || '❓'}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 6. 심플한 챌린지 버튼 */}
              <button 
                onClick={() => {
                  setBattleBossId(previewBossId); 
                  setPreviewBossId(null);
                }}
                className="mt-2 w-full bg-[#110a08] hover:bg-red-950/40 text-red-500/70 font-serif font-black text-[10px] py-2.5 rounded-sm transition-colors border border-red-900/30 shadow-inner active:scale-95 uppercase tracking-[0.3em]"
              >
                Challenge
              </button>

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
          onBack={() => setBattleBossId(null)} 
        />
      )}

    </div>
  );
}
