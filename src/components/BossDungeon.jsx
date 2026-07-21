import React from 'react';
import { DUNGEON_INFO } from '../constants/dungeonData'; 

export default function BossDungeon({ hp, onBack, onLogout, bossId }) {
  const dungeon = DUNGEON_INFO[bossId]; 

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-black text-white pt-6 px-4 select-none touch-manipulation">
      
      {/* 1️⃣ 배경 & 그라데이션 */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 z-0" style={{ backgroundImage: `url('${dungeon?.boardBg}')` }}></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_#000000_100%)] pointer-events-none z-0"></div>
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-0"></div>
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none z-0"></div>

      {/* 2️⃣ 상단 타이틀 */}
      <div className="w-full max-w-sm flex justify-center relative z-10 mb-2">
        <div className="w-full" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)' }}>
          <img src={dungeon?.titleImg} alt="Title" className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.5)] block" draggable="false" />
        </div>
      </div>

      {/* 3️⃣ 돌담 헤더 */}
      <div className="w-full max-w-sm h-12 flex justify-between items-center relative z-10 mb-4">
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-[100vw] h-24 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-none -z-10"></div>
        <div className="absolute top-0 w-[100vw] left-1/2 -translate-x-1/2 h-full bg-cover bg-center pointer-events-none -z-10" style={{ backgroundImage: "url('/header/header-bg.webp')", WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 60%, transparent 100%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 60%, transparent 100%)' }}>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <button onClick={onBack} className="transition-all duration-150 active:scale-90 px-2 outline-none" style={{ WebkitTapHighlightColor: 'transparent' }}>
          <img src="/header/backkey.webp" alt="Back" className="w-8 h-8 object-contain" draggable="false" />
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-[4px] z-20 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <img key={i} src="/header/hpball.webp" alt="HP" className={`w-[18px] h-[18px] object-contain ${i < hp ? 'opacity-100 drop-shadow-[0_0_5px_rgba(220,38,38,0.95)]' : 'opacity-20 grayscale saturate-50'}`} draggable="false" />
          ))}
        </div>
        <button onClick={onLogout} className="transition-all duration-150 active:scale-90 px-2 outline-none" style={{ WebkitTapHighlightColor: 'transparent' }}>
          <img src="/header/logout.webp" alt="Logout" className="w-8 h-8 object-contain" draggable="false" />
        </button>
      </div>

      {/* 4️⃣ 세부 보스 선택 리스트 (단탈리온 추가!) */}
      <div 
        className="relative z-10 w-full max-w-sm flex-1 overflow-y-auto pb-10 space-y-4 px-2 pt-4" 
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none', 
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)', 
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)' 
        }}
      >
        <style>{`::-webkit-scrollbar { display: none; }`}</style>
        
        {/* 🔥 단탈리온 버튼 */}
        <button 
          onClick={() => console.log('단탈리온 전투 진입 대기!')} 
          className="w-full relative group transition-all duration-200 active:scale-[0.98] select-none" 
          style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
        >
          <div className="relative w-full aspect-[4/1] bg-black/60 rounded-xl overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.8)] flex items-center justify-between px-4 border border-red-900/30">
            
            {/* 💡 핵심 포인트: backgroundPosition: "center 20%"로 이미지 상단의 얼굴과 뿔이 정확히 앵글에 잡히도록 크롭했습니다. */}
            <div 
              className="absolute inset-0 bg-cover opacity-60 group-hover:opacity-90 transition-opacity duration-300" 
              style={{ 
                backgroundImage: "url('/bossraid/raidboss-dantalion.webp')",
                backgroundPosition: "center 20%" 
              }}
            ></div>
            
            {/* 가독성을 위한 검은색 그라데이션 (왼쪽을 짙게) */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
            
            {/* 텍스트 영역 */}
            <div className="relative z-10 flex flex-col text-left">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest drop-shadow-md">Hell of Flame</span>
              <span className="text-xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] tracking-widest font-serif mt-0.5">단탈리온</span>
            </div>
            
            {/* 눈동자 로고 아이콘 */}
            <div className="relative z-10 w-12 h-12 flex items-center justify-center drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
              <img src="/loading-icon.webp" alt="Enter" className="w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" draggable="false"/>
            </div>

          </div>
        </button>

      </div>

    </div>
  );
}
