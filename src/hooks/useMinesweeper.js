import { useState, useEffect, useCallback, useRef } from 'react';
import { GAME_CONFIG, createEmptyBoard, cloneBoard, placeMinesAndCalculate, revealEmptyCells, checkWinCondition, getMineCount } from '../utils/gameLogic';
// 💡 파이어베이스에서 데이터를 읽어오기 위해 getDoc 추가
import { doc, getDoc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { calculateDungeonRewards } from '../utils/rewardUtils';
// 💡 방금 만든 레벨업 계산기 불러오기
import { processExpGain } from '../utils/expUtils';

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

  const [rewards, setRewards] = useState(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const saveGameResult = useCallback(async (isWin, clearTime) => {
    if (!user) return;
    
    // 1. 결과에 따른 보상(경험치, 골드, 아이템) 계산
    const generatedRewards = calculateDungeonRewards(dungeonName, difficultyLevel, isWin);

    const userDocRef = doc(db, 'users', user.uid);

    try {
      // 💡 2. DB에서 유저의 "현재 레벨"과 "현재 경험치"를 먼저 가져옵니다.
      const userSnap = await getDoc(userDocRef);
      if (!userSnap.exists()) return;
      
      const userData = userSnap.data();
      const currentLevel = userData.level || 1; // 없으면 1레벨
      const currentExp = userData.exp || 0;     // 없으면 0 EXP

      // 💡 3. 레벨업 계산기를 돌립니다!
      const { newLevel, newExp, hasLeveledUp } = processExpGain(currentLevel, currentExp, generatedRewards.exp);

      // 모달창 UI에 띄워주기 위해 계산된 정보들을 종합해서 상태에 저장합니다.
      setRewards({
        ...generatedRewards,
        earnedExp: generatedRewards.exp,
        hasLeveledUp: hasLeveledUp,
        newLevel: newLevel
      });

      const newRecord = {
        dungeon: `${dungeonName} (${difficultyLevel})`,
        result: isWin ? '승리' : '패배',
        time: clearTime,
        timestamp: new Date().getTime()
      };

      // 💡 4. 파이어베이스에 업데이트할 데이터 덩어리 준비
      const updateData = {
        [`stats.${isWin ? 'wins' : 'losses'}`]: increment(1),
        records: arrayUnion(newRecord),
        ['inventory.gold']: increment(generatedRewards.gold),
        level: newLevel, // 새로 계산된 레벨로 덮어쓰기
        exp: newExp      // 남은 경험치로 덮어쓰기
      };

      // 획득한 아이템 누적
      Object.entries(generatedRewards.items).forEach(([itemId, count]) => {
        updateData[`inventory.items.${itemId}`] = increment(count);
      });

      // 5. 파이어베이스 DB로 한 방에 전송!
      await updateDoc(userDocRef, updateData);
      console.log('전적, 보상 및 레벨 경험치 기록 완료!');
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
    setRewards(null); 
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
    rewards,
    setIsFlagMode, initGame, handleCellClick, toggleFlag,
    pauseTimer, resumeTimer
  };
};
