import { useState, useEffect, useCallback } from 'react';
import { doc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

export const useMinesweeper = (rows = 9, cols = 9, mines = 10, dungeonName = "초급 광산") => {
  const { user } = useAuth();
  
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    let interval = null;
    if (isTimerActive && !gameOver && !gameWon) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, gameOver, gameWon]);

  const saveGameResult = useCallback(async (isWin, clearTime) => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    const newRecord = {
      dungeon: dungeonName,
      result: isWin ? '승리' : '패배',
      time: clearTime,
      timestamp: new Date().getTime()
    };

    try {
      await updateDoc(userDocRef, {
        [`stats.${isWin ? 'wins' : 'losses'}`]: increment(1),
        records: arrayUnion(newRecord)
      });
    } catch (error) {
      console.error('전적 저장 실패:', error);
    }
  }, [user, dungeonName]);

  const resetGame = useCallback(() => {
    let newBoard = Array(rows).fill(null).map((_, r) =>
      Array(cols).fill(null).map((_, c) => ({
        row: r,
        col: c,
        isMine: false,
        isOpened: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (!newBoard[r][c].isMine) {
        newBoard[r][c].isMine = true;
        minesPlaced++;
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (newBoard[r][c].isMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].isMine) {
              count++;
            }
          }
        }
        newBoard[r][c].neighborMines = count;
      }
    }

    setBoard(newBoard);
    setGameOver(false);
    setGameWon(false);
    setTimer(0);
    setIsTimerActive(false);
  }, [rows, cols, mines]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const checkWinCondition = (currentBoard) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!currentBoard[r][c].isMine && !currentBoard[r][c].isOpened) {
          return false;
        }
      }
    }
    return true;
  };

  const openEmptyCells = (currentBoard, r, c) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols || currentBoard[r][c].isOpened || currentBoard[r][c].isFlagged) return;
    
    currentBoard[r][c].isOpened = true;
    
    if (currentBoard[r][c].neighborMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          openEmptyCells(currentBoard, r + dr, c + dc);
        }
      }
    }
  };

  const handleCellClick = (r, c) => {
    if (gameOver || gameWon || board[r][c].isOpened || board[r][c].isFlagged) return;

    if (!isTimerActive) {
      setIsTimerActive(true);
    }

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const clickedCell = newBoard[r][c];

    if (clickedCell.isMine) {
      setGameOver(true);
      setIsTimerActive(false);
      
      newBoard.forEach(row => row.forEach(cell => {
        if (cell.isMine) cell.isOpened = true;
      }));
      setBoard(newBoard);

      saveGameResult(false, formatTime(timer));
      return;
    }

    if (clickedCell.neighborMines === 0) {
      openEmptyCells(newBoard, r, c);
    } else {
      clickedCell.isOpened = true;
    }

    if (checkWinCondition(newBoard)) {
      setGameWon(true);
      setIsTimerActive(false);
      setBoard(newBoard);
      
      saveGameResult(true, formatTime(timer));
      return;
    }

    setBoard(newBoard);
  };

  const handleCellRightClick = (e, r, c) => {
    e.preventDefault();
    if (gameOver || gameWon || board[r][c].isOpened) return;

    if (!isTimerActive) {
      setIsTimerActive(true);
    }

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
    setBoard(newBoard);
  };

  return {
    board,
    gameOver,
    gameWon,
    timer: formatTime(timer),
    handleCellClick,
    handleCellRightClick,
    resetGame
  };
};
