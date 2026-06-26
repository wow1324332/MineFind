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
            // 💡 [수정] 평소에는 어둡고 투명하게, 마우스를 올렸을 때만 밝아지게 수정했습니다.
            className="transition-all duration-300 opacity-60 brightness-75 saturate-75 hover:opacity-100 hover:brightness-125 hover:saturate-100 hover:scale-110 focus:outline-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-2"
          >
            <img src="/My-icon.png" alt="My Page" className="w-8 h-8 object-contain" />
          </button>
          
          {/* 2. Logout 아이콘 버튼 */}
          <button 
            onClick={onLogout}
            // 💡 [수정] 동일한 효과를 로그아웃 버튼에도 적용합니다.
            className="transition-all duration-300 opacity-60 brightness-75 saturate-75 hover:opacity-100 hover:brightness-125 hover:saturate-100 hover:scale-110 focus:outline-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-2"
          >
            <img src="/Logout-icon.png" alt="Logout" className="w-8 h-8 object-contain" />
          </button>

        </div>
        
        {/* 던전 카드 목록 리스트 */}
        <div className="w-full max-w-sm space-y-4">
          
          {/* 활성화된 지뢰찾기 던전 (Devil Mine) 특제 이미지 버튼 */}
          <button
            onClick={onSelectDevilMine}
            className="w-full transition-all duration-200 hover:brightness-110 active:scale-[0.96] focus:outline-none drop-shadow-[0_4px_15px_rgba(200,50,0,0.3)]"
          >
            <img 
              src="/devil-mine-btn.png" 
              alt="Devil Mine" 
              className="w-full h-auto object-contain"
            />
          </button>

        </div>
      </div>
    </div>
  );
}
