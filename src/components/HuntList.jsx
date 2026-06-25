import React from 'react';

export default function HuntList({ onSelectDevilMine }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6 select-none">
      {/* 상단 타이틀 영역 */}
      <div className="mt-12 mb-10 text-center">
        <h1 className="text-3xl font-black tracking-[0.6em] text-transparent bg-clip-text bg-gradient-to-b from-yellow-500 to-amber-700 drop-shadow-[0_2px_10px_rgba(217,119,6,0.3)]">
          HUNT LIST
        </h1>
        <p className="text-xs text-neutral-500 tracking-[0.2em] mt-2">정화할 던전을 선택하십시오</p>
      </div>

      {/* 던전 카드 목록 리스트 */}
      <div className="w-full max-w-sm space-y-4">
        
        {/* 1. 활성화된 지뢰찾기 던전 (Devil Mine) */}
        <button
          onClick={onSelectDevilMine}
          className="w-full bg-neutral-900/60 border border-amber-600/30 rounded-xl p-5 text-left transition-all hover:border-amber-500 hover:bg-neutral-900 shadow-lg active:scale-[0.98] relative overflow-hidden group"
        >
          {/* 우측 은은한 불꽃 효과 */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-orange-600/10 to-transparent pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-500 font-bold tracking-widest uppercase">Available Dungeon</span>
              <h2 className="text-xl font-black text-neutral-200 mt-0.5 group-hover:text-white transition-colors">
                👿 Devil Mine
              </h2>
              <p className="text-xs text-neutral-400 mt-2">고대 악마의 정수가 도사리는 지뢰 구역 정화</p>
            </div>
            <span className="text-xl text-amber-500 group-hover:translate-x-1 transition-transform">▶</span>
          </div>
        </button>

        {/* 2. 잠겨있는 미래의 던전 슬롯 (확장성 고려) */}
        <div className="w-full bg-neutral-950 border border-neutral-800/50 rounded-xl p-5 text-left opacity-40 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-neutral-500 font-bold tracking-widest uppercase">Locked</span>
              <h2 className="text-xl font-black text-neutral-500 mt-0.5">
                🔒 Unknown Abyss
              </h2>
              <p className="text-xs text-neutral-600 mt-2">아직 포탈이 개방되지 않은 심연의 던전</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
