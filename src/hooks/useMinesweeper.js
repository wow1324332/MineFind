// src/hooks/useMinesweeper.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { createEmptyBoard, cloneBoard, placeMinesAndCalculate, revealEmptyCells, checkWinCondition, getMineCount } from '../utils/gameLogic';
import { doc, getDoc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { calculateDungeonRewards } from '../utils/rewardUtils';
import { processExpGain } from '../utils/expUtils';
import { DUNGEON_INFO } from '../constants/dungeonData';
import { TITLE_DATABASE } from '../constants/titleData';

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
  const [dungeonId, setDungeonId] = useState('fire');
  const [rewards, setRewards] = useState(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

const saveGameResult = useCallback(async (isWin, clearTime) => {
    if (!user) return;
    
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

      // 🌟🌟🌟 업적(칭호) 달성 감시 로직 시작 🌟🌟🌟
      const unlockedTitles = userData.unlockedTitles || ['novice'];
      const newlyUnlocked = [];

      // 1. 이번 판 결과를 더했을 때의 내 '예상 통계'를 계산해 봅니다.
      const currentFireClears = (userData.stats?.clearCount_fire || 0) + (isWin && dungeonId === 'fire' ? 1 : 0);
      const currentTotalGold = (userData.inventory?.gold || 0) + generatedRewards.gold;

      // 2. 목표치에 도달했고, 아직 안 가진 칭호라면 '신규 획득 리스트'에 쏙!
      if (!unlockedTitles.includes('fire_survivor') && currentFireClears >= 10) {
        newlyUnlocked.push('fire_survivor'); // 불의 던전 10회
      }
      if (!unlockedTitles.includes('rich_goblin') && currentTotalGold >= 10000) {
        newlyUnlocked.push('rich_goblin'); // 1만 골드 달성
      }
      // 🌟🌟🌟 업적 체크 로직 끝 🌟🌟🌟

      setRewards({
        ...generatedRewards,
        earnedExp: generatedRewards.exp,
        hasLeveledUp: hasLeveledUp,
        newLevel: newLevel,
        // 💡 해금된 칭호들의 전체 데이터를 App.jsx로 보내주어 UI에 띄울 수 있게 합니다.
        newTitles: newlyUnlocked.map(id => TITLE_DATABASE[id]) 
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

      // 💡 승리했을 경우, 나중의 업적 체크를 위해 "이 던전 몇 번 깼는지"를 따로 저장!
      if (isWin) {
        updateData[`stats.clearCount_${dungeonId}`] = increment(1);
      }

      // 💡 새롭게 획득한 칭호가 있다면, 파이어베이스 내 칭호 가방에 저장!
      if (newlyUnlocked.length > 0) {
        updateData.unlockedTitles = arrayUnion(...newlyUnlocked);
      }

      Object.entries(generatedRewards.items).forEach(([itemId, count]) => {
        updateData[`inventory.items.${itemId}`] = increment(count);
      });

      await updateDoc(userDocRef, updateData);
    } catch (error) {
      console.error('기록 저장 실패:', error);
    }
  }, [user, dungeonId, difficultyLevel]);

  const initGame = useCallback((newDifficulty, newDungeonId) => {
    const targetDifficulty = newDifficulty || difficultyLevel;
    const targetDungeonId = newDungeonId || dungeonId;
    if (newDifficulty) setDifficultyLevel(newDifficulty);
    if (newDungeonId) setDungeonId(newDungeonId);

    const mapLayout = DUNGEON_INFO[targetDungeonId]?.layout || Array(10).fill(Array(8).fill(1));
    
    // 💡 1. 맵의 실제 '밟을 수 있는 타일(1)' 개수를 미리 스캔합니다.
    let playableCount = 0;
    mapLayout.forEach(row => {
      row.forEach(cell => {
        if (cell === 1) playableCount++;
      });
    });

    // 💡 2. 난이도별 요구 지뢰 수와 '최대 수용 가능량(첫 클릭 1칸 제외)' 중 작은 값을 선택해 오차를 원천 차단합니다.
    const theoreticalMines = getMineCount(targetDifficulty);
    const actualMines = Math.min(theoreticalMines, playableCount - 1);

    setBoard(createEmptyBoard(mapLayout));
    setGameStatus('idle');
    setIsFirstClick(true);
    setMinesLeft(actualMines); // 정확하게 계산된 실제 지뢰 수로 렌더링
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
      
      // 💡 3. 유저가 첫 칸을 열기 전에 미리 꽂아둔 깃발이 있다면 개수를 파악합니다.
      let flagCount = 0;
      newBoard.forEach(row => row.forEach(c => {
        if (c.isFlagged) flagCount++;
      }));
      
      // 실제 심어진 지뢰 수에서 꽂혀있는 깃발 수만큼 차감하여 덮어씁니다.
      setMinesLeft(actualPlacedMines - flagCount);
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
