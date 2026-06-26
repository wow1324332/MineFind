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
        
        {/* 메인 로고 */}
        <img
          src={logoSrc} 
          alt="Main Logo"
          className="w-full max-w-xs md:max-w-md lg:max-w-lg h-auto object-contain drop-shadow-2xl"
        />

        {/* 💡 [수정] 누끼 딴 투명 폰트 이미지 적용 */}
        <img
          src="/loading-font.png" // 🚨 누끼 딴 투명 PNG 파일명
          alt="Loading..."
          // 💡 mix-blend-screen을 제거하여 사각형 번쩍임을 없앴습니다.
          // 대신 drop-shadow를 옅게 깔아주어 폰트 자체만 배경에 자연스럽게 묻어가며 깜빡이게(pulse) 만듭니다.
          className="mt-8 w-56 md:w-64 h-auto object-contain animate-[pulse_2s_ease-in-out_infinite] drop-shadow-[0_0_12px_rgba(255,80,0,0.5)]"
        />

        {/* 시네마틱 로딩 바 */}
        <div className="mt-2 w-48 h-3 relative bg-neutral-900/80 rounded-full shadow-md shadow-black/50 overflow-hidden">
          <div className="absolute top-0 left-0 h-full animate-[loadingBar_3s_ease-in-out_forwards] [mask-image:linear-gradient(to_right,black_75%,transparent_100%)]">
            <div className="w-48 h-full flex items-center justify-center mix-blend-screen">
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
