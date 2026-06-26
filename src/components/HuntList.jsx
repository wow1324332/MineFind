import React from 'react';

export default function HuntList({ onSelectDevilMine, onLogout }) {
  return (
    // 💡 1. 제일 바깥쪽 뼈대 (배경 설정 및 페이드인)
    <div className="relative min-h-screen text-white flex flex-col items-center px-6 pb-6 pt-0 animate-[fadeIn_0.5s_ease-in-out] overflow-hidden">
      
      {/* 💡 2. 배경 이미지 레이어 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 z-0 pointer-events-none"
        style={{ backgroundImage: "url('/Portallist-bg.jpg')" }}
      ></div>

      {/* 💡 3. 내용물 래퍼 */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        
        {/* 상단 타이틀 영역 (mb-0으로 아래쪽 여백을 없앴습니다) */}
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

        {/* 💡 4. [완전 교정] 두께를 줄이고 중앙 정렬을 완벽하게 맞춘 돌담 헤더 */}
        <div className="w-full max-w-sm h-12 -mt-2 mb-6 flex justify-between items-center relative z-10">
          
          {/* 💡 마법 1: 버튼들은 놔두고, '돌담 배경'만 화면 양끝으로 강제로 늘립니다! (-z-10으로 버튼 뒤에 깔아줍니다) */}
          <div 
            className="absolute top-0 w-[100vw] left-1/2 -translate-x-1/2 h-full bg-cover bg-center pointer-events-none -z-10"
            style={{ 
              backgroundImage: "url('/header-bg.jpg')",
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
            }}
          >
            {/* 어두운 막 */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* 💡 마법 2: 버튼들은 max-w-sm 상자 안에서 좌우 예쁘게 정렬됩니다. */}
          {/* 1. My Page 텍스트 버튼 */}
          <button 
            onClick={() => alert("아직 포탈의 이 구역은 개방되지 않았습니다.")}
            className="transition-all duration-150 brightness-90 saturate-90 active:scale-90 active:brightness-75 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] px-2 select-none"
            // 💡 [핵심 해결책] 인라인 스타일로 터치 하이라이트와 아웃라인을 강제로 없앱니다.
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            {/* 💡 draggable="false"를 추가해 꾹 눌렀을 때 이미지가 선택되는 현상도 원천 차단합니다. */}
            <img src="/My-icon.png" alt="My Page" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
          </button>
          
          {/* 2. Logout 아이콘 버튼 */}
          <button 
            onClick={onLogout}
            className="transition-all duration-150 brightness-90 saturate-90 active:scale-90 active:brightness-75 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] px-2 select-none"
            // 💡 [핵심 해결책] 
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
            // 💡 [핵심 해결책]
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
