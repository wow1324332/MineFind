// src/components/Knights.jsx
import React from 'react';

export default function Knights({ onBack }) {
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center px-6 pb-6 pt-0 animate-[fadeIn_0.5s_ease-in-out] overflow-hidden">
      
      {/* 1. 화면 하단 배경 이미지 (마이페이지와 동일한 그라데이션 마스크 적용) */}
      <div 
        className="absolute inset-x-0 top-[15%] bottom-0 bg-cover bg-bottom bg-no-repeat opacity-60 z-0 pointer-events-none"
        style={{ 
          backgroundImage: "url('/mypage-bg.jpeg')", // 💡 다른 배경을 원하시면 이 파일명을 변경하세요.
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)', 
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)' 
        }}
      ></div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        
        {/* 2. 상단 타이틀 이미지 영역 */}
        <div className="w-full max-w-sm mt-2 mb-0 mx-auto relative flex justify-center pointer-events-none z-20">
          <div className="w-full flex justify-center" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' }}>
            {/* 💡 아까 버튼으로 썼던 깃발 이미지를 타이틀로 재활용했습니다! 
                따로 타이틀 이미지를 만드신다면 src 경로만 바꿔주세요. */}
            <img 
              src="/knights-title.jpg" 
              alt="Knights Title" 
              className="w-[85%] h-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.2)]" 
            />
          </div>
        </div>

        {/* 3. 돌담 헤더 & 뒤로가기 버튼 */}
        <div className="w-full max-w-sm h-12 -mt-1 mb-0 flex justify-between items-center relative z-30">
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
          
          <button onClick={onBack} className="transition-all duration-150 active:scale-90 px-2 outline-none">
            <img src="/backkey.png" alt="Back" className="w-8 h-8 object-contain" />
          </button>
          
          {/* 헤더 중앙 텍스트 (타이틀 이미지가 있으므로 심플하게 처리) */}
          <div className="text-[#d8b486] font-serif font-black text-sm tracking-[0.3em] drop-shadow-md">
            ORDER OF KNIGHTS
          </div>
          
          <div className="w-12 px-2"></div> {/* 비율을 맞추기 위한 투명 박스 */}
        </div>
        
        {/* 4. 기사단 콘텐츠 영역 (임시) */}
        <div className="w-full max-w-sm flex flex-col items-center justify-center min-h-[300px] border-2 border-[#4a2c11]/40 border-dashed rounded-lg bg-[#2a1a10]/50 p-8 mt-8 relative z-10 backdrop-blur-sm shadow-inner">
          <svg className="w-12 h-12 text-[#a6845c]/70 mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          <span className="text-[#f5d5a9] font-black tracking-widest text-center drop-shadow-md">
            고대의 기사들을 소환할<br/>제단이 건설 중입니다...
          </span>
        </div>

      </div>
    </div>
  );
}
