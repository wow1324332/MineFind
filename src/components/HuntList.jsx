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

      {/* 💡 3. 내용물 래퍼 (이 안쪽에 모든 헌트리스트 내용이 들어갑니다) */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        
        {/* 상단 타이틀 영역 */}
      <div className="w-full max-w-sm mt-0 mb-6 mx-auto relative flex justify-center pointer-events-none">
          
          {/* 💡 CSS 마스크 마법: 이미지의 아랫부분을 투명하게 그라데이션 처리해서 배경에 스르륵 녹아들게 만듭니다. */}
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

        <div 
          className="w-full max-w-sm h-14 mb-6 rounded-lg border border-neutral-800 shadow-xl flex justify-between items-center px-4 relative overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: "url('/header-bg.jpg')" }}
        >
          {/* 돌담 질감 위에 글자가 잘 보이도록 얇은 검은색 그림자(오버레이)를 깝니다 */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
          
          {/* 1. 마이페이지 버튼 (왼쪽) */}
          <button 
            onClick={() => alert("아직 포탈의 이 구역은 개방되지 않았습니다.")}
            className="relative z-10 text-xs font-bold text-neutral-300 hover:text-amber-500 transition-colors bg-neutral-900/60 px-3 py-1.5 rounded border border-neutral-700/50 backdrop-blur-sm"
          >
            마이페이지
          </button>
          
          {/* 2. 로그아웃 버튼 (오른쪽) */}
          <button 
            onClick={onLogout}
            className="relative z-10 text-xs font-bold text-red-500 hover:text-red-400 hover:bg-red-950/40 transition-colors bg-neutral-900/60 px-3 py-1.5 rounded border border-red-900/50 backdrop-blur-sm"
          >
            포탈 이탈
          </button>
        </div>

        {/* 던전 카드 목록 리스트 */}
        <div className="w-full max-w-sm space-y-4">
          
          {/* 1. 활성화된 지뢰찾기 던전 (Devil Mine) */}
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
