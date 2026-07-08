// src/components/Knights.jsx
import React from 'react';

export default function Knights({ onBack }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6 animate-[fadeIn_0.5s_ease-in-out]">
      
      {/* 상단 헤더 & 뒤로가기 버튼 */}
      <div className="w-full max-w-md flex justify-between items-center mb-8 relative z-10">
        <button onClick={onBack} className="transition-all duration-150 active:scale-90 p-2 outline-none">
          <img src="/backkey.png" alt="Back" className="w-8 h-8 object-contain" />
        </button>
        <h1 className="text-[#d8b486] font-serif font-black text-2xl tracking-widest drop-shadow-md">
          KNIGHTS
        </h1>
        <div className="w-12"></div>
      </div>

      {/* 콘텐츠 영역 (추후 기사 목록이 들어갈 자리) */}
      <div className="w-full max-w-md flex flex-col items-center justify-center flex-1 border-2 border-[#4a2c11]/40 border-dashed rounded-lg bg-[#2a1a10]/30 p-8">
        <span className="text-[#a6845c] font-bold tracking-widest text-center">
          기사단 시스템 준비 중...
        </span>
      </div>
      
    </div>
  );
}
