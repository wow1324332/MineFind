import React from 'react';

// 💡 세 번째 버튼 동작을 위한 'onSelectChallenge' 속성을 추가했습니다.
export default function DevilMineMode({ onSelectPVE, onSelectChallenge, onBack, onLogout, hp }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-black text-white pt-6 px-6 select-none">
      
      {/* 배경: 고대 석판 이미지 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url('/devilminemode/devilmineloading-bg.webp')" }}
      ></div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_#000000_100%)] pointer-events-none"></div>

      {/* 상단 타이틀 이미지와 돌담 헤더 묶음 */}
      <div className="w-full flex flex-col items-center max-w-md relative z-10 -mt-6 shrink-0">
        
        {/* 1. 데빌마인 타이틀 이미지 */}
        <div className="w-full max-w-sm mx-auto relative flex justify-center pointer-events-none mb-2">
          <div 
            className="w-full"
            style={{ 
              WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)'
            }}
          >
            <img 
              src="/devilminemode/devilminemode-title.webp" 
              alt="Devil Mine Title" 
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
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
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

      {/* 💡 모드 선택 버튼 영역 (-space-y-4 간격 유지) */}
      <div className="relative z-10 w-full max-w-[14rem] -space-y-4">
        
        {/* 1. PVE 모드 (Hunting) */}
        <button
          onClick={onSelectPVE}
          className="w-full transition-all duration-200 hover:brightness-110 active:scale-[0.96] drop-shadow-[0_4px_15px_rgba(200,50,0,0.3)] select-none relative z-30"
          style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
        >
          <img 
            src="/devilminemode/hunting-bt.webp"
            alt="PVE Hunting Mode" 
            className="w-full h-auto object-contain pointer-events-none" 
            draggable="false"
          />
        </button>

        {/* 2. PVP 모드 (Battle - 준비중) */}
        <div className="w-full relative opacity-50 grayscale-[0.8] cursor-not-allowed select-none z-20">
          <img 
            src="/devilminemode/battle-bt.webp"
            alt="PVP Battle Mode (준비 중)" 
            className="w-full h-auto object-contain pointer-events-none drop-shadow-md" 
            draggable="false"
          />
        </div>

        {/* 💡 3. 신규 챌린지 모드 (Challenge) */}
        <button
          onClick={onSelectChallenge}
          className="w-full transition-all duration-200 hover:brightness-110 active:scale-[0.96] drop-shadow-[0_4px_15px_rgba(220,100,0,0.3)] select-none relative z-10"
          style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
        >
          <img 
            // 💡 파일명과 확장자가 실제 저장하신 이름과 같은지 확인해 주세요!
            src="/devilminemode/challenge-bt.webp" 
            alt="Challenge Mode" 
            className="w-full h-auto object-contain pointer-events-none" 
            draggable="false"
          />
        </button>

      </div>
    </div>
  );
}
