import React from 'react';
import { GAME_CONFIG } from '../utils/gameLogic';

export default function Board({ board, onCellClick, onCellRightClick }) {
  const renderCellContent = (cell) => {
    if (cell.isRevealed) {
      if (cell.isMine) return '💣';
      if (cell.neighborMines > 0) {
        const colors = ['', 'text-blue-500', 'text-green-600', 'text-red-500', 'text-purple-600', 'text-yellow-600', 'text-teal-500', 'text-black', 'text-gray-600'];
        return <span className={`font-bold ${colors[cell.neighborMines]}`}>{cell.neighborMines}</span>;
      }
      return '';
    }
    if (cell.isFlagged) return '🚩';
    return '';
  };

  return (
    <div 
      className="grid gap-1 bg-neutral-300 p-2 rounded-xl"
      style={{ gridTemplateColumns: `repeat(${GAME_CONFIG.COLS}, minmax(0, 1fr))` }}
    >
      {board.map((row, r) => (
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            onClick={() => onCellClick(r, c)}
            onContextMenu={(e) => { e.preventDefault(); onCellRightClick(r, c); }}
            className={`
              w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl cursor-pointer rounded-sm
              ${cell.isRevealed 
                ? 'bg-neutral-100 border border-neutral-300'
                : 'bg-neutral-400 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-neutral-500 hover:bg-neutral-300'
              }
              ${cell.isRevealed && cell.isMine ? 'bg-red-200' : ''}
            `}
          >
            {renderCellContent(cell)}
          </div>
        ))
      ))}
    </div>
  );
}
