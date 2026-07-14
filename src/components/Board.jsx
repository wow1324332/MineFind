// src/components/Board.jsx
import React, { useRef } from 'react';
import { DUNGEON_INFO } from '../constants/dungeonData';

export default function Board({ board, onCellClick, onCellRightClick, dungeon }) {
  
  const currentDungeonInfo = DUNGEON_INFO[dungeon];
  // 💡 던전 데이터가 로드되기 전의 안전장치
  const colsCount = board.length > 0 ? board[0].length : 8;

  const timerRef = useRef(null);
  const isLongPress = useRef(false);
  const ignoreContextMenu = useRef(false);

  const handleTouchStart = (r, c) => {
    isLongPress.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      ignoreContextMenu.current = true;
      onCellRightClick(r, c); 
      
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(40); 
      }
    }, 250);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (isLongPress.current) {
      setTimeout(() => {
        isLongPress.current = false;
      }, 200);
    }
  };

  const handleTouchMove = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const renderCellContent = (cell) => {
    if (cell.isRevealed) {
      if (cell.isMine) {
        return (
          <img 
            src={currentDungeonInfo?.mineImg || "/hellofflame-mine.png"} 
            alt="Dungeon Mine" 
            className={`w-[85%] h-[85%] object-contain animate-pulse ${currentDungeonInfo?.mineShadow || 'drop-shadow-[0_0_15px_rgba(220,38,38,1)]'}`} 
          />
        );
      }
      return '';
    }
    if (cell.isFlagged) {
      return (
        <img 
          src="/dungeons/holyshield-icon.webp" 
          alt="Holy Shield Flag" 
          className="w-4/5 h-4/5 object-contain drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] animate-pulse" 
        />
      );
    }
    return '';
  };

return (
    /* 💡 수정 1: flex justify-center 제거 (화면보다 커질 때 좌측 스크롤 짤림 방지) */
    <div className="w-full max-h-[60vh] overflow-auto py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      
      {/* 💡 수정 2: w-fit 대신 w-max 적용 (컨텐츠 크기만큼 무조건 늘어나도록 허용) */}
      <div 
        className="grid gap-0 w-max mx-auto transition-all duration-300"
        style={{ gridTemplateColumns: `repeat(${colsCount}, minmax(0, 1fr))` }}
      >
        {board.map((row, r) => (
          row.map((cell, c) => {
            // 투명 타일 처리
            if (!cell.isPlayable) {
              return (
                <div 
                  key={`${r}-${c}`}
                  // 💡 수정 3: shrink-0 추가 (억지로 찌그러짐 방지)
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-transparent pointer-events-none shrink-0" 
                />
              );
            }

            // 실제 밟을 수 있는 타일
            return (
              <div
                key={`${r}-${c}`}
                onClick={(e) => {
                  if (isLongPress.current) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                  }
                  onCellClick(r, c);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (ignoreContextMenu.current) {
                    ignoreContextMenu.current = false;
                    return;
                  }
                  onCellRightClick(r, c);
                }}
                onTouchStart={() => handleTouchStart(r, c)}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                className={`
                  /* 💡 수정 3: shrink-0 추가 (억지로 찌그러짐 방지) */
                  w-10 h-10 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center text-xl sm:text-2xl cursor-pointer rounded-sm transition-all duration-150 select-none bg-cover bg-center
                  ${cell.isRevealed 
                    ? (cell.isMine 
                        ? `bg-neutral-900 border-t border-l border-neutral-950 border-b border-r border-neutral-700 ${currentDungeonInfo?.revealedMineBg || 'bg-red-950/80 shadow-[inset_0_0_20px_rgba(220,38,38,0.8)]'}` 
                        : 'shadow-[inset_0_0_35px_rgba(0,0,0,0.95)] border border-black/80'
                      ) 
                    : 'hover:brightness-125 hover:scale-105 shadow-[0_4px_6px_rgba(0,0,0,0.6)] border-t border-l border-white/10'
                  }
                `}
                style={{
                  backgroundImage: !cell.isRevealed 
                    ? `url('${currentDungeonInfo?.tileImg || "/hellofflame-tile.webp"}')` 
                    : (cell.isMine ? 'none' : `url('/dungeons/tile${cell.neighborMines}.webp')`)
                }}
              >
                {renderCellContent(cell)}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
}
