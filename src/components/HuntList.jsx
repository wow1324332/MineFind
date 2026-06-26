import React from 'react';

export default function HuntList({ onSelectDevilMine }) {
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
