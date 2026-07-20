import React from 'react';
// 💡 던전 데이터를 가져오기 위해 import 추가!
import { DUNGEON_INFO } from '../constants/dungeonData'; 

export default function LoadingScreen({ type, dungeonId }) {

  // =========================================
  // 💡 보스 레이드 진입 로딩 (새로 추가)
  // =========================================
  if (type === 'BOSS_RAID_LOADING') {
    return (
      <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-black select-none animate-[fadeInSmooth_0.5s_ease-in-out]">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/bossraid/bossraid-bg.webp')" }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_#000000_100%)] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-6">
          <style>{`
            @keyframes mysticBreathe {
              0%, 100% { transform: scale(1); opacity: 0.5; filter: drop-shadow(0 0 5px rgba(255,255,255,0.2)); }
              50% { transform: scale(1.15); opacity: 1; filter: drop-shadow(0 0 25px rgba(255,255,255,0.9)); }
            }
          `}</style>
          
          <div className="text-red-500/90 font-serif font-black text-center tracking-[0.2em] leading-loose drop-shadow-[0_2px_10px_rgba(220,38,38,0.8)] text-base sm:text-lg mb-10">
            태고의 악이 깨어났다...<br/>대악마를 마주하고 저지하라.
          </div>

          <img 
            src="/loading-icon.webp" 
            alt="Boss Raid Logo" 
            className="w-28 h-auto object-contain"
            style={{ animation: 'mysticBreathe 2.5s ease-in-out infinite' }}
            draggable="false"
          />
        </div>
      </div>
    );
  }
  
  // =========================================
  // 1️⃣ 챌린지 모드 진입 로딩
  // =========================================
  if (type === 'CHALLENGE_LOADING') {
    return (
      <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-black select-none animate-[fadeInSmooth_0.5s_ease-in-out]">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/challenge/challenge-bg.webp')" }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_#000000_100%)] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-6">
          <style>{`
            @keyframes mysticBreathe {
              0%, 100% { transform: scale(1); opacity: 0.5; filter: drop-shadow(0 0 5px rgba(255,255,255,0.2)); }
              50% { transform: scale(1.15); opacity: 1; filter: drop-shadow(0 0 25px rgba(255,255,255,0.9)); }
            }
          `}</style>
          <div className="text-white/90 font-serif font-black text-center tracking-[0.2em] leading-loose drop-shadow-[0_2px_10px_rgba(0,0,0,1)] text-base sm:text-base mb-10">
            악마성에 도전하고<br/>더 높은 곳을 향해 나아가라
          </div>
          <img src="/loading-icon.webp" alt="Challenge Logo" className="w-28 h-auto object-contain" style={{ animation: 'mysticBreathe 2.5s ease-in-out infinite' }} draggable="false"/>
        </div>
      </div>
    );
  }

  // =========================================
  // 2️⃣ 던전 선택(헌팅) 진입 로딩
  // =========================================
  if (type === 'DUNGEON_SELECT_LOADING') {
    return (
      <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-black select-none animate-[fadeInSmooth_0.5s_ease-in-out]">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/dungeonselection/dungeonselectionloading-bg.webp')" }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_#000000_100%)] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-6">
          <style>{`
            @keyframes mysticBreathe {
              0%, 100% { transform: scale(1); opacity: 0.5; filter: drop-shadow(0 0 5px rgba(255,255,255,0.2)); }
              50% { transform: scale(1.15); opacity: 1; filter: drop-shadow(0 0 25px rgba(255,255,255,0.9)); }
            }
          `}</style>
          <div className="text-white/90 font-serif font-black text-center tracking-[0.2em] leading-loose drop-shadow-[0_2px_10px_rgba(0,0,0,1)] text-base sm:text-base mb-10">
            악마왕들의 던전이 깨어났다,<br/>성스러운 기사들이여!!<br/>악을 정화하고<br/>승리를 쟁취하라..
          </div>
          <img src="/loading-icon.webp" alt="Hunting Logo" className="w-28 h-auto object-contain" style={{ animation: 'mysticBreathe 2.5s ease-in-out infinite' }} draggable="false"/>
        </div>
      </div>
    );
  }

  // =========================================
  // 3️⃣ 개별 던전 입장 로딩 (✨ 핵심 구현부)
  // =========================================
  if (type === 'DUNGEON_LOADING') {
    // 💡 넘어온 던전 ID(예: 'fire', 'ice')를 바탕으로 던전 정보를 꺼내옵니다.
    const dungeon = DUNGEON_INFO[dungeonId];

    return (
      <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-black select-none animate-[fadeInSmooth_0.5s_ease-in-out]">
        
        {/* 💡 배경 이미지: dungeonData.js에 있는 loadingBg 사용! */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30" 
          style={{ backgroundImage: `url('${dungeon?.loadingBg || '/dungeonselection/dungeonselectionloading-bg.webp'}')` }}
        ></div>
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_#000000_100%)] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-6">
          <style>{`
            @keyframes mysticBreathe {
              0%, 100% { transform: scale(1); opacity: 0.5; filter: drop-shadow(0 0 5px rgba(255,255,255,0.2)); }
              50% { transform: scale(1.15); opacity: 1; filter: drop-shadow(0 0 25px rgba(255,255,255,0.9)); }
            }
          `}</style>
          
          {/* 💡 로딩 문구: dungeonData.js에 있는 loadingMsg 사용! (줄바꿈 허용) */}
          <div 
            className="text-white/90 font-serif font-black text-center tracking-[0.2em] leading-loose drop-shadow-[0_2px_10px_rgba(0,0,0,1)] text-base sm:text-base mb-10 whitespace-pre-line"
          >
            {dungeon?.loadingMsg || "미지의 구역으로 진입 중..."}
          </div>

          {/* 💡 눈동자 로고는 그대로 사용! */}
          <img 
            src="/loading-icon.webp" 
            alt="Dungeon Enter Logo" 
            className="w-28 h-auto object-contain" 
            style={{ animation: 'mysticBreathe 2.5s ease-in-out infinite' }} 
            draggable="false"
          />
        </div>
      </div>
    );
  }

  return null;
}
