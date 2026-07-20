import React from 'react';

// 💡 로딩 화면만 전담하여 관리하는 컴포넌트입니다.
// type(어떤 화면인지), dungeonId(어떤 던전인지) 등의 정보를 App.jsx로부터 받아와서 알맞은 화면을 띄워줍니다.
export default function LoadingScreen({ type, dungeonId }) {
  
  // =========================================
  // 1️⃣ 챌린지 모드 진입 로딩
  // =========================================
  if (type === 'CHALLENGE_LOADING') {
    return (
      <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-black select-none animate-[fadeInSmooth_0.5s_ease-in-out]">
        
        {/* 희미한 챌린지 배경 */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/challenge/challenge-bg.webp')" }}
        ></div>
        
        {/* 딥 다크 비네팅 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_#000000_100%)] pointer-events-none"></div>

{/* 중앙 컨텐츠 (서사 문구 & 로고) */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-6">
          <style>{`
            @keyframes mysticBreathe {
              0%, 100% { transform: scale(1); opacity: 0.5; filter: drop-shadow(0 0 5px rgba(255,255,255,0.2)); }
              50% { transform: scale(1.15); opacity: 1; filter: drop-shadow(0 0 25px rgba(255,255,255,0.9)); }
            }
          `}</style>
          
          {/* 1. 서사적인 명조체 문구 (위로 배치 및 아래 간격 mb-10 추가) */}
          <div className="text-white/90 font-serif font-black text-center tracking-[0.2em] leading-loose drop-shadow-[0_2px_10px_rgba(0,0,0,1)] text-base sm:text-base mb-10">
            악마성에 도전하고<br/>더 높은 곳을 향해 나아가리라...
          </div>

          {/* 2. 첨부해주신 로고 (크기를 w-36 -> w-28로 줄이고 아래로 배치) */}
          <img 
            src="/loading-icon.webp" 
            alt="Challenge Mystic Logo" 
            className="w-28 h-auto object-contain"
            style={{ animation: 'mysticBreathe 2.5s ease-in-out infinite' }}
            draggable="false"
          />
        </div>
      </div>
    );
  }

  // =========================================
  // 💡 2️⃣ 나중에 여기에 던전별 로딩을 추가하시면 됩니다!
  // =========================================
  /*
  if (type === 'DUNGEON_LOADING') {
     if (dungeonId === 'fire') return <FireDungeonLoading />;
     if (dungeonId === 'ice') return <IceDungeonLoading />;
     // ...
  }
  */

  // 조건에 안 맞으면 빈 화면 반환 (안전 장치)
  return null;
}
