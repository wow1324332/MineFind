import React from 'react';

// 💡 1. 맨 윗줄 오타(rt)를 export로 고치고, onMyPage 프롭스를 추가했습니다.
export default function HuntList({ onSelectDevilMine, onLogout, onMyPage }) {
  return (
    // 1. 제일 바깥쪽 뼈대 (배경 설정 및 페이드인)
    <div className="relative min-h-screen text-white flex flex-col items-center px-6 pb-6 pt-0 animate-[fadeIn_0.5s_ease-in-out] overflow-hidden">
      
      {/* 2. 배경 이미지 레이어 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 z-0 pointer-events-none"
        style={{ backgroundImage: "url('/Portallist-bg.jpg')" }}
      ></div>

      {/* 3. 내용물 래퍼 */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        
        {/* 상단 타이틀 영역 */}
        <div className="w-full max-w-sm mt-0 mb-0 mx-auto relative flex justify-center pointer-events-none z-20">
          <div 
            className="w-full"
            style={{ 
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
            }}
          >
            <img 
              src="/demonic-title.jpg" 
              alt="Demonic Portals" 
              className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.2)]"
            />
          </div>
        </div>

        {/* 4. 돌담 헤더 */}
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

          {/* 💡 1. My Page 텍스트 버튼 (수정 완료!) */}
          {/* alert 창이 뜨던 부분을 지우고 onMyPage로 연결했습니다. */}
          <button 
            onClick={onMyPage}
            className="transition-all duration-150 brightness-90 saturate-90 active:scale-90 active:brightness-75 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] px-2 select-none"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            <img src="/My-icon.png" alt="My Page" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
          </button>
          
          {/* 2. Logout 아이콘 버튼 */}
          <button 
            onClick={onLogout}
            className="transition-all duration-150 brightness-90 saturate-90 active:scale-90 active:brightness-75 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] px-2 select-none"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            <img src="/Logout-icon.png" alt="Logout" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
          </button>

        </div>
        
        {/* 던전 카드 목록 리스트 */}
        <div className="w-full max-w-sm space-y-4">
          
          {/* 활성화된 지뢰찾기 던전 (Devil Mine) 특제 이미지 버튼 */}
          <button
            onClick={onSelectDevilMine}
            className="w-full transition-all duration-200 hover:brightness-110 active:scale-[0.96] drop-shadow-[0_4px_15px_rgba(200,50,0,0.3)] select-none"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            <img 
              src="/devil-mine-btn.png" 
              alt="Devil Mine" 
              className="w-full h-auto object-contain pointer-events-none" 
              draggable="false"
            />
          </button>

        </div>
      </div>
    </div>
  );
}
