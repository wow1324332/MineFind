import { useState, useEffect, useCallback, useRef } from 'react';
import { GAME_CONFIG, createEmptyBoard, cloneBoard, placeMinesAndCalculate, revealEmptyCells, checkWinCondition, getMineCount } from '../utils/gameLogic';
import { doc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

export const useMinesweeper = () => {
  // 💡 크래시 방지용 안전 장치: useAuth()가 로딩 중이거나 undefined일 때 화면이 굳는 현상을 방지합니다.
  const auth = useAuth();
  const user = auth ? auth.user : null;

  const [board, setBoard] = useState([]);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [gameStatus, setGameStatus] = useState('idle');
  const [minesLeft, setMinesLeft] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isFlagMode, setIsFlagMode] = useState(false);
  const timerRef = useRef(null);
  const [difficultyLevel, setDifficultyLevel] = useState('Normal');

  // 시간을 "00:00" 포맷 문자열로 변환하는 헬퍼 함수
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // 선택한 난이도에 대응하는 던전 이름을 매핑합니다.
  const getDungeonName = (level) => {
    switch (level) {
      case 'Easy': return '초급 광산';
      case 'Normal': return '중급 지하묘지';
      case 'Hard': return '고급 지옥문';
      default: return `${level} 던전`;
    }
  };

  // 💡 파이어베이스에 게임 결과를 영구 저장하는 함수
  const saveGameResult = useCallback(async (isWin, clearTime) => {
    if (!user) return;
    
    const userDocRef = doc(db, 'users', user.uid);
    const newRecord = {
      dungeon: getDungeonName(difficultyLevel),
      result: isWin ? '승리' : '패배',
      time: clearTime,
      timestamp: new Date().getTime()
    };

    try {
      await updateDoc(userDocRef, {
        [`stats.${isWin ? 'wins' : 'losses'}`]: increment(1),
        records: arrayUnion(newRecord)
      });
      console.log('전적 기록 완료!');
    } catch (error) {
      console.error('전적 기록 실패:', error);
    }
  }, [user, difficultyLevel]);

  const initGame = useCallback((newDifficulty) => {
    const targetDifficulty = newDifficulty || difficultyLevel;
    if (newDifficulty) setDifficultyLevel(newDifficulty);

    setBoard(createEmptyBoard());
    setGameStatus('idle');
    setIsFirstClick(true);
    setMinesLeft(getMineCount(targetDifficulty)); 
    setTimeElapsed(0);
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, [difficultyLevel]);

  useEffect(() => {
    initGame();
    return () => clearInterval(timerRef.current);
  }, [initGame]);

  const startTimer = () => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    }
  };

  const pauseTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

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
      const totalMinesToPlace = getMineCount(difficultyLevel);
      const actualPlacedMines = placeMinesAndCalculate(newBoard, r, c, totalMinesToPlace);
      setMinesLeft(actualPlacedMines);
    }

    cell.isRevealed = true;

    // 💡 누락되었던 else 구조를 다시 정상화하고 서버 전송 시점을 명확하게 조립했습니다.
    if (cell.isMine) {
      handleGameOver(newBoard);
      saveGameResult(false, formatTime(timeElapsed));
    } else {
      if (cell.neighborMines === 0) revealEmptyCells(newBoard, r, c);
      if (checkWinCondition(newBoard)) {
        setGameStatus('won');
        clearInterval(timerRef.current);
        saveGameResult(true, formatTime(timeElapsed));
      }
    }
    setBoard(newBoard);
  };

  return {
    board, gameStatus, minesLeft, timeElapsed, isFlagMode,
    setIsFlagMode, initGame, handleCellClick, toggleFlag,
    pauseTimer, resumeTimer
  };
};
