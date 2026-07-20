import React from 'react';
import { DUNGEON_INFO } from '../constants/dungeonData'; // 💡 7대 던전 정보를 불러옵니다.

export default function BossRaid({ hp, onBack, onLogout, onSelectBoss }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-black text-white pt-6 px-6 select-none">
      
      {/* 1️⃣ 배경: 보스 레이드 배경 이미지 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 z-0"
        style={{ backgroundImage: "url('/bossraid/bossraid-bg.webp')" }}
      ></div>

      {/* ========================================= */}
      {/* 💡 2️⃣ 딥 다크 그라데이션 레이어 */}
      {/* ========================================= */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_#000000_100%)] pointer-events-none z-0"></div>
      
      {/* 양옆 엣지 그라데이션 */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none z-0"></div>
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/80 via-black/40 to-transparent pointer-events-none z-0"></div>

      {/* 상단/하단 그라데이션 */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-0"></div>
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none z-0"></div>
      {/* ========================================= */}

      {/* 상단 타이틀 이미지와 돌담 헤더 묶음 */}
      <div className="w-full flex flex-col items-center max-w-md relative z-10 -mt-6 shrink-0">
        
        {/* 1. 보스 레이드 타이틀 이미지 */}
        <div className="w-full max-w-sm mx-auto relative flex justify-center pointer-events-none mb-2">
          <div 
            className="w-full"
            style={{ 
              WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)'
            }}
          >
            <img 
              src="/bossraid/bossraid-title.webp" 
              alt="Boss Raid Title" 
              className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.2)]"
            />
          </div>
        </div>

        {/* 2. 돌담 헤더 */}
        <div className="w-full max-w-sm h-12 mb-6 flex justify-between items-center relative z-10">
          {/* 헤더 하단 짙은 그림자 */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-[100vw] h-24 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-none -z-10"></div>

          <div 
            className="absolute top-0 w-[100vw] left-1/2 -translate-x-1/2 h-full bg-cover bg-center pointer-events-none -z-10"
            style={{ 
              backgroundImage: "url('/header/header-bg.webp')",
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 60%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 60%, transparent 100%)'
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          <button 
            onClick={onBack}
            className="transition-all duration-150 brightness-90 saturate-90 active:scale-90 active:brightness-75 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] px-2 select-none"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            <img src="/header/backkey.webp" alt="Back" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-[4px] drop-shadow-md z-20 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <img 
                key={i} 
                src="/header/hpball.webp" 
                alt="HP" 
                className={`w-[18px] h-[18px] object-contain transition-all duration-500 ${
                  i < hp ? 'opacity-100 drop-shadow-[0_0_5px_rgba(220,38,38,0.95)]' : 'opacity-20 grayscale saturate-50'
                }`} 
                draggable="false"
              />
            ))}
          </div>
          
          <button 
            onClick={onLogout}
            className="transition-all duration-150 brightness-90 saturate-90 active:scale-90 active:brightness-75 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] px-2 select-none"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            <img src="/header/logout.webp" alt="Logout" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
          </button>
        </div>
      </div>

      {/* 💡 7대 던전 버튼 리스트 영역 (상하단 강력한 페이드아웃 효과 적용) */}
      <div 
        className="relative z-10 w-full max-w-sm flex-1 overflow-y-auto pb-10 space-y-4 px-2 pt-4" 
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          // 💡 핵심: 리스트의 상단 15%, 하단 15% 영역의 버튼을 스르륵 투명하게 날려버립니다!
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
        }}
      >
        <style>{`::-webkit-scrollbar { display: none; }`}</style>
        
        {Object.entries(DUNGEON_INFO).map(([id, info]) => (
          <button
            key={id}
            onClick={() => onSelectBoss(id)}
            className="w-full relative group transition-all duration-200 active:scale-[0.98] select-none"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            {/* 💡 변경점 1: border 클래스를 완전히 제거했습니다! */}
            <div className="relative w-full aspect-[4/1] bg-black/60 rounded-xl overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.8)] flex items-center justify-between px-4">
              
              {/* 던전 배경 희미하게 깔기 */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity group-hover:opacity-60 transition-opacity"
                style={{ backgroundImage: `url('${info.loadingBg}')` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

              {/* 속성 텍스트 및 이름 */}
              <div className="relative z-10 flex flex-col text-left">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{info.element || id}</span>
                <span className="text-lg font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] tracking-widest font-serif">{info.name || `${id} Boss`}</span>
              </div>

              {/* 💡 변경점 2: ⚔️ 이모지 대신 눈동자 로고 이미지로 변경! */}
              <div className="relative z-10 w-12 h-12 flex items-center justify-center drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                <img 
                  src="/loading-icon.webp" 
                  alt="Enter Boss Raid" 
                  className="w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                  draggable="false"
                />
              </div>

            </div>
          </button>
        ))}
      </div>

    </div>
  );
}
