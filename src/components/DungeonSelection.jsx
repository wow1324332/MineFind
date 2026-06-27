import React from 'react';

export default function DungeonSelection({ onSelectDungeon, onBack }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black text-white p-6 select-none">
      
      {/* 💡 배경: 데빌마인 배경을 그대로 써서 통일감을 줍니다 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 grayscale-[0.5]"
        style={{ backgroundImage: "url('/devilmineloading-bg.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_#000000_100%)] pointer-events-none"></div>

      {/* 💡 상단 타이틀 이미지와 돌담 헤더 묶음 */}
      <div className="w-full flex flex-col items-center max-w-md relative z-10 -mt-6">
        
        {/* 1. 던전셀렉트 타이틀 이미지 */}
        <div className="w-full max-w-sm mt-0 mx-auto relative flex justify-center pointer-events-none">
          <div 
            className="w-full"
            style={{ 
              WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)'
            }}
          >
            <img 
              src="/dungeonselection-title.jpg" // 🚨 첨부해주신 확장자에 맞게(.jpg 또는 .png) 수정해주세요.
              alt="Dungeon Selection Title" 
              className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.2)]"
            />
          </div>
        </div>

        {/* 2. 돌담 헤더 */}
        <div className="w-full max-w-sm h-12 -mt-2 mb-6 flex justify-between items-center relative z-10">
          <div 
            className="absolute top-0 w-[100vw] left-1/2 -translate-x-1/2 h-full bg-cover bg-center pointer-events-none -z-10"
            style={{ 
              backgroundImage: "url('/header-bg.jpg')",
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
            <img src="/My-icon.png" alt="Back" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
          </button>
          
          {/* 오른쪽 로그아웃 버튼 */}
          <button 
            onClick={onLogout}
            className="transition-all duration-150 brightness-90 saturate-90 active:scale-90 active:brightness-75 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] px-2 select-none"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            <img src="/Logout-icon.png" alt="Logout" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
          </button>
        </div>
      </div>

      {/* 💡 던전 선택 버튼 영역 */}
      <div className="relative z-10 w-full max-w-xs space-y-6 mb-20">
        
        {/* 1. 불의 던전 버튼 */}
        <button
          onClick={() => onSelectDungeon('fire')}
          className="w-full bg-neutral-950/80 border border-red-900/60 hover:border-red-500 rounded-xl p-6 text-center transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)] active:scale-95 group"
          style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
        >
          <h2 className="text-2xl font-black tracking-widest text-red-500 group-hover:text-red-400">
            불의 던전
          </h2>
          <p className="text-xs text-neutral-400 mt-2 font-medium">타오르는 지옥의 불길 정화</p>
        </button>

        {/* 2. 물의 던전 버튼 */}
        <button
          onClick={() => onSelectDungeon('water')}
          className="w-full bg-neutral-950/80 border border-blue-900/60 hover:border-blue-500 rounded-xl p-6 text-center transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] active:scale-95 group"
          style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
        >
          <h2 className="text-2xl font-black tracking-widest text-blue-500 group-hover:text-blue-400">
            물의 던전
          </h2>
          <p className="text-xs text-neutral-400 mt-2 font-medium">심연의 차가운 늪지대 정화</p>
        </button>

      </div>
      <div></div>
    </div>
  );
}
