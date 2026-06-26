import React from 'react';

// 💡 컴포넌트 이름이 지뢰찾기 전용임을 명확히 합니다.
export default function DevilMineMode({ onSelectPVE, onBack }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black text-white p-6 select-none">
      
      {/* 배경: 고대 석판 이미지 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url('/devilmineloading-bg.jpg')" }}
      ></div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_#000000_100%)] pointer-events-none"></div>

      {/* 상단 네비게이션 헤더 */}
      <div className="relative z-10 w-full max-w-sm flex items-center justify-between mt-12">
        <button 
          onClick={onBack}
          className="text-xs font-bold text-neutral-400 bg-neutral-900/80 border border-neutral-800 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
        >
          ← Hunt List
        </button>
        <div className="text-right">
          <h1 className="text-xl font-black tracking-widest text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">DEVIL MINE</h1>
          <p className="text-[10px] text-neutral-400 tracking-wider">전투 유형 선택</p>
        </div>
      </div>

      {/* 모드 선택 버튼 영역 */}
      <div className="relative z-10 w-full max-w-xs space-y-4 mb-20">
        
        <button
          onClick={onSelectPVE}
          className="w-full bg-black/80 border-2 border-red-900/60 hover:border-red-600 rounded-xl p-5 text-center transition-all shadow-[0_0_20px_rgba(0,0,0,0.8)] active:scale-95 group"
        >
          <h2 className="text-2xl font-black tracking-widest text-neutral-200 group-hover:text-red-400 transition-colors">
            PVE MODE
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-medium">1인 던전 정화 작전 수행</p>
        </button>

        <div className="w-full bg-neutral-950/90 border border-neutral-800/40 rounded-xl p-5 text-center opacity-40 relative cursor-not-allowed">
          <h2 className="text-2xl font-black tracking-widest text-neutral-500">
            PVP DUEL
          </h2>
          <p className="text-xs text-red-500/80 font-bold mt-1 tracking-wider">결투장 준비 중...</p>
        </div>

      </div>

      <div></div>
    </div>
  );
}
