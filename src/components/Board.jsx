// src/components/Board.jsx
import React from 'react';
import { GAME_CONFIG } from '../utils/gameLogic';

export default function Board({ board, onCellClick, onCellRightClick, dungeon }) {
  
  // 💡 던전 종류 확인용 스위치
  const isFire = dungeon === 'fire';

  const renderCellContent = (cell) => {
    if (cell.isRevealed) {
      if (cell.isMine) {
        // 🔥 불 지뢰 / 💧 물 지뢰 임시 분리
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
      className="grid gap-[2px] w-fit mx-auto"
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
                ? `bg-neutral-900 border-t border-l border-neutral-950 border-b border-r border-neutral-700 shadow-[inset_0_0_15px_rgba(0,0,0,0.9)]` 
                : `hover:brightness-125 hover:scale-105 shadow-[0_4px_6px_rgba(0,0,0,0.6)]` // 💡 오픈 전 블럭: 기존 테두리/색상 지우고 클릭 유도 효과만 남김
              }
              ${cell.isRevealed && cell.isMine ? (isFire ? 'bg-red-950/80 shadow-[inset_0_0_20px_rgba(220,38,38,0.8)]' : 'bg-blue-950/80 shadow-[inset_0_0_20px_rgba(37,99,235,0.8)]') : ''}
            `}
            style={{
              // 💡 오픈되지 않은 블럭에만 커스텀 타일 이미지를 배경으로 삽입
              backgroundImage: !cell.isRevealed 
                ? (isFire ? "url('/hellofflame-tile.png')" : "url('/hellofaqua-tile.png')") 
                : 'none'
            }}
          >
            {renderCellContent(cell)}
          </div>
        ))
      ))}
    </div>
  );
}
