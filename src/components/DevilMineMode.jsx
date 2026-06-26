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

      {/* 💡 상단 네비게이션 헤더 (Hunt List 스타일 + 뒤로 가기 통합) */}
      <div className="relative z-10 w-full max-w-sm flex items-center justify-between mt-8 px-4 py-3 bg-neutral-900/60 border border-neutral-800/80 rounded-2xl backdrop-blur-sm shadow-[0_8px_20px_rgba(0,0,0,0.6)]">
        
        {/* 왼쪽: 뒤로 가기 버튼 (헌트리스트로 복귀) */}
        <button 
          onClick={onBack}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-black/60 border border-neutral-700 text-neutral-400 hover:text-white hover:border-red-500 transition-all active:scale-90"
        >
          <span className="text-sm font-bold leading-none mb-0.5">←</span>
        </button>

        {/* 중앙: 게임 로고 / 타이틀 */}
        <div className="text-center flex-1 mx-2">
          <h1 className="text-lg font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">
            MINE LEGENDS
          </h1>
        </div>

        {/* 오른쪽: 재화 표시 또는 프로필 (헌트리스트 느낌 유지) */}
        <div className="flex items-center gap-1.5 bg-black/50 border border-neutral-800 px-3 py-1.5 rounded-full">
          <span className="text-[10px] text-orange-400">💎</span>
          <span className="text-xs text-white font-bold tracking-wider">0</span>
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
