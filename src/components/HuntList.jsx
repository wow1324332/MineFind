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

        {/* 💡 4. [완전 개편] 얇고, 꽉 차고, 녹아드는 텍스트 버튼 돌담 헤더 */}
        <div className="w-screen relative left-1/2 -translate-x-1/2 h-10 -mt-6 mb-8 flex justify-center items-center z-10">
          
          {/* 헤더 배경 이미지 & 위아래 그라데이션 마스크 (테두리 없음) */}
          <div 
            className="absolute inset-0 bg-cover bg-center pointer-events-none"
            style={{ 
              backgroundImage: "url('/header-bg.jpg')",
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)'
            }}
          >
            {/* 글자가 잘 보이도록 돌담 위에 어두운 막 씌우기 */}
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          {/* 텍스트 폰트 버튼 영역 (가운데 정렬된 리스트와 좌우 폭을 맞춥니다) */}
          <div className="w-full max-w-sm px-4 flex justify-between items-center relative z-10">
            {/* 1. My Page 텍스트 버튼 */}
            <button 
              onClick={() => alert("아직 포탈의 이 구역은 개방되지 않았습니다.")}
              className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 hover:text-amber-500 transition-colors drop-shadow-md"
            >
              My Page
            </button>
            
            {/* 2. Logout 텍스트 버튼 */}
            <button 
              onClick={onLogout}
              className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-600 hover:text-red-400 transition-colors drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]"
            >
              Logout
            </button>
          </div>
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
