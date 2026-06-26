import React from 'react';

// 💡 컴포넌트 이름이 지뢰찾기 전용임을 명확히 합니다.
export default function DevilMineMode({ onSelectPVE, onBack, onLogout }) {
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
            onClick={onLogout}
            className="transition-all duration-150 brightness-90 saturate-90 active:scale-90 active:brightness-75 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] px-2 select-none"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
           >

            <img src="/Logout-icon.png" alt="Logout" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
          </button>

        </div>



      {/* 모드 선택 버튼 영역 */}
      <div className="relative z-10 w-full max-w-xs space-y-2 mb-20">
        
        {/* 💡 [수정됨] 텍스트를 모두 지우고 'Hunting' 이미지 버튼으로 대체했습니다. */}
        <button
          onClick={onSelectPVE}
          // 💡 배경과 테두리를 없애고, 누를 때 살짝 작아지며 밝아지는 헌트리스트 특유의 고급 애니메이션을 적용했습니다.
          className="w-full transition-all duration-200 hover:brightness-110 active:scale-[0.96] drop-shadow-[0_4px_15px_rgba(200,50,0,0.3)] select-none"
          style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
        >
          <img 
            src="/hunting-bt.png" // 🚨 누끼를 딴 PNG 파일의 이름을 여기에 적어주세요!
            alt="PVE Hunting Mode" 
            className="w-full h-auto object-contain pointer-events-none" 
            draggable="false"
          />
        </button>

        {/* 💡 [수정됨] PVP 버튼도 텍스트를 지우고 'Battle' 이미지로 교체했습니다. */}
        <div className="w-full relative opacity-50 grayscale-[0.8] cursor-not-allowed select-none">
          <img 
            src="/battle-bt.png" // 🚨 누끼를 딴 Battle PNG 파일의 이름을 여기에 적어주세요!
            alt="PVP Battle Mode (준비 중)" 
            className="w-full h-auto object-contain pointer-events-none drop-shadow-md" 
            draggable="false"
          />
        </div>

      </div>

      <div></div>
    </div>
  );
}
