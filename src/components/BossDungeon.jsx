import React from 'react';
import { BOSS_DUNGEON_INFO } from '../constants/dungeonData'; // 기존 파일에서 불러옴

export default function BossDungeon({ hp, onBack, onLogout, bossId }) {
  const dungeon = BOSS_DUNGEON_INFO[bossId]; 

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
        <button onClick={onBack} className="transition-all duration-150 active:scale-90 px-2 outline-none">
          <img src="/header/backkey.webp" alt="Back" className="w-8 h-8 object-contain" draggable="false" />
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-[4px] z-20 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <img key={i} src="/header/hpball.webp" alt="HP" className={`w-[18px] h-[18px] object-contain ${i < hp ? 'opacity-100 drop-shadow-[0_0_5px_rgba(220,38,38,0.95)]' : 'opacity-20 grayscale saturate-50'}`} draggable="false" />
          ))}
        </div>
        <button onClick={onLogout} className="transition-all duration-150 active:scale-90 px-2 outline-none">
          <img src="/header/logout.webp" alt="Logout" className="w-8 h-8 object-contain" draggable="false" />
        </button>
      </div>

      {/* 추후 보스 리스트가 들어갈 빈 껍데기 공간 */}
      <div className="relative z-10 w-full max-w-sm flex-1 flex items-center justify-center">
        <span className="text-white/20 tracking-widest font-serif text-sm">보스 리스트 대기중...</span>
      </div>

    </div>
  );
}
