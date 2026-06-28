import React from 'react';
import { GAME_CONFIG } from '../utils/gameLogic';

export default function Board({ board, onCellClick, onCellRightClick }) {
  const renderCellContent = (cell) => {
    if (cell.isRevealed) {
      if (cell.isMine) return <span className="drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">👿</span>;
      if (cell.neighborMines > 0) {
        // 💡 숫자를 다크 판타지 마법진 느낌의 빛나는 색상으로 변경
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
    if (cell.isFlagged) return <span className="drop-shadow-[0_0_5px_rgba(56,189,248,0.8)] text-xl">💠</span>;
    return '';
  };

  return (
    <div 
      className="grid gap-1 bg-neutral-900 p-3 rounded-xl border-4 border-neutral-800 shadow-[inset_0_0_20px_rgba(0,0,0,1)]"
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
                ? 'bg-neutral-900 border-t border-l border-neutral-950 border-b border-r border-neutral-700 shadow-[inset_0_0_15px_rgba(0,0,0,0.9)]' 
                : 'bg-neutral-700 border-t-2 border-l-2 border-neutral-500 border-b-2 border-r-2 border-neutral-900 hover:brightness-110 shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
              }
              ${cell.isRevealed && cell.isMine ? 'bg-red-950/80 shadow-[inset_0_0_20px_rgba(220,38,38,0.8)]' : ''}
            `}
          >
            {renderCellContent(cell)}
          </div>
        ))
      ))}
    </div>
  );
}
