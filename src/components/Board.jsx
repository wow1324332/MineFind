// src/components/Board.jsx
import React from 'react';
import { GAME_CONFIG } from '../utils/gameLogic';

export default function Board({ board, onCellClick, onCellRightClick, dungeon }) {
  
  // 💡 던전 종류 확인용 스위치
  const isFire = dungeon === 'fire';

  const renderCellContent = (cell) => {
    if (cell.isRevealed) {
      if (cell.isMine) {
        // 🔥 불 지뢰 / 💧 물 지뢰 임시 분리 (나중에 이미지 태그로 변경 예정)
        return isFire 
          ? <span className="drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">👿</span> 
          : <span className="drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]">🦑</span>;
      }
      if (cell.neighborMines > 0) {
        const colors = [
          '', 
          'text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]', 
          'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]', 
          'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]', 
          'text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.8)]', 
          'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]', 
          'text-teal-400 drop-shadow-[0_0_5px_rgba(45,212,191,0.8)]', 
          'text-neutral-300', 
          'text-neutral-500'
        ];
        return <span className={`font-black font-serif ${colors[cell.neighborMines]}`}>{cell.neighborMines}</span>;
      }
      return '';
    }
    if (cell.isFlagged) {
      // 🔥 불 봉인석 / 💧 물 봉인석 임시 분리
      return isFire 
        ? <span className="drop-shadow-[0_0_5px_rgba(220,38,38,0.8)] text-xl">♦️</span>
        : <span className="drop-shadow-[0_0_5px_rgba(56,189,248,0.8)] text-xl">💠</span>;
    }
    return '';
  };

  return (
    <div 
      className={`grid gap-1 p-3 rounded-xl border-4 shadow-[inset_0_0_20px_rgba(0,0,0,1)] ${isFire ? 'bg-red-950 border-red-900/50' : 'bg-blue-950 border-blue-900/50'}`}
      style={{ gridTemplateColumns: `repeat(${GAME_CONFIG.COLS}, minmax(0, 1fr))` }}
    >
      {board.map((row, r) => (
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            onClick={() => onCellClick(r, c)}
            onContextMenu={(e) => { e.preventDefault(); onCellRightClick(r, c); }}
            className={`
              w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl cursor-pointer rounded-sm transition-colors duration-150 select-none
              ${cell.isRevealed 
                ? `bg-neutral-900 border-t border-l border-neutral-950 border-b border-r border-neutral-700 shadow-[inset_0_0_15px_rgba(0,0,0,0.9)]` 
                : `${isFire ? 'bg-red-900/30 border-red-800/40' : 'bg-blue-900/30 border-blue-800/40'} border-t-2 border-l-2 border-b-2 border-r-2 hover:brightness-125 shadow-[0_2px_4px_rgba(0,0,0,0.8)]`
              }
              ${cell.isRevealed && cell.isMine ? (isFire ? 'bg-red-950/80 shadow-[inset_0_0_20px_rgba(220,38,38,0.8)]' : 'bg-blue-950/80 shadow-[inset_0_0_20px_rgba(37,99,235,0.8)]') : ''}
            `}
          >
            {renderCellContent(cell)}
          </div>
        ))
      ))}
    </div>
  );
}
