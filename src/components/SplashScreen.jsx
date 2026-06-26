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

        {/* 💡 [수정] 원본 폰트 이미지를 누끼 없이 그대로 사용 (불꽃 보존) */}
        <img
          src="/1782477769683.jpg" // 🚨 원본 파일명과 확장자(.jpg 또는 .png)를 꼭 확인해주세요!
          alt="Loading..."
          // 💡 핵심: mix-blend-screen으로 검은 배경을 날리고, 크기를 살짝 키웠습니다(w-64).
          // 원본 이미지 자체의 불꽃이 화려하므로 촌스러운 인위적 그림자(drop-shadow)는 뺐습니다.
          className="mt-8 w-64 md:w-72 h-auto object-contain animate-[pulse_2s_ease-in-out_infinite] mix-blend-screen"
        />

        {/* 시네마틱 로딩 바 */}
        <div className="mt-8 w-64 h-4 relative bg-neutral-900/80 rounded-full border border-neutral-800 shadow-md shadow-black/50 overflow-hidden">
          <div className="absolute top-0 left-0 h-full animate-[loadingBar_3s_ease-in-out_forwards] [mask-image:linear-gradient(to_right,black_75%,transparent_100%)]">
            <div className="w-64 h-full flex items-center justify-center mix-blend-screen">
              <div 
                className="w-full h-full"
                style={{ 
                  backgroundImage: "url('/51409.png')", 
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
