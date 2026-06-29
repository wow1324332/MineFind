import React, { useState } from 'react';

export default function DungeonSelection({ onSelectDungeon, onBack, onLogout }) {
  // 💡 난이도 상태 추가 (기본값: Normal)
  const [difficulty, setDifficulty] = useState('Normal');
  const difficulties = ['Easy', 'Normal', 'Hard', 'Expert', 'Hell'];

  // 던전 입장 버튼 클릭 시 
  const handleDungeonClick = (dungeonId) => {
    // 💡 선택된 난이도 문자열을 두 번째 인자로 넘깁니다.
    onSelectDungeon(dungeonId, difficulty); 
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black text-white p-6 pb-24 select-none">
      
      {/* 배경 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 grayscale-[0.5]"
        style={{ backgroundImage: "url('/devilmineloading-bg.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_#000000_100%)] pointer-events-none"></div>

      {/* 상단 타이틀 및 돌담 헤더 묶음 */}
      <div className="w-full flex flex-col items-center max-w-md relative z-10 -mt-6">
        {/* ... (기존 타이틀 이미지 코드 그대로 유지) ... */}
        <div className="w-full max-w-sm mt-0 mx-auto relative flex justify-center pointer-events-none">
          <div style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)' }}>
            <img src="/dungeonselection-title.jpg" alt="Title" className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.2)]" />
          </div>
        </div>

        {/* 2. 돌담 헤더 */}
        <div className="w-full max-w-sm h-12 -mt-2 mb-6 flex justify-between items-center relative z-10">
          <div className="absolute top-0 w-[100vw] left-1/2 -translate-x-1/2 h-full bg-cover bg-center pointer-events-none -z-10" style={{ backgroundImage: "url('/header-bg.jpg')", WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)' }}>
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <button onClick={onBack} className="transition-all duration-150 brightness-90 saturate-90 active:scale-90 active:brightness-75 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] px-2" style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}>
            <img src="/My-icon.png" alt="Back" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
          </button>
          <button onClick={onLogout} className="transition-all duration-150 brightness-90 saturate-90 active:scale-90 active:brightness-75 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] px-2" style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}>
            <img src="/Logout-icon.png" alt="Logout" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
          </button>
        </div>
      </div>

      {/* 던전 선택 버튼 영역 (onClick 수정) */}
      <div className="relative z-10 w-full max-w-xs -space-y-3 mt-6 mb-auto">
        <button
          onClick={() => handleDungeonClick('fire')} // 수정됨
          className="w-full transition-all duration-200 hover:brightness-110 active:scale-[0.96] drop-shadow-[0_4px_15px_rgba(220,38,38,0.3)] select-none"
          style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
        >
          <img src="/hellofflame-bt.png" alt="Hell of Flame" className="w-full h-auto object-contain pointer-events-none" draggable="false" />
        </button>

        <button
          onClick={() => handleDungeonClick('water')} // 수정됨
          className="w-full transition-all duration-200 hover:brightness-110 active:scale-[0.96] drop-shadow-[0_4px_15px_rgba(37,99,235,0.3)] select-none"
          style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
        >
          <img src="/hellofaqua-bt.png" alt="Hell of Aqua" className="w-full h-auto object-contain pointer-events-none" draggable="false" />
        </button>
      </div>

      {/* 💡 최하단: 난이도 선택 버튼 UI (5개 나란히) */}
      <div className="absolute bottom-6 w-full px-6 z-20">
        <div className="flex justify-between items-center max-w-md mx-auto gap-1">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`
                flex-1 py-3 px-1 text-center font-black tracking-tighter sm:tracking-normal text-[11px] sm:text-xs transition-all duration-200 border
                ${difficulty === diff 
                  ? 'bg-neutral-800 border-yellow-500/50 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)] scale-105 rounded-md' 
                  : 'bg-neutral-950/80 border-neutral-800 text-neutral-500 hover:bg-neutral-900 rounded-sm'
                }
              `}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>
      
    </div>
  );
}
