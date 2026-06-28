// src/components/Board.jsx
import React from 'react';
import { GAME_CONFIG } from '../utils/gameLogic';

export default function Board({ board, onCellClick, onCellRightClick, dungeon }) {
  
  const isFire = dungeon === 'fire';

  const renderCellContent = (cell) => {
    // 뒤집힌 상태일 때 내용물 결정
    if (cell.isRevealed) {
      if (cell.isMine) {
        // 🔥 불 지뢰 / 💧 물 지뢰 임시 분리
        return isFire 
          ? <span className="drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">👿</span> 
          : <span className="drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]">🦑</span>;
      }
      // 💡 숫자가 있던 자리는 배경 이미지(style)로 대체되므로, 내용물은 비워둡니다.
      return '';
    }
    // 깃발(롱프레스) 상태일 때 내용물 결정
    if (cell.isFlagged) {
      // 💡 깃발 대신 성스러운 방패(holyshield.png) 이미지 출력
      return (
        <img 
          src="/holyshield.png" 
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
            onClick={() => onCellClick(r, c)}
            onContextMenu={(e) => { e.preventDefault(); onCellRightClick(r, c); }}
            className={`
              w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl cursor-pointer rounded-sm transition-all duration-150 select-none bg-cover bg-center
              ${cell.isRevealed 
                ? (cell.isMine 
                    ? `bg-neutral-900 border-t border-l border-neutral-950 border-b border-r border-neutral-700 shadow-[inset_0_0_15px_rgba(0,0,0,0.9)] ${isFire ? 'bg-red-950/80 shadow-[inset_0_0_20px_rgba(220,38,38,0.8)]' : 'bg-blue-950/80 shadow-[inset_0_0_20px_rgba(37,99,235,0.8)]'}` 
                    : '') 
                : 'hover:brightness-125 hover:scale-105 shadow-[0_4px_6px_rgba(0,0,0,0.6)]'
              }
            `}
            style={{
              backgroundImage: !cell.isRevealed 
                ? (isFire ? "url('/hellofflame-tile.png')" : "url('/hellofaqua-tile.png')") 
                : (cell.isMine ? 'none' : `url('/tile${cell.neighborMines}.jpg')`)
            }}
          >
            {renderCellContent(cell)}
          </div>
        ))
      ))}
    </div>
  );
}
