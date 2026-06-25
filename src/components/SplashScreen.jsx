import React from 'react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* 배경 연출: 심연에서 뿜어져 나오는 붉은 마나의 기운 (은은하게 깜빡임) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-950/40 via-black to-black animate-pulse"></div>

      {/* 💡 [수정됨] 줌인 애니메이션을 제거하고 위치를 고정했습니다. */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* 💡 [수정됨] 아이콘 기본 크기를 더 크게 키워서 압도적인 느낌을 줍니다. */}
        <img
          src="/icon-512x512.png" 
          alt="Mine Legends"
          className="w-40 h-40 md:w-48 md:h-48 object-contain drop-shadow-[0_0_30px_rgba(220,38,38,0.6)]"
        />

        {/* 타이틀 텍스트: 텍스트 펄스 효과는 유지 */}
        <h1 className="mt-8 text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-300 to-red-600 tracking-[0.4em] drop-shadow-[0_0_10px_rgba(255,0,0,0.5)] animate-[pulse_2s_ease-in-out_infinite]">
          포탈 이동 중...
        </h1>

        {/* 시네마틱 로딩 바 */}
        <div className="mt-8 w-56 h-1 bg-neutral-900 rounded-full overflow-hidden shadow-[0_0_15px_rgba(220,38,38,0.4)] border border-neutral-800">
          <div className="h-full bg-gradient-to-r from-red-900 via-red-500 to-red-400 animate-[loadingBar_3s_ease-in-out_forwards]"></div>
        </div>
      </div>

      {/* 💡 [수정됨] 불필요해진 zoomIn 키프레임을 삭제했습니다. */}
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
