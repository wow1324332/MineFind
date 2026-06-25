import React from 'react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* 배경 연출: 새로운 로고가 돋보이도록 붉은색 대신 아주 은은한 심연의 어둠으로 변경 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/60 via-black to-black animate-pulse"></div>

      {/* 중앙 요소 컨테이너 (흔들림 없이 묵직하게 고정) */}
      <div className="relative z-10 flex flex-col items-center w-full px-6">
        
        {/* 💡 새로운 로고 적용 (가로형 로고에 맞게 반응형 너비 설정)
            JPG 이미지의 검은 배경이 앱의 배경과 자연스럽게 하나가 되도록 drop-shadow를 제거했습니다. */}
        <img
          src="/Splash-logo.jpg" 
          alt="Mine Legends"
          className="w-full max-w-xs md:max-w-md lg:max-w-lg h-auto object-contain"
        />

        {/* 타이틀 텍스트: 로고 하단의 신비로운 룬 문자 색상(보라/청백색)과 일치시켰습니다. */}
        <h1 className="mt-8 text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-300 to-purple-600 tracking-[0.5em] animate-[pulse_2s_ease-in-out_infinite] drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
          포탈 이동 중...
        </h1>

        {/* 시네마틱 로딩 바: 원소들의 색상(불, 얼음, 마법)이 흐르는 듯한 그라데이션 연출 */}
        <div className="mt-10 w-64 h-1 bg-neutral-900 rounded-full overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.3)] border border-neutral-800">
          <div className="h-full bg-gradient-to-r from-orange-600 via-cyan-400 to-purple-500 animate-[loadingBar_3s_ease-in-out_forwards]"></div>
        </div>
      </div>

      {/* 로딩 바가 차오르는 시네마틱 애니메이션 */}
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
