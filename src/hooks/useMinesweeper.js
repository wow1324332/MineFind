// src/hooks/useMinesweeper.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { createEmptyBoard, cloneBoard, placeMinesAndCalculate, revealEmptyCells, checkWinCondition, getMineCount } from '../utils/gameLogic';
import { doc, getDoc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { calculateDungeonRewards } from '../utils/rewardUtils';
import { processExpGain } from '../utils/expUtils';
import { DUNGEON_INFO } from '../constants/dungeonData';

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
  // 💡 상태 명칭을 명확하게 dungeonId로 변경하여 관리합니다. (기본값 'fire')
  const [dungeonId, setDungeonId] = useState('fire');

  const [rewards, setRewards] = useState(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const saveGameResult = useCallback(async (isWin, clearTime) => {
    if (!user) return;
    
    // 💡 원인 해결 핵심: 보상 계산기(calculateDungeonRewards)가 기존에 쓰던 풀네임('Hell of flame' 등)을 원하므로
    // 도감에서 현재 id에 매칭되는 진짜 이름을 찾아서 가공해 넘겨줍니다!
    const fullDungeonName = DUNGEON_INFO[dungeonId]?.name || 'Hell of flame';
    const generatedRewards = calculateDungeonRewards(fullDungeonName, difficultyLevel, isWin);

    const userDocRef = doc(db, 'users', user.uid);

    try {
      const userSnap = await getDoc(userDocRef);
      if (!userSnap.exists()) return;
      
      const userData = userSnap.data();
      const currentLevel = userData.level || 1; 
      const currentExp = userData.exp || 0;     

      const { newLevel, newExp, hasLeveledUp } = processExpGain(currentLevel, currentExp, generatedRewards.exp);

      setRewards({
        ...generatedRewards,
        earnedExp: generatedRewards.exp,
        hasLeveledUp: hasLeveledUp,
        newLevel: newLevel
      });

      const newRecord = {
        dungeon: `${fullDungeonName} (${difficultyLevel})`,
        result: isWin ? '승리' : '패배',
        time: clearTime,
        timestamp: new Date().getTime()
      };

      const updateData = {
        [`stats.${isWin ? 'wins' : 'losses'}`]: increment(1),
        records: arrayUnion(newRecord),
        ['inventory.gold']: increment(generatedRewards.gold),
        level: newLevel, 
        exp: newExp      
      };

      Object.entries(generatedRewards.items).forEach(([itemId, count]) => {
        updateData[`inventory.items.${itemId}`] = increment(count);
      });

      await updateDoc(userDocRef, updateData);
      console.log('전적, 보상 및 레벨 경험치 기록 완료!');
    } catch (error) {
      console.error('기록 저장 실패:', error);
    }
  }, [user, dungeonId, difficultyLevel]);

  const initGame = useCallback((newDifficulty, newDungeonId) => {
    const targetDifficulty = newDifficulty || difficultyLevel;
    const targetDungeonId = newDungeonId || dungeonId;
    if (newDifficulty) setDifficultyLevel(newDifficulty);
    if (newDungeonId) setDungeonId(newDungeonId);

    // 던전 ID를 기반으로 레이아웃 불러오기
    const mapLayout = DUNGEON_INFO[targetDungeonId]?.layout || Array(10).fill(Array(8).fill(1));
    
    setBoard(createEmptyBoard(mapLayout));
    setGameStatus('idle');
    setIsFirstClick(true);
    setMinesLeft(getMineCount(targetDifficulty)); 
    setTimeElapsed(0);
    setRewards(null); 
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, [difficultyLevel, dungeonId]);

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
    rewards,
    setIsFlagMode, initGame, handleCellClick, toggleFlag,
    pauseTimer, resumeTimer
  };
};
