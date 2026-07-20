import React from 'react';

export default function ChallengeMode({ onSelectBossRaid, onSelectTowerRaid, onBack, onLogout, hp }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-black text-white pt-6 px-6 select-none">
      
      {/* 1️⃣ 배경: 챌린지 배경 이미지 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 z-0"
        style={{ backgroundImage: "url('/challenge/challenge-bg.webp')" }}
      ></div>

      {/* ========================================= */}
      {/* 💡 2️⃣ 딥 다크 그라데이션 5중 레이어 (화면 전체를 감싸는 비네팅) */}
      {/* ========================================= */}
      {/* 1. 중앙 방사형 비네팅 (기존 데빌마인과 동일하게 투명 반경 20% 적용) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_#000000_100%)] pointer-events-none z-0"></div>
      
      {/* 💡 2. 양옆(좌/우) 그라데이션 (새로 추가됨!) */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none z-0"></div>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/70 via-black/30 to-transparent pointer-events-none z-0"></div>

      {/* 3. 상단 그라데이션 */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-0"></div>
      
      {/* 4. 하단 그라데이션 */}
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none z-0"></div>
      {/* ========================================= */}

      {/* 상단 타이틀 이미지와 돌담 헤더 묶음 */}
      <div className="w-full flex flex-col items-center max-w-md relative z-10 -mt-6 shrink-0">
        
        {/* 1. 챌린지 타이틀 이미지 */}
        <div className="w-full max-w-sm mx-auto relative flex justify-center pointer-events-none mb-2">
          <div 
            className="w-full"
            style={{ 
              WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)'
            }}
          >
            <img 
              src="/challenge/challenge-title.webp" 
              alt="Challenge Title" 
              className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.2)]"
            />
          </div>
        </div>

        {/* 2. 돌담 헤더 */}
        <div className="w-full max-w-sm h-12 mb-12 flex justify-between items-center relative z-10">
          <div 
            className="absolute top-0 w-[100vw] left-1/2 -translate-x-1/2 h-full bg-cover bg-center pointer-events-none -z-10"
            style={{ 
              backgroundImage: "url('/header/header-bg.webp')",
              // 💡 헤더 하단이 배경과 훨씬 부드럽게 섞이도록 그라데이션 범위를(85% -> 60%) 조절했습니다!
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 60%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 60%, transparent 100%)'
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* 왼쪽 뒤로 가기 버튼 */}
          <button 
            onClick={onBack}
            className="transition-all duration-150 brightness-90 saturate-90 active:scale-90 active:brightness-75 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] px-2 select-none"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            <img src="/header/backkey.webp" alt="Back" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
          </button>

          {/* 체력(HP) 구슬 */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-[4px] drop-shadow-md z-20 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <img 
                key={i} 
                src="/header/hpball.webp" 
                alt="HP" 
                className={`w-[18px] h-[18px] object-contain transition-all duration-500 ${
                  i < hp 
                    ? 'opacity-100 drop-shadow-[0_0_5px_rgba(220,38,38,0.95)]' 
                    : 'opacity-20 grayscale saturate-50'
                }`} 
                draggable="false"
              />
            ))}
          </div>
          
          {/* 오른쪽 로그아웃 버튼 */}
          <button 
            onClick={onLogout}
            className="transition-all duration-150 brightness-90 saturate-90 active:scale-90 active:brightness-75 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] px-2 select-none"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            <img src="/header/logout.webp" alt="Logout" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
          </button>
        </div>
      </div>

      {/* 💡 챌린지 모드 선택 버튼 영역 */}
      <div className="relative z-10 w-full max-w-[18rem] space-y-4 -mt-4">
        
        {/* 1. 보스 레이드 (Boss Raid) 버튼 */}
        <button
          onClick={onSelectBossRaid}
          className="w-full transition-all duration-200 hover:brightness-110 active:scale-[0.96] drop-shadow-[0_4px_15px_rgba(220,100,0,0.3)] select-none relative z-20"
          style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
        >
          <img 
            src="/challenge/bossraid-bt.webp"
            alt="Boss Raid Mode" 
            className="w-full h-auto object-contain pointer-events-none" 
            draggable="false"
          />
        </button>

        {/* 2. 타워 레이드 (Tower Raid) 버튼 */}
        <button
          onClick={onSelectTowerRaid}
          className="w-full transition-all duration-200 hover:brightness-110 active:scale-[0.96] drop-shadow-[0_4px_15px_rgba(200,50,0,0.3)] select-none relative z-10"
          style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
        >
          <img 
            src="/challenge/towerraid-bt.webp"
            alt="Tower Raid Mode" 
            className="w-full h-auto object-contain pointer-events-none" 
            draggable="false"
          />
        </button>

      </div>
    </div>
  );
}
