import React, { useRef } from 'react';
import { GAME_CONFIG } from '../utils/gameLogic';

export default function Board({ board, onCellClick, onCellRightClick, dungeon }) {
  
  const isFire = dungeon === 'fire';
  
  // 💡 모바일 브라우저의 이중 작동을 막기 위한 정밀 가드 시스템
  const timerRef = useRef(null);
  const isLongPress = useRef(false);
  const ignoreContextMenu = useRef(false);

  // 💡 1. 손가락이 닿는 순간 0.25초 타이머 시작
  const handleTouchStart = (r, c) => {
    isLongPress.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      ignoreContextMenu.current = true; // 🚨 중요: 뒤따라올 브라우저 자체 우클릭 신호를 무시하라고 깃발을 올립니다.
      onCellRightClick(r, c); // 방패 꽂기 (ON)
      
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(40); // 쫀득한 진동 피드백
      }
    }, 250); // 0.25초 롱프레스 인식
  };

  // 💡 2. 손가락을 떼었을 때 처리
  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // 롱프레스가 이미 성공했다면, 아주 잠깐 동안 롱프레스 상태를 유지시켜서
    // 손을 뗄 때 발생하는 잔상 클릭 이벤트가 칸을 터뜨리지 못하게 방어합니다.
    if (isLongPress.current) {
      setTimeout(() => {
        isLongPress.current = false;
      }, 200);
    }
  };

  // 💡 3. 손가락을 댄 채로 화면을 움직이면(스크롤 등) 타이머 취소
  const handleTouchMove = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
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
            // 💡 일반 클릭 시, 롱프레스 직후에 들어오는 가짜 클릭 신호라면 이벤트를 버립니다.
            onClick={(e) => {
              if (isLongPress.current) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
              onCellClick(r, c);
            }}
            // 💡 브라우저 우클릭 시, 롱프레스로 인해 발생한 중복 신호라면 이벤트를 버려 깜빡임을 막습니다.
            onContextMenu={(e) => {
              e.preventDefault();
              if (ignoreContextMenu.current) {
                ignoreContextMenu.current = false; // 가드 해제
                return;
              }
              onCellRightClick(r, c);
            }}
            
            // 💡 모바일 터치 이벤트 연결 완료
            onTouchStart={() => handleTouchStart(r, c)}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            
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
