import React from 'react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* 배경 연출: 심연의 어둠 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/60 via-black to-black animate-pulse"></div>

      {/* 중앙 요소 컨테이너 */}
      <div className="relative z-10 flex flex-col items-center w-full px-6">
        
        {/* 거대한 시네마틱 로고 */}
        <img
          src="/Splash-logo.jpg" 
          alt="Mine Legends"
          className="w-full max-w-xs md:max-w-md lg:max-w-lg h-auto object-contain"
        />

        {/* 💡 [수정됨] 문구 변경: "Transfer..." */}
        <h1 className="mt-8 text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-300 to-purple-600 tracking-[0.5em] animate-[pulse_2s_ease-in-out_infinite] drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
          Transfer...
        </h1>

        {/* 💡 [수정됨] 로딩 바 껍데기: 빛이 퍼져나가도록 overflow-hidden을 제거하고 relative를 추가했습니다. */}
        <div className="mt-10 w-64 h-1.5 bg-neutral-900 rounded-full border border-neutral-800 relative">
          
          {/* 💡 [수정됨] 차오르는 막대: 주변으로 보랏빛 마나가 뿜어져 나오도록 강력한 그림자(glow) 효과를 추가했습니다. */}
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
