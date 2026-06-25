// src/App.jsx
import React, { useState, useEffect } from 'react';
import { useMinesweeper } from './hooks/useMinesweeper';
import Header from './components/Header';
import Board from './components/Board';
import Controls from './components/Controls';
import LoginModal from './components/LoginModal';
import SplashScreen from './components/SplashScreen';
import HuntList from './components/HuntList';
import ModeSelection from './components/ModeSelection';
import { useAuth } from './hooks/useAuth';

// 💡 [핵심 섹션화] 로딩 화면 설정 메뉴판 (여기만 수정하면 모든 로딩 화면이 통제됩니다)
const SPLASH_CONFIG = {
  INITIAL: {
    message: "Transfer...",
    logoSrc: "/Splash-logo.jpg",
    bgSrc: null
  },
  HUNT_LIST_LOADING: {
    message: "Opening Hunt List...",
    logoSrc: "/Splash-logo.jpg",
    bgSrc: null
  },
  MODE_LOADING: {
    message: "Unsealing Devil Mine...",
    logoSrc: "/Splash-logo.jpg",
    bgSrc: "/stone-tablet.jpg" // 석판 배경 스포일러
  },
  GAME_LOADING: {
    message: "Generating Devil's Dungeon...",
    logoSrc: "/Splash-logo.jpg",
    bgSrc: "/stone-tablet.jpg" // 석판 배경 유지
  }
};

export default function App() {
  const { user, loading, logout } = useAuth();
  const { 
    board, gameStatus, minesLeft, timeElapsed, isFlagMode, 
    setIsFlagMode, initGame, handleCellClick, toggleFlag 
  } = useMinesweeper();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  // 'HUNT_LIST_LOADING' | 'HUNT_LIST' | 'MODE_LOADING' | 'MODE_SELECTION' | 'GAME_LOADING' | 'GAME_PVE'
  const [currentScreen, setCurrentScreen] = useState('HUNT_LIST_LOADING');

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // 앱 최초 구동 3초 타이머
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // 로그인 완료 상태에 따른 화면 이동
  useEffect(() => {
    if (user && currentScreen === 'HUNT_LIST_LOADING') {
      const timer = setTimeout(() => {
        setCurrentScreen('HUNT_LIST');
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (!user) setCurrentScreen('HUNT_LIST_LOADING');
  }, [user, currentScreen]);

  const handleSelectDevilMine = () => {
    setCurrentScreen('MODE_LOADING');
    setTimeout(() => setCurrentScreen('MODE_SELECTION'), 2000);
  };

  const handleSelectPVE = () => {
    setCurrentScreen('GAME_LOADING');
    setTimeout(() => setCurrentScreen('GAME_PVE'), 2000);
  };

  // ==========================================
  // 🎬 화면 렌더링 (라우팅) 섹션
  // ==========================================

  // 1. 앱 최초 켜질 때 스플래시 (INITIAL 메뉴 사용)
  if (loading || showSplash) {
    return <SplashScreen {...SPLASH_CONFIG.INITIAL} />;
  }

  // 2. 로그인 미완료 시 로그인 모달 고정
  if (!user) {
    return <LoginModal deferredPrompt={deferredPrompt} handleInstallClick={handleInstallClick} />;
  }

  // 💡 3. '현재 상태'가 로딩 상태(_LOADING)라면, 메뉴판에서 해당 설정을 찾아 띄워줍니다.
  if (currentScreen.endsWith('_LOADING')) {
    const config = SPLASH_CONFIG[currentScreen];
    return <SplashScreen {...config} />;
  }

  // 4. 일반 화면 (로딩이 아닌 진짜 화면들)
  switch (currentScreen) {
    case 'HUNT_LIST':
      return <HuntList onSelectDevilMine={handleSelectDevilMine} />;
    
    case 'MODE_SELECTION':
      return <ModeSelection onSelectPVE={handleSelectPVE} onBack={() => setCurrentScreen('HUNT_LIST')} />;
    
    case 'GAME_PVE':
      return (
        <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4 select-none touch-manipulation">
          {/* 유저 정보 및 로그아웃 버튼 */}
          <div className="w-full max-w-full sm:max-w-md flex justify-between items-center mb-3 px-2 text-neutral-400 font-semibold">
            <span className="text-sm truncate mr-4">정화자: {user.email}</span>
            <button 
              onClick={logout} 
              className="text-xs bg-neutral-800 border border-neutral-600 px-3 py-1.5 rounded-lg hover:bg-neutral-700 active:scale-95 transition-all"
            >
              포탈 이탈
            </button>
          </div>

          <div className="bg-neutral-800 p-4 sm:p-6 rounded-2xl shadow-2xl max-w-full border border-neutral-700">
            <Header minesLeft={minesLeft} gameStatus={gameStatus} timeElapsed={timeElapsed} onReset={initGame} />
            <Board board={board} onCellClick={handleCellClick} onCellRightClick={toggleFlag} />
            <Controls isFlagMode={isFlagMode} setIsFlagMode={setIsFlagMode} />
            {(gameStatus === 'won' || gameStatus === 'lost') && (
              <div className="mt-4 text-center font-bold text-lg animate-bounce">
                {gameStatus === 'won' ? (
                  <span className="text-teal-400 drop-shadow-md">🎉 던전을 완벽히 정화했습니다! 🎉</span>
                ) : (
                  <span className="text-red-500 drop-shadow-md">💥 악마의 정수와 접촉했습니다! 💥</span>
                )}
              </div>
            )}
          </div>
        </div>
      );
    
    default:
      return null;
  }
}
