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

export default function BossDungeon({ hp, onBack, onLogout, bossId, onSelectBattle }) {
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

          let myPartyIds = userData.unlockedKnights || ['knight_main'];
          if (!myPartyIds.includes('knight_main')) myPartyIds = ['knight_main', ...myPartyIds];
          
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

              activeKnights.push({
                ...kDb,
                element: kDb.attribute, 
                str: kDb.baseStats.str + (kDb.statGrowth.str * lvMultiplier) + finalEquipBonus.str,
                agi: kDb.baseStats.agi + (kDb.statGrowth.agi * lvMultiplier) + finalEquipBonus.agi,
                int: kDb.baseStats.int + (kDb.statGrowth.int * lvMultiplier) + finalEquipBonus.int,
                vit: kDb.baseStats.vit + (kDb.statGrowth.vit * lvMultiplier) + finalEquipBonus.vit,
                luk: kDb.baseStats.luk + (kDb.statGrowth.luk * lvMultiplier) + finalEquipBonus.luk,
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
  
  // 💡 전투 공식에 따른 기사단 최소/최대 데미지 계산 (90% ~ 110%)
  const minAtk = Math.floor(myEffectiveAtk * 0.9).toLocaleString();
  const maxAtk = Math.floor(myEffectiveAtk * 1.1).toLocaleString();

  // 💡 드랍 아이템이 비어있을 경우를 대비해 4종류의 기본 보상 세팅
  const previewRewards = pBoss?.rewards || { 
    gold: 5000, 
    exp: 1200, 
    dropItems: ['con_soul_1', 'con_soul_2', 'potion_exp_fire_small', 'potion_exp_fire_medium'] 
  };

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

      {/* 세부 보스 선택 리스트 (원본 디자인 100% 복구 + 동적 필터링) */}
      <div 
        className="relative z-10 w-full max-w-sm flex-1 overflow-y-auto pb-10 space-y-4 px-2 pt-4" 
        style={{ 
          scrollbarWidth: 'none', msOverflowStyle: 'none', 
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)', 
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)' 
        }}
      >
        <style>{`::-webkit-scrollbar { display: none; }`}</style>
        
        {/* 💡 선택된 던전 속성과 일치하는 보스만 렌더링 */}
        {Object.values(RAID_BOSS_DATABASE)
          .filter(boss => boss.element === bossId)
          .map(boss => {
            // 💡 테두리 등 맘대로 넣은 거 다 빼고 원본 색상만 유지합니다
            const textColor = {
              fire: 'text-red-500', water: 'text-blue-500', ice: 'text-cyan-400',
              poison: 'text-green-500', cure: 'text-emerald-400', vain: 'text-purple-500', light: 'text-yellow-500'
            }[boss.element] || 'text-gray-400';

            return (
              <button 
                key={boss.id}
                onClick={() => setPreviewBossId(boss.id)} 
                className="w-full relative group transition-all duration-200 active:scale-[0.98] select-none" 
                style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
              >
                {/* 💡 원장님이 만드셨던 원본 그대로의 태그 (border 뺐습니다!) */}
                <div className="relative w-full aspect-[4/1] bg-black/60 rounded-xl overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.8)] flex items-center justify-between px-4">
                  <div 
                    className="absolute inset-0 bg-cover opacity-60 group-hover:opacity-90 transition-opacity duration-300" 
                    style={{ backgroundImage: `url('${boss.image}')`, backgroundPosition: "center 20%" }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
                  
                  <div className="relative z-10 flex flex-col text-left">
                    {/* 던전 영문 이름 */}
                    <span className={`text-[10px] font-bold ${textColor} uppercase tracking-widest drop-shadow-md`}>
                      {DUNGEON_INFO[bossId]?.name}
                    </span>
                    {/* 보스 영문 이름 (원래 쓰시던 것처럼 앞글자만 대문자로 예쁘게) */}
                    <span className="text-xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] tracking-widest font-serif mt-0.5">
                      {boss.id.charAt(0).toUpperCase() + boss.id.slice(1)}
                    </span>
                  </div>
                  
                  <div className="relative z-10 w-12 h-12 flex items-center justify-center drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                    <img src="/loading-icon.webp" alt="Enter" className="w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" draggable="false"/>
                  </div>
                </div>
              </button>
            );
          })
        }

        {/* 업데이트 준비중 문구 */}
        {Object.values(RAID_BOSS_DATABASE).filter(boss => boss.element === bossId).length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 opacity-60">
            <svg className="w-8 h-8 text-[#a6845c] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            <span className="text-[#a6845c] text-xs font-black tracking-widest">강력한 악마가 부화 중입니다...</span>
          </div>
        )}
      </div>

      {/* ========================================= */}
      {/* 📜 심플 & 세련된 레이드 프리뷰 모달 (수정 완료) */}
      {/* ========================================= */}
      {previewBossId && pBoss && partyData && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]" // 💡 배경 딤 처리 약하게 (bg-black/40)
          onClick={() => setPreviewBossId(null)} // 바깥 영역 터치 시 닫기
        >
          <style>{`
            @keyframes modalBreathe {
              0%, 100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.05), 0 10px 40px rgba(0, 0, 0, 1); }
              50% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.25), 0 10px 40px rgba(0, 0, 0, 1); }
            }
          `}</style>
          
          <div 
            className="w-full max-w-[260px] bg-[#0a0705] relative overflow-hidden flex flex-col rounded-sm" 
            onClick={(e) => e.stopPropagation()} 
            style={{ animation: 'modalBreathe 3s ease-in-out infinite' }} // 💡 하얀 숨쉬기 애니메이션 적용
          >
            
            {/* 1. 보스 크롭 배너 영역 */}
            <div className="relative w-full h-24 bg-black flex items-end"> {/* 💡 바닥 정렬(items-end) 적용 */}
              <div 
                className="absolute inset-0 bg-cover opacity-100" // 💡 이미지 어두운 현상 개선 (opacity-100)
                style={{ 
                  backgroundImage: `url('${pBoss.image}')`, 
                  backgroundPosition: 'right 20%', // 우측 얼굴 위주로 크롭
                  backgroundSize: '150%' 
                }}
              />
              {/* 💡 하단부 그라데이션만 남겨 이미지를 훨씬 밝고 또렷하게 표시 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
              
              {/* 2. 보스 영문 이름 (좌측 하단 빈 공간) */}
              <div className="relative z-10 px-3 pb-2 w-full">
                <span className="text-[#f5d5a9] font-serif font-black text-[15px] tracking-[0.2em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                  {pBoss.id || pBoss.name} {/* 💡 BOSS 텍스트 제거 및 폰트 축소 */}
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
                    <span className="text-[#d8b486]">ATK {minAtk}~{maxAtk}</span> {/* 💡 데미지 범위 표기 */}
                    <span className="text-green-500/80">HP {partyData.stats.maxHp.toLocaleString()}</span>
                  </div>
                </div>

                {/* 보스 스탯 */}
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

                {/* 5. 아이템 아이콘 일렬 나열 */}
                {previewRewards.dropItems && previewRewards.dropItems.length > 0 && (
                  <div className="flex justify-center gap-1.5">
                    {previewRewards.dropItems.map((itemObj, idx) => {
                      // 💡 배열의 값이 객체이든 문자열이든 유연하게 처리
                      const itemId = typeof itemObj === 'string' ? itemObj : (itemObj.id || itemObj.itemId);
                      const item = ITEM_DATABASE[itemId];
                      if (!item) return null; 
                      
                      const isImageFile = item.image || (item.icon && item.icon.startsWith('/'));
                      const imgSrc = item.image || item.icon;

                      return (
                        <div key={idx} className="w-7 h-7 bg-black/80 rounded-sm border border-[#5c3e23]/30 flex items-center justify-center p-0.5">
                          {isImageFile ? (
                            <img src={imgSrc} alt={item.name} className="w-full h-full object-contain opacity-90 drop-shadow-md" draggable="false" />
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
                  onSelectBattle(previewBossId); 
                  setPreviewBossId(null);
                }}
                className="mt-2 w-full bg-[#110a08] hover:bg-red-950/40 text-red-500/70 font-serif font-black text-[10px] py-2.5 rounded-sm transition-colors shadow-inner active:scale-95 uppercase tracking-[0.3em]" // 💡 테두리(border) 제거
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
