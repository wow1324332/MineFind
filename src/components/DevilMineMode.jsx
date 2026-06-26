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

      {/* 💡 상단 타이틀 이미지와 돌담 헤더 묶음 */}
      <div className="w-full flex flex-col items-center max-w-md relative z-10 mt-0">
        
        {/* 1. 데빌마인 타이틀 이미지 */}
        <div className="w-full max-w-sm mt-0 mx-auto relative flex justify-center pointer-events-none">
          <div 
            className="w-full"
            style={{ 
              WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)'
            }}
          >
            <img 
              src="/devilminemode-title.jpg" // 🚨 첨부해주신 확장자에 맞게(.jpg 또는 .png) 수정해주세요.
              alt="Devil Mine Title" 
              className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.2)]"
            />
          </div>
        </div>

        {/* 2. 돌담 헤더 */}
        <div className="w-full max-w-sm h-12 -mt-4 mb-6 flex justify-between items-center relative z-10">
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

      {/* 모드 선택 버튼 영역 */}
      <div className="relative z-10 w-full max-w-xs -space-y-2 mb-20">
        
        {/* PVE 모드 (Hunting) */}
        <button
          onClick={onSelectPVE}
          className="w-full transition-all duration-200 hover:brightness-110 active:scale-[0.96] drop-shadow-[0_4px_15px_rgba(200,50,0,0.3)] select-none"
          style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
        >
          <img 
            src="/hunting-bt.png" // 🚨 PVE 버튼 이미지 파일명
            alt="PVE Hunting Mode" 
            className="w-full h-auto object-contain pointer-events-none" 
            draggable="false"
          />
        </button>

        {/* PVP 모드 (Battle - 준비중) */}
        <div className="w-full relative opacity-50 grayscale-[0.8] cursor-not-allowed select-none">
          <img 
            src="/battle-bt.png" // 🚨 PVP 버튼 이미지 파일명
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
