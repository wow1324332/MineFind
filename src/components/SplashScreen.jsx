import React from 'react';

export default function SplashScreen({ 
  message = "Transfer...", 
  logoSrc = "/Splash-logo.jpg", 
  bgSrc = null,
  bgOpacity = "opacity-30",
  disablePulse = false,
  useFadeIn = false
}) {
  return (
    <div className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black overflow-hidden ${useFadeIn ? 'animate-[fadeIn_0.5s_ease-in-out]' : ''}`}>
      
      {bgSrc && (
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat ${bgOpacity}`}
          style={{ backgroundImage: `url('${bgSrc}')` }}
        />
      )}

      {/* 배경 연출: 배경 이미지가 있든 없든 칠흑 같은 어둠과 펄스 효과를 덮어 시네마틱하게 만듭니다. */}
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${bgSrc ? 'from-transparent' : 'from-neutral-900/60'} via-black to-black ${disablePulse ? '' : 'animate-pulse'} pointer-events-none`}></div>

      {/* 중앙 요소 컨테이너 */}
      <div className="relative z-10 flex flex-col items-center w-full px-6">
        
        <img
          src={logoSrc} 
          alt="Loading Info"
          className="w-full max-w-xs md:max-w-md lg:max-w-lg h-auto object-contain drop-shadow-2xl"
        />

        {/* 타이틀 텍스트 */}
        <h1 className="mt-8 text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-300 to-purple-600 tracking-[0.5em] animate-[pulse_2s_ease-in-out_infinite] drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] text-center">
          {message}
        </h1>

        {/* 시네마틱 로딩 바 (용암 이미지 적용) */}
        <div className="mt-10 w-64 h-2 relative overflow-hidden bg-neutral-900/50 rounded-full shadow-[0_0_15px_rgba(255,50,0,0.3)]">
          <div 
            className="absolute top-0 left-0 h-full rounded-full mix-blend-screen animate-[loadingBar_3s_ease-in-out_forwards]"
            style={{ 
              backgroundImage: "url('/splashloadingbar.png')", // 🚨 파일명이 다르면 여기만 수정하세요
              backgroundSize: '16rem 100%', 
              backgroundPosition: 'left center',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
        </div>
      </div>

      <style>{`
        @keyframes loadingBar {
          0% { width: 0%; }
          40% { width: 45%; }
          70% { width: 80%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}

