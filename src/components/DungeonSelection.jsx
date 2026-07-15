import React, { useState } from 'react';
// 💡 방금 만든 설정 파일에서 데이터 불러오기!
import { DUNGEON_INFO, DIFFICULTIES } from '../constants/dungeonData';

export default function DungeonSelection({ onSelectDungeon, onBack, onLogout, hp }) {
  const [difficulty, setDifficulty] = useState('Normal');

  const handleDungeonClick = (dungeonId) => {
    onSelectDungeon(dungeonId, difficulty); 
  };

  return (
    // 💡 pb-24를 지우고 pb-6으로 변경, overflow-hidden 추가
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black text-white pt-6 pb-6 select-none overflow-hidden">
      
      {/* 배경 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 grayscale-[0.5]"
        style={{ backgroundImage: "url('/devilminemode/devilmineloading-bg.webp')" }}
      ></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_#000000_100%)] pointer-events-none"></div>

      {/* 💡 상단 타이틀 및 돌담 헤더 묶음 (shrink-0으로 화면이 작아져도 찌그러짐 방지) */}
      <div className="w-full flex flex-col items-center max-w-md relative z-10 -mt-6 shrink-0 px-6">
        <div className="w-full max-w-sm mt-0 mx-auto relative flex justify-center pointer-events-none">
          <div style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)' }}>
            <img src="/dungeonselection/dungeonselection-title.webp" alt="Title" className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.2)]" />
          </div>
        </div>

        {/* 돌담 헤더 */}
        <div className="w-full max-w-sm h-12 -mt-2 mb-2 flex justify-between items-center relative z-10">
          <div className="absolute top-0 w-[100vw] left-1/2 -translate-x-1/2 h-full bg-cover bg-center pointer-events-none -z-10" style={{ backgroundImage: "url('/header/header-bg.webp')", WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)' }}>
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <button onClick={onBack} className="transition-all duration-150 brightness-90 saturate-90 active:scale-90 active:brightness-75 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] px-2" style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}>
            <img src="/header/backkey.webp" alt="Back" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
          </button>

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
          
          <button onClick={onLogout} className="transition-all duration-150 brightness-90 saturate-90 active:scale-90 active:brightness-75 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] px-2" style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}>
            <img src="/header/logout.webp" alt="Logout" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
          </button>
        </div>
      </div>

      {/* 💡 중앙: 던전 선택 버튼 영역 (flex-1 min-h-0을 통해 이곳만 스크롤되도록 설정!) */}
      <div 
        className="relative z-10 w-full max-w-xs -space-y-3 mt-2 flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col items-center pb-8 px-2"
        style={{ 
          WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)', 
          maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' 
        }}
      >
        {Object.values(DUNGEON_INFO).map((dungeon) => {
          let shadowClass = 'drop-shadow-[0_4px_15px_rgba(37,99,235,0.3)]'; 
          if (dungeon.id === 'fire') shadowClass = 'drop-shadow-[0_4px_15px_rgba(220,38,38,0.3)]'; 
          if (dungeon.id === 'poison') shadowClass = 'drop-shadow-[0_4px_15px_rgba(34,197,94,0.3)]'; 
          if (dungeon.id === 'light') shadowClass = 'drop-shadow-[0_4px_15px_rgba(234,179,8,0.3)]'; 

          return (
            <button
              key={dungeon.id}
              onClick={() => handleDungeonClick(dungeon.id)} 
              // 💡 shrink-0을 추가해 버튼 자체가 납작하게 찌그러지는 것 방지
              className={`w-full shrink-0 transition-all duration-200 hover:brightness-110 active:scale-[0.96] select-none ${shadowClass}`}
              style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
            >
              <img src={dungeon.buttonImg} alt={dungeon.name} className="w-full h-auto object-contain pointer-events-none" draggable="false" />
            </button>
          );
        })}
      </div>

      {/* 💡 최하단: 난이도 선택 버튼 UI (absolute를 풀고 shrink-0으로 바닥에 강제 고정시킴) */}
      <div className="w-full px-6 z-20 shrink-0 relative mt-2">
        <div className="flex justify-between items-center max-w-md mx-auto gap-2">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`
                flex-1 transition-all duration-300 relative select-none
                ${difficulty === diff 
                  ? 'scale-110 brightness-110 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)] z-10' 
                  : 'scale-95 brightness-50 opacity-60 hover:brightness-75 hover:opacity-100'
                }
              `}
              style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
            >
              <img 
                src={`/dungeons/${diff.toLowerCase()}.webp`} 
                alt={`${diff} Difficulty`} 
                className="w-full h-auto object-contain pointer-events-none"
                draggable="false"
              />
            </button>
          ))}
        </div>
      </div>
      
    </div>
  );
}
