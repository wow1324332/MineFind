import React from 'react';

export default function MyPage({ onBack }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-black text-white pt-10 px-6 select-none">
      
      {/* 💡 배경: 헌트리스트와 동일한 배경 (파일명이 다르면 수정해주세요) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url('/huntlist-bg.jpg')" }}
      ></div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_#000000_100%)] pointer-events-none"></div>

      {/* 상단 타이틀 이미지와 돌담 헤더 묶음 */}
      <div className="w-full flex flex-col items-center max-w-md relative z-10">
        
        {/* 1. 타이틀 이미지 */}
        <div className="w-full max-w-[16rem] mx-auto relative flex justify-center pointer-events-none mb-2">
          <div 
            className="w-full"
            style={{ 
              WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)'
            }}
          >
            {/* 💡 임시로 헌트리스트 타이틀을 넣었습니다. 나중에 마이페이지용 이미지로 교체하세요! */}
            <img 
              src="/minelegend-title.png" 
              alt="My Page Title" 
              className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.2)]"
            />
          </div>
        </div>

        {/* 2. 돌담 헤더 */}
        <div className="w-full max-w-sm h-12 mb-12 flex justify-between items-center relative z-10">
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

          {/* 왼쪽 뒤로 가기 버튼 (헌트리스트로 복귀) */}
          <button 
            onClick={onBack}
            className="transition-all duration-150 brightness-90 saturate-90 active:scale-90 active:brightness-75 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] px-2 select-none"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            <img src="/back.png" alt="Back" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
          </button>
          
          {/* 오른쪽 빈 공간 (가운데 정렬 균형 맞추기 용도) */}
          <div className="w-12"></div>
        </div>
      </div>

      {/* 💡 차후 기능이 하나씩 들어갈 중앙 컨텐츠 영역 */}
      <div className="relative z-10 w-full max-w-sm bg-black/50 border border-neutral-700/50 rounded-xl p-6 min-h-[300px] flex flex-col items-center justify-center backdrop-blur-sm shadow-2xl">
        <p className="text-neutral-400 font-bold mb-2">계정 정보 로딩 중...</p>
        <p className="text-xs text-neutral-500">여기에 마이페이지 기능이 추가될 예정입니다.</p>
      </div>

    </div>
  );
}
