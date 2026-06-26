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

        {/* 💡 헌트리스트에서 그대로 가져온 돌담 헤더 */}
        <div className="w-full max-w-sm h-12 mt-4 mb-6 flex justify-between items-center relative z-10">
          
          {/* 돌담 배경 (화면 양끝으로 쫙 늘어나는 마법 유지) */}
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

          {/* 1. 왼쪽 버튼 (여기에 onBack을 연결했습니다!) */}
          <button 
            onClick={onBack}
            className="transition-all duration-150 brightness-90 saturate-90 active:scale-90 active:brightness-75 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] px-2 select-none"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            {/* 💡 뒤로 가기용 화살표 이미지가 따로 있다면 '/My-icon.png' 부분을 바꿔주세요 */}
            <img src="/My-icon.png" alt="Back" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
          </button>
          
          {/* 2. 오른쪽 버튼 (로그아웃 아이콘 유지 혹은 비워두기) */}
          <button 
            // onClick={...} 필요하다면 여기에 우측 버튼 기능을 넣으세요. 기능이 없다면 태그만 남겨둬야 좌우 균형이 맞습니다.
            className="transition-all duration-150 brightness-90 saturate-90 active:scale-90 active:brightness-75 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] px-2 select-none"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            <img src="/Logout-icon.png" alt="Logout" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
          </button>

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
