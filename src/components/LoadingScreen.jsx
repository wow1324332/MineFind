import React from 'react';

// 💡 로딩 화면만 전담하여 관리하는 컴포넌트입니다.
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
          
          <div className="text-white/90 font-serif font-black text-center tracking-[0.2em] leading-loose drop-shadow-[0_2px_10px_rgba(0,0,0,1)] text-base sm:text-base mb-10">
            악마성에 도전하고<br/>더 높은 곳을 향해 나아가리라...
          </div>

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
  // 2️⃣ 던전 선택(헌팅) 진입 로딩 (새로 추가!)
  // =========================================
  if (type === 'DUNGEON_SELECT_LOADING') {
    return (
      <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-black select-none animate-[fadeInSmooth_0.5s_ease-in-out]">
        {/* 💡 기존 헌팅 로딩용 배경 이미지 사용 */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/dungeonselection/dungeonselectionloading-bg.webp')" }}
        ></div>
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_#000000_100%)] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-6">
          {/* 동일한 애니메이션 스타일을 사용하지만 클래스로 이미 주입되었으므로 재사용됩니다 */}
          <style>{`
            @keyframes mysticBreathe {
              0%, 100% { transform: scale(1); opacity: 0.5; filter: drop-shadow(0 0 5px rgba(255,255,255,0.2)); }
              50% { transform: scale(1.15); opacity: 1; filter: drop-shadow(0 0 25px rgba(255,255,255,0.9)); }
            }
          `}</style>

          {/* 💡 사냥에 어울리는 명조체 문구 */}
          <div className="text-white/90 font-serif font-black text-center tracking-[0.2em] leading-loose drop-shadow-[0_2px_10px_rgba(0,0,0,1)] text-base sm:text-base mb-10">
            악의 던전이 움직인다,<br/>기사들이여 악을 정화하라...
          </div>

          <img 
            src="/loading-icon.webp" 
            alt="Hunting Mystic Logo" 
            className="w-28 h-auto object-contain"
            style={{ animation: 'mysticBreathe 2.5s ease-in-out infinite' }}
            draggable="false"
          />
        </div>
      </div>
    );
  }

  // 조건에 안 맞으면 빈 화면 반환 (안전 장치)
  return null;
}
