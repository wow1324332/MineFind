import React from 'react';

export default function MyPage({ onBack }) {
  return (
    // 💡 최상단 부모에 bg-black을 추가하여 배경이 내려가서 생긴 윗부분의 빈 공간을 완벽한 어둠으로 채워줍니다.
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center px-6 pb-6 pt-0 animate-[fadeIn_0.5s_ease-in-out] overflow-hidden">
      
      {/* 💡 배경 이미지 수정 완료! 
          1. inset-0 대신 inset-x-0 top-[15%] bottom-0 을 사용해 아예 헤더 아래쪽으로 위치를 내렸습니다.
          2. bg-bottom을 추가해 카펫 끝부분이 화면 맨 아래에 딱 붙도록 고정했습니다.
          3. maskImage 그라데이션을 주어 어둠 속에서 자연스럽게 나타나도록 했습니다. */}
      <div 
        className="absolute inset-x-0 top-[15%] bottom-0 bg-cover bg-bottom bg-no-repeat opacity-60 z-0 pointer-events-none"
        style={{ 
          backgroundImage: "url('/mypage-bg.jpeg')", // 🚨 새로 생성하신 로비 이미지 파일명으로 꼭 수정해주세요!
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)'
        }}
      ></div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        
        {/* 💡 타이틀 영역: mt-4, mb-4를 mt-2, mb-0으로 줄여서 타이틀을 위로 살짝 끌어올렸습니다. */}
        <div className="w-full max-w-sm mt-2 mb-0 mx-auto relative flex justify-center pointer-events-none z-20">
          <div 
            className="w-full"
            style={{ 
              WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
            }}
          >
            <img 
              src="/mypage-title.jpeg" 
              alt="My Page Title" 
              className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.2)]"
            />
          </div>
        </div>

        {/* 💡 돌담 헤더: 타이틀과 너무 멀어지지 않게 -mt-1을 주어 자연스럽게 따라 올라가도록 했습니다. */}
        <div className="w-full max-w-sm h-12 -mt-1 mb-6 flex justify-between items-center relative z-10">
          
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
        <div className="w-full max-w-sm flex flex-col items-center mt-2 space-y-4">
          
        </div>

      </div>
    </div>
  );
}
