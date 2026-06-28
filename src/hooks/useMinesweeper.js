import { useState, useEffect, useCallback, useRef } from 'react';
import { GAME_CONFIG, createEmptyBoard, cloneBoard, placeMinesAndCalculate, revealEmptyCells, checkWinCondition } from '../utils/gameLogic';

export const useMinesweeper = () => {
  const [board, setBoard] = useState([]);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [gameStatus, setGameStatus] = useState('idle');
  const [minesLeft, setMinesLeft] = useState(GAME_CONFIG.MINES);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isFlagMode, setIsFlagMode] = useState(false);

  const timerRef = useRef(null);

  const initGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setIsFirstClick(true);
    setGameStatus('idle');
    setMinesLeft(GAME_CONFIG.MINES);
    setTimeElapsed(0);
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => {
    initGame();
    return () => clearInterval(timerRef.current);
  }, [initGame]);

  const startTimer = () => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    }
  };

  // 💡 [추가] 팝업이 떴을 때 타이머를 잠시 멈추는 함수
  const pauseTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  // 💡 [추가] 팝업을 취소하고 다시 게임으로 돌아갈 때 타이머를 살리는 함수
  const resumeTimer = useCallback(() => {
    if (gameStatus === 'playing' && !timerRef.current) {
      timerRef.current = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    }
  }, [gameStatus]);

  const handleGameOver = (currentBoard) => {
    setGameStatus('lost');
    clearInterval(timerRef.current);
    currentBoard.forEach(row => row.forEach(cell => {
      if (cell.isMine) cell.isRevealed = true;
    }));
  };

  const toggleFlag = (r, c) => {
    if (gameStatus === 'won' || gameStatus === 'lost') return;
    const newBoard = cloneBoard(board);
    const cell = newBoard[r][c];
    if (cell.isRevealed) return;

    cell.isFlagged = !cell.isFlagged;
    setMinesLeft(prev => cell.isFlagged ? prev - 1 : prev + 1);
    setBoard(newBoard);
  };

  const handleCellClick = (r, c) => {
    if (gameStatus === 'won' || gameStatus === 'lost') return;
    const newBoard = cloneBoard(board);
    const cell = newBoard[r][c];

    if (cell.isRevealed) return;
    
    if (isFlagMode) {
      toggleFlag(r, c);
      return;
    }
    
    if (cell.isFlagged) return;

    if (isFirstClick) {
      setIsFirstClick(false);
      setGameStatus('playing');
      startTimer();
      placeMinesAndCalculate(newBoard, r, c);
    }

    cell.isRevealed = true;

    if (cell.isMine) {
      handleGameOver(newBoard);
    } else {
      if (cell.neighborMines === 0) revealEmptyCells(newBoard, r, c);
      if (checkWinCondition(newBoard)) {
        setGameStatus('won');
        clearInterval(timerRef.current);
      }
    }
    setBoard(newBoard);
  };

  return {
    board, gameStatus, minesLeft, timeElapsed, isFlagMode,
    setIsFlagMode, initGame, handleCellClick, toggleFlag,
    pauseTimer, resumeTimer // 💡 [추가] 새로 만든 두 함수를 밖으로 꺼내줍니다.
  };
};
