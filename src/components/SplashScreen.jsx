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

        {/* 💡 시네마틱 로딩 바 (모서리 라운딩 & 길이 부족 완벽 해결) */}
        <div className="mt-10 w-64 h-4 relative bg-neutral-900/50 rounded-full shadow-[0_0_15px_rgba(255,50,0,0.3)] overflow-hidden">
          
          {/* 1. 애니메이션 마스크: 이 녀석이 커지면서, 넘치는 부분을 잘라내(overflow-hidden) 항상 오른쪽 끝을 둥글게(pill-shape) 만들어 줍니다. */}
          <div className="absolute top-0 left-0 h-full rounded-full overflow-hidden animate-[loadingBar_3s_ease-in-out_forwards]">
            
            {/* 2. 고정된 용암 영역: 마스크가 커져도 이 상자는 게이지 전체 길이(w-64)로 고정되어 있어 이미지가 찌그러지지 않습니다. */}
            <div className="w-64 h-full flex items-center justify-center mix-blend-screen">
              <div 
                className="w-full h-full"
                style={{ 
                  backgroundImage: "url('/splashloadingbar.png')", 
                  // 3. 가로를 130%로 뻥튀기해 좌우 빈 공간을 화면 밖으로 밀어내고, 세로를 1200%로 늘려 굵직한 코어 용암만 채웁니다!
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
