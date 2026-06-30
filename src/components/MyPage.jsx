import React, { useState } from 'react';

export default function MyPage({ onBack }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center px-6 pb-6 pt-0 animate-[fadeIn_0.5s_ease-in-out] overflow-hidden">
      
      {/* 배경 이미지 */}
      <div 
        className="absolute inset-x-0 top-[15%] bottom-0 bg-cover bg-bottom bg-no-repeat opacity-60 z-0 pointer-events-none"
        style={{ 
          backgroundImage: "url('/mypage-bg.jpeg')", 
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)'
        }}
      ></div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        
        {/* 타이틀 영역 */}
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

        {/* 💡 돌담 헤더: mb-6 였던 여백을 mb-0 으로 줄여서 아래쪽 공간을 싹 없앴습니다. */}
        <div className="w-full max-w-sm h-12 -mt-1 mb-0 flex justify-between items-center relative z-10">
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
        
        {/* 💡 마이페이지 컨텐츠 영역: mt-0 였던 것을 -mt-4 로 변경하여 상자를 위로 강제로 확 끌어올렸습니다. */}
        <div className="w-full max-w-sm flex flex-col items-center -mt-4 space-y-4 relative z-20">
          
          {/* 마이 프로필 휘장 버튼 */}
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="w-full max-w-[18rem] transition-all duration-200 hover:brightness-110 active:scale-95 drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] select-none"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            <img 
              src="/myprofile-bt.png" 
              alt="My Profile" 
              className="w-full h-auto object-contain pointer-events-none" 
              draggable="false"
            />
          </button>

        </div>
      </div>

      {/* 마이 프로필 모달창 */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 animate-[fadeIn_0.2s_ease-in-out]">
          
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsProfileOpen(false)}
          ></div>
          
          <div className="relative z-10 w-full max-w-sm bg-neutral-900 border-2 border-yellow-700/50 rounded-xl p-6 shadow-2xl flex flex-col items-center">
            
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-400 mb-4 font-serif">
              My Profile
            </h2>
            
            <div className="w-full bg-black/50 border border-neutral-700 rounded-lg p-4 mb-6 min-h-[150px] flex items-center justify-center">
              <p className="text-neutral-500 text-sm">유저 정보가 표시될 공간입니다.</p>
            </div>

            <button 
              onClick={() => setIsProfileOpen(false)}
              className="px-8 py-2 bg-red-900/80 hover:bg-red-800 border border-red-700 rounded text-white font-bold transition-all active:scale-95"
            >
              닫기
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
