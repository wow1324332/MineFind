// src/components/SplashScreen.jsx
import React from 'react';

export default function SplashScreen({ 
  message = "Transfer...", 
  logoSrc = "/Splash-logo.jpg", // 기본 로고
  bgSrc = null // 동적 배경 이미지 (없으면 기본 어둠 효과)
}) {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black overflow-hidden">
      
      {/* 💡 [추가] 외부에서 전달받은 배경 이미지가 있다면 깔아줍니다. */}
      {bgSrc && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url('${bgSrc}')` }}
        />
      )}

      {/* 배경 연출: 배경 이미지가 있든 없든 칠흑 같은 어둠과 펄스 효과를 덮어 시네마틱하게 만듭니다. */}
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${bgSrc ? 'from-transparent' : 'from-neutral-900/60'} via-black to-black animate-pulse pointer-events-none`}></div>

      {/* 중앙 요소 컨테이너 */}
      <div className="relative z-10 flex flex-col items-center w-full px-6">
        
        {/* 💡 [수정] 고정된 이미지가 아닌, 외부에서 전달받은 로고(logoSrc)를 렌더링합니다. */}
        <img
          src={logoSrc} 
          alt="Loading Info"
          className="w-full max-w-xs md:max-w-md lg:max-w-lg h-auto object-contain drop-shadow-2xl"
        />

        {/* 타이틀 텍스트 */}
        <h1 className="mt-8 text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-300 to-purple-600 tracking-[0.5em] animate-[pulse_2s_ease-in-out_infinite] drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] text-center">
          {message}
        </h1>

        {/* 시네마틱 로딩 바 */}
        <div className="mt-10 w-64 h-1.5 bg-neutral-900 rounded-full border border-neutral-800 relative">
          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-600 via-cyan-400 to-purple-500 rounded-full animate-[loadingBar_3s_ease-in-out_forwards] shadow-[0_0_20px_3px_rgba(168,85,247,0.8)]"></div>
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
