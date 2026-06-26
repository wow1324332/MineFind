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

      {/* 배경 연출 */}
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

        {/* 💡 시네마틱 로딩 바 (붉은 빛무리 제거 & 테두리 그라데이션 페더링 적용) */}
        {/* 기존의 붉은 shadow를 제거하고 어두운 톤으로 눌러주었습니다. */}
        <div className="mt-10 w-64 h-4 relative bg-neutral-900/80 rounded-full shadow-md shadow-black/50 overflow-hidden">
          
          {/* 💡 핵심: mask-image를 사용해 게이지가 차오를 때 오른쪽 끝부분(75% ~ 100% 구간)이 부드럽게 흐려지도록 처리했습니다. */}
          <div className="absolute top-0 left-0 h-full animate-[loadingBar_3s_ease-in-out_forwards] [mask-image:linear-gradient(to_right,black_75%,transparent_100%)]">
            
            <div className="w-64 h-full flex items-center justify-center mix-blend-screen">
              <div 
                className="w-full h-full"
                style={{ 
                  backgroundImage: "url('/splashloadingbar.png')", 
                  backgroundSize: '130% 1200%', 
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat'
                }}
              ></div>
            </div>
          </div>
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
