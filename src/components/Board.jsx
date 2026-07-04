import React, { useRef } from 'react';
import { GAME_CONFIG } from '../utils/gameLogic';

export default function Board({ board, onCellClick, onCellRightClick, dungeon }) {
  
  const isFire = dungeon === 'fire';
  
  // 💡 [추가] 롱프레스 타이머와 상태를 관리하기 위한 Ref
  const timerRef = useRef(null);
  const isLongPress = useRef(false);

  // 💡 [추가] 화면에 손가락이 닿는 순간 실행 (250ms 타이머 시작)
  const handleTouchStart = (r, c) => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      onCellRightClick(r, c); // 250ms가 지나면 즉시 방패 꽂기
      
      // 모바일 기기에서 진동 피드백이 지원된다면 톡! 하는 손맛 추가 (선택 사항)
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }, 250); // ✨ 바로 이 숫자로 롱프레스 반응 속도를 조절합니다! (0.25초)
  };

  // 💡 [추가] 손가락을 떼거나 화면을 스크롤(Move)하면 방패 타이머 취소
  const handleTouchCancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  // 💡 [추가] 롱프레스로 방패를 꽂은 직후에 실수로 칸이 까이는 것을 방지
  const handleClick = (e, r, c) => {
    if (isLongPress.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onCellClick(r, c);
  };

  const renderCellContent = (cell) => {
    if (cell.isRevealed) {
      if (cell.isMine) {
        return isFire 
          ? <img 
              src="/hellofflame-mine.png" 
              alt="Devil Eye Mine" 
              className="w-[85%] h-[85%] object-contain drop-shadow-[0_0_15px_rgba(220,38,38,1)] animate-pulse" 
            />
          : <span className="drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]">🦑</span>;
      }
      return '';
    }
    if (cell.isFlagged) {
      return (
        <img 
          src="/holyshield-icon.png" 
          alt="Holy Shield Flag" 
          className="w-4/5 h-4/5 object-contain drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] animate-pulse" 
        />
      );
    }
    return '';
  };

  return (
    <div 
      className="grid gap-0 w-fit mx-auto"
      style={{ gridTemplateColumns: `repeat(${GAME_CONFIG.COLS}, minmax(0, 1fr))` }}
    >
      {board.map((row, r) => (
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            onClick={(e) => handleClick(e, r, c)}
            onContextMenu={(e) => { e.preventDefault(); onCellRightClick(r, c); }}
            // 💡 [추가] 모바일 터치 이벤트를 감지하여 0.25초 타이머와 연결합니다.
            onTouchStart={() => handleTouchStart(r, c)}
            onTouchEnd={handleTouchCancel}
            onTouchMove={handleTouchCancel}
            
            className={`
              w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl cursor-pointer rounded-sm transition-all duration-150 select-none bg-cover bg-center
              ${cell.isRevealed 
                ? (cell.isMine 
                    ? `bg-neutral-900 border-t border-l border-neutral-950 border-b border-r border-neutral-700 shadow-[inset_0_0_15px_rgba(0,0,0,0.9)] ${isFire ? 'bg-red-950/80 shadow-[inset_0_0_20px_rgba(220,38,38,0.8)]' : 'bg-blue-950/80 shadow-[inset_0_0_20px_rgba(37,99,235,0.8)]'}` 
                    : 'shadow-[inset_0_0_35px_rgba(0,0,0,0.95)] border border-black/80'
                  ) 
                : 'hover:brightness-125 hover:scale-105 shadow-[0_4px_6px_rgba(0,0,0,0.6)] border-t border-l border-white/10'
              }
            `}
            style={{
              backgroundImage: !cell.isRevealed 
                ? (isFire ? "url('/hellofflame-tile.png')" : "url('/hellofaqua-tile.png')") 
                : (cell.isMine ? 'none' : `url('/tile${cell.neighborMines}.png')`)
            }}
          >
            {renderCellContent(cell)}
          </div>
        ))
      ))}
    </div>
  );
}
