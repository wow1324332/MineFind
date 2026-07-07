import { useState, useEffect, useCallback, useRef } from 'react';
import { GAME_CONFIG, createEmptyBoard, cloneBoard, placeMinesAndCalculate, revealEmptyCells, checkWinCondition, getMineCount } from '../utils/gameLogic';
import { doc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
// 💡 방금 만든 보상 계산기 가져오기
import { calculateDungeonRewards } from '../utils/rewardUtils';

export const useMinesweeper = () => {
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
  const [dungeonName, setDungeonName] = useState('Hell of flame');

  // 💡 모달창에 띄워주기 위해 획득한 보상 정보를 저장할 상태 추가
  const [rewards, setRewards] = useState(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // 💡 파이어베이스에 게임 결과 + 획득 보상을 영구 저장하는 함수로 업그레이드!
  const saveGameResult = useCallback(async (isWin, clearTime) => {
    if (!user) return;
    
    // 1. 결과에 따른 보상(골드, 아이템) 계산
    const generatedRewards = calculateDungeonRewards(dungeonName, difficultyLevel, isWin);
    setRewards(generatedRewards); // UI(모달창)에서 보여주기 위해 상태에 저장

    const userDocRef = doc(db, 'users', user.uid);
    const newRecord = {
      dungeon: `${dungeonName} (${difficultyLevel})`,
      result: isWin ? '승리' : '패배',
      time: clearTime,
      timestamp: new Date().getTime()
    };

    // 2. 파이어베이스에 업데이트할 데이터 덩어리 준비
    const updateData = {
      [`stats.${isWin ? 'wins' : 'losses'}`]: increment(1),
      records: arrayUnion(newRecord),
      // 💡 획득한 골드를 기존 골드에 누적 합산 (increment 사용)
      ['inventory.gold']: increment(generatedRewards.gold)
    };

    // 3. 획득한 아이템들도 수량만큼 누적 합산되도록 데이터 덩어리에 추가
    Object.entries(generatedRewards.items).forEach(([itemId, count]) => {
      updateData[`inventory.items.${itemId}`] = increment(count);
    });

    try {
      // 4. 파이어베이스 DB로 한 방에 전송!
      await updateDoc(userDocRef, updateData);
      console.log('전적 및 보상 기록 완료!', generatedRewards);
    } catch (error) {
      console.error('기록 저장 실패:', error);
    }
  }, [user, dungeonName, difficultyLevel]);

  const initGame = useCallback((newDifficulty, newDungeonName) => {
    const targetDifficulty = newDifficulty || difficultyLevel;
    if (newDifficulty) setDifficultyLevel(newDifficulty);
    if (newDungeonName) setDungeonName(newDungeonName);

    setBoard(createEmptyBoard());
    setGameStatus('idle');
    setIsFirstClick(true);
    setMinesLeft(getMineCount(targetDifficulty)); 
    setTimeElapsed(0);
    setRewards(null); // 💡 새 게임 시작 시 이전 보상 초기화
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
    rewards, // 💡 새로 추가된 보상 데이터를 밖으로 내보내줌!
    setIsFlagMode, initGame, handleCellClick, toggleFlag,
    pauseTimer, resumeTimer
  };
};
