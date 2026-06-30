import React from 'react';

export default function MyPage({ onBack }) {
  return (
    <div className="relative min-h-screen text-white flex flex-col items-center px-6 pb-6 pt-0 animate-[fadeIn_0.5s_ease-in-out] overflow-hidden">
      
      {/* 배경 이미지 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 z-0 pointer-events-none"
        style={{ backgroundImage: "url('/Portallist-bg.jpg')" }}
      ></div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        
        {/* 💡 1. 타이틀 영역: 위아래 여백(mt-4, mb-4)을 주어 성채 이미지가 답답하지 않게 공간을 확보했습니다. */}
        <div className="w-full max-w-sm mt-4 mb-4 mx-auto relative flex justify-center pointer-events-none z-20">
          <div 
            className="w-full"
            style={{ 
              // 💡 2. 이미지가 크기 때문에 자연스럽게 스며들도록 아래쪽 그라데이션 페이드아웃 비율을 70%로 살짝 조정했습니다.
              WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
            }}
          >
            {/* 💡 3. 파일명을 새로 뽑으신 mypage-title.jpeg 로 교체 완료! */}
            <img 
              src="/mypage-title.jpeg" 
              alt="My Page Title" 
              className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.2)]"
            />
          </div>
        </div>

        {/* 💡 4. 돌담 헤더: 기존에 이미지를 파고들던(-mt-2) 것을 없애고 깔끔하게 타이틀 아래에 위치하도록 내렸습니다. */}
        <div className="w-full max-w-sm h-12 mb-6 flex justify-between items-center relative z-10">
          
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

          <button 
            onClick={onBack}
            className="transition-all duration-150 brightness-90 saturate-90 active:scale-90 active:brightness-75 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] px-2 select-none"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            <img src="/My-icon.png" alt="Back" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
          </button>
          
          <div className="w-12 px-2"></div>

        </div>
        
        {/* 마이페이지 컨텐츠 영역 */}
        <div className="w-full max-w-sm bg-black/60 border border-neutral-700/50 rounded-xl p-6 min-h-[300px] flex flex-col items-center justify-center backdrop-blur-sm shadow-2xl mt-2">
          <p className="text-neutral-300 font-bold mb-3 text-lg">계정 정보 로딩 중...</p>
          <p className="text-sm text-neutral-500 text-center leading-relaxed">
            여기에 마이페이지 기능이<br/>추가될 예정입니다.
          </p>
        </div>

      </div>
    </div>
  );
}
