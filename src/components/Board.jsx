import React, { useRef } from 'react';
import { GAME_CONFIG } from '../utils/gameLogic';
// 💡 전역 던전 데이터 연동
import { DUNGEON_INFO } from '../constants/dungeonData';

export default function Board({ board, onCellClick, onCellRightClick, dungeon }) {
  
  // 💡 현재 입장한 던전의 실시간 고유 데이터 확보
  const currentDungeonInfo = DUNGEON_INFO[dungeon];
  
  // 💡 모바일 브라우저의 이중 작동을 막기 위한 정밀 가드 시스템
  const timerRef = useRef(null);
  const isLongPress = useRef(false);
  const ignoreContextMenu = useRef(false);

  // 손가락이 닿는 순간 0.25초 타이머 시작
  const handleTouchStart = (r, c) => {
    isLongPress.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      ignoreContextMenu.current = true;
      onCellRightClick(r, c); // 방패 꽂기 (ON)
      
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(40); // 쫀득한 진동 피드백
      }
    }, 250);
  };

  // 손가락을 떼었을 때 처리
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

  // 손가락을 댄 채로 화면을 움직이면 타이머 취소
  const handleTouchMove = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const renderCellContent = (cell) => {
    if (cell.isRevealed) {
      if (cell.isMine) {
        // 💡 하드코딩 완전 제거: 데이터에 등록된 지뢰 이미지와 고유 그림자 효과를 동적으로 바인딩
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
              w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl cursor-pointer rounded-sm transition-all duration-150 select-none bg-cover bg-center
              ${cell.isRevealed 
                ? (cell.isMine 
                    // 💡 지뢰 폭발 시 배경 색상 조합도 데이터 파일에서 동적으로 로드
                    ? `bg-neutral-900 border-t border-l border-neutral-950 border-b border-r border-neutral-700 ${currentDungeonInfo?.revealedMineBg || 'bg-red-950/80 shadow-[inset_0_0_20px_rgba(220,38,38,0.8)]'}` 
                    : 'shadow-[inset_0_0_35px_rgba(0,0,0,0.95)] border border-black/80'
                  ) 
                : 'hover:brightness-125 hover:scale-105 shadow-[0_4px_6px_rgba(0,0,0,0.6)] border-t border-l border-white/10'
              }
            `}
            style={{
              // 💡 닫힌 타일의 겉면 이미지 경로 역시 데이터 창고에서 일괄 자동 처리!
              backgroundImage: !cell.isRevealed 
                ? `url('${currentDungeonInfo?.tileImg || "/hellofflame-tile.png"}')` 
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
