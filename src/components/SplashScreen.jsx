import React from 'react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* 배경 연출: 심연에서 뿜어져 나오는 붉은 마나의 기운 (은은하게 깜빡임) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-950/40 via-black to-black animate-pulse"></div>

      {/* 중앙 로고 및 텍스트 영역 (시네마틱하게 천천히 다가오는 연출) */}
      <div className="relative z-10 flex flex-col items-center animate-[zoomIn_3s_ease-in-out_forwards]">
        
        {/* 아이콘: 붉은 안광(drop-shadow)을 뿜어냅니다 */}
        <img
          src="/icon-512x512.png" 
          alt="Mine Legends"
          className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-[0_0_30px_rgba(220,38,38,0.6)]"
        />

        {/* 타이틀 텍스트: 자간(tracking)을 넓혀 영화 오프닝 느낌을 줍니다 */}
        <h1 className="mt-8 text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-300 to-red-600 tracking-[0.4em] drop-shadow-[0_0_10px_rgba(255,0,0,0.5)] animate-[pulse_2s_ease-in-out_infinite]">
          포탈 이동 중...
        </h1>

        {/* 시네마틱 로딩 바 */}
        <div className="mt-8 w-56 h-1 bg-neutral-900 rounded-full overflow-hidden shadow-[0_0_15px_rgba(220,38,38,0.4)] border border-neutral-800">
          <div className="h-full bg-gradient-to-r from-red-900 via-red-500 to-red-400 animate-[loadingBar_3s_ease-in-out_forwards]"></div>
        </div>
      </div>

      {/* 이 컴포넌트 전용 커스텀 애니메이션 (Tailwind 기본에 없는 디테일한 움직임) */}
      <style>{`
        @keyframes zoomIn {
          0% { transform: scale(0.85); opacity: 0; filter: brightness(0.5); }
          20% { opacity: 1; filter: brightness(1); }
          100% { transform: scale(1.05); opacity: 1; filter: brightness(1.2); }
        }
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
