import React, { useState, useEffect, useRef } from 'react';
import { useMinesweeper } from './hooks/useMinesweeper';
import Header from './components/Header';
import Board from './components/Board';
import Controls from './components/Controls';
import LoginModal from './components/LoginModal';
import SplashScreen from './components/SplashScreen';
import HuntList from './components/HuntList';
import DevilMineMode from './components/DevilMineMode';
import DungeonSelection from './components/DungeonSelection';
import { useAuth } from './hooks/useAuth';

const SPLASH_CONFIG = {
  INITIAL: {
    message: "Transfer...",
    logoSrc: "/Splash-logo.jpg",
    bgSrc: null
  },
  HUNT_LIST_LOADING: {
    message: "Loading...",
    logoSrc: "/huntlistloading-logo.png",
    bgSrc: "/huntlist-bg.jpg",
    bgOpacity: "opacity-70",
    disablePulse: true,
    useFadeIn: true
  },
  MODE_LOADING: {
    message: "Loading...",
    logoSrc: "/huntlistloading-logo.png",
    bgSrc: "/devilmineloading-bg.jpg",
    bgOpacity: "opacity-90",
    disablePulse: true,
    useFadeIn: true
  },
  GAME_LOADING: {
    message: "Loading...",
    logoSrc: "/huntlistloading-logo.png",
    bgSrc: "/devilmineloading-bg.jpg",
    bgOpacity: "opacity-70",
    disablePulse: true,
    useFadeIn: true
  },
  DUNGEON_SELECT_LOADING: {
    message: "던전 탐색 중...",
    logoSrc: "/hunting-bt.png",
    bgSrc: "/dungeonselectionloading-bg.jpg",
    bgOpacity: "opacity-70",
    disablePulse: true,
    useFadeIn: true
  },
  FIRE_DUNGEON_LOADING: {
    message: "불의 던전으로 강습 중...",
    logoSrc: "/huntlistloading-logo.png", 
    bgSrc: "/hellofflameloading-bg.jpg", 
    bgOpacity: "opacity-70",
    disablePulse: true,
    useFadeIn: true
  },
  WATER_DUNGEON_LOADING: {
    message: "물의 던전으로 잠수 중...",
    logoSrc: "/huntlistloading-logo.png", 
    bgSrc: "/devilmineloading-bg.jpg", 
    bgOpacity: "opacity-90",
    disablePulse: true,
    useFadeIn: true
  },
};

export default function App() {
  const { user, loading, logout } = useAuth();
  const { 
    board, gameStatus, minesLeft, timeElapsed, isFlagMode, 
    setIsFlagMode, initGame, handleCellClick, toggleFlag,
    pauseTimer, resumeTimer
  } = useMinesweeper();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('HUNT_LIST_LOADING');
  const [currentDungeon, setCurrentDungeon] = useState('fire'); 
  const [showExitPopup, setShowExitPopup] = useState(false);

  const startupLoggedOut = useRef(false);

  useEffect(() => {
    if (!startupLoggedOut.current) {
      logout();
      startupLoggedOut.current = true;
    }
  }, [logout]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const [showToast, setShowToast] = useState(false);
  const lastBackPressTime = useRef(0);
  const toastTimer = useRef(null);

  useEffect(() => {
    const pushFakeState = () => {
      window.history.pushState({ trap: true }, null, window.location.href);
    };
    pushFakeState();

    const handlePopState = (e) => {
      const currentTime = new Date().getTime();
      if (currentTime - lastBackPressTime.current < 2000) {
        window.removeEventListener('popstate', handlePopState);
        window.history.back(); 
      } else {
        pushFakeState();
        lastBackPressTime.current = currentTime;
        setShowToast(true);
        if (navigator.vibrate) navigator.vibrate(200);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => {
          setShowToast(false);
        }, 3000);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    if (user && currentScreen === 'HUNT_LIST_LOADING') {
      const timer = setTimeout(() => {
        setCurrentScreen('HUNT_LIST');
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (!user) setCurrentScreen('HUNT_LIST_LOADING');
  }, [user, currentScreen]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') console.log('PWA 설치 완료');
      setDeferredPrompt(null);
    }
  };

  const handleSelectDevilMine = () => {
    setCurrentScreen('MODE_LOADING');
    setTimeout(() => setCurrentScreen('DEVIL_MINE_MODE'), 2000); 
  };

  const handleSelectPVE = () => {
    setCurrentScreen('DUNGEON_SELECT_LOADING');
    setTimeout(() => setCurrentScreen('DUNGEON_SELECTION'), 2000);
  };

  const handleSelectDungeon = (dungeonId) => {
    initGame();
    setCurrentDungeon(dungeonId); 
    if (dungeonId === 'fire') {
      setCurrentScreen('FIRE_DUNGEON_LOADING');
    } else if (dungeonId === 'water') {
      setCurrentScreen('WATER_DUNGEON_LOADING');
    } else {
      setCurrentScreen('GAME_LOADING');
    }
    setTimeout(() => setCurrentScreen('GAME_PVE'), 2000);
  };

  if (loading || showSplash) {
    return <SplashScreen {...SPLASH_CONFIG.INITIAL} />;
  }

  if (!user) {
    return <LoginModal deferredPrompt={deferredPrompt} handleInstallClick={handleInstallClick} />;
  }

  if (currentScreen.endsWith('_LOADING')) {
    const config = SPLASH_CONFIG[currentScreen] || SPLASH_CONFIG.GAME_LOADING;
    return <SplashScreen {...config} />;
  }

  let currentView = null;
  switch (currentScreen) {
    case 'HUNT_LIST':
      currentView = <HuntList onSelectDevilMine={handleSelectDevilMine} onLogout={logout} />;
      break;
    
    case 'DEVIL_MINE_MODE':
      currentView = <DevilMineMode onSelectPVE={handleSelectPVE} onBack={() => setCurrentScreen('HUNT_LIST')} onLogout={logout} />;
      break;

    case 'DUNGEON_SELECTION':
      currentView = <DungeonSelection onSelectDungeon={handleSelectDungeon} onBack={() => setCurrentScreen('DEVIL_MINE_MODE')} onLogout={logout} />;
      break;
      
    case 'GAME_PVE':
      currentView = (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 select-none touch-manipulation">
          
          {/* 💡 [추가] 게임 화면 최상단 타이틀 이미지 (벽돌 헤더 위쪽) */}
          <div className="w-full max-w-sm flex justify-center mb-4 relative z-10 drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]">
            <img 
              src={currentDungeon === 'fire' ? "/hellofflame-title.jpg" : "/hellofaqua-title.jpg"} 
              alt="Dungeon Title" 
              className="w-full object-contain"
              draggable="false"
            />
          </div>

          {/* 벽돌 헤더 영역 */}
          <div className="w-full max-w-sm h-12 flex justify-between items-center relative z-10 mb-4">
            <div 
              className="absolute top-0 w-[100vw] left-1/2 -translate-x-1/2 h-full bg-cover bg-center pointer-events-none -z-10"
              style={{ 
                backgroundImage: "url('/header-bg.jpg')",
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
              }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <button 
              onClick={() => {
                setShowExitPopup(true);
                pauseTimer();
              }}
              className="transition-all duration-150 brightness-90 saturate-90 active:scale-90 active:brightness-75 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] px-2 select-none"
              style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
            >
              <img src="/My-icon.png" alt="Exit Portal" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
            </button>
            
            <div 
              className="text-lg sm:text-xl font-black tracking-widest text-transparent bg-clip-text drop-shadow-md"
              style={{ 
                backgroundImage: currentDungeon === 'fire' 
                  ? 'linear-gradient(to right, #ef4444, #f97316)' 
                  : 'linear-gradient(to right, #3b82f6, #06b6d4)' 
              }}
            >
              {currentDungeon === 'fire' ? 'HELL OF FLAME' : 'HELL OF AQUA'}
            </div>

            <div className="w-8 px-2"></div>
          </div>

          {/* 게임 보드 영역 */}
          <div className="bg-neutral-900/90 p-4 sm:p-6 rounded-2xl shadow-2xl max-w-full border border-neutral-800 relative z-10">
            <Header minesLeft={minesLeft} gameStatus={gameStatus} timeElapsed={timeElapsed} onReset={initGame} dungeon={currentDungeon} />
            <Board board={board} onCellClick={handleCellClick} onCellRightClick={toggleFlag} dungeon={currentDungeon} />
            <Controls isFlagMode={isFlagMode} setIsFlagMode={setIsFlagMode} dungeon={currentDungeon} />
            
            {(gameStatus === 'won' || gameStatus === 'lost') && (
              <div className="mt-6 text-center font-black text-xl animate-bounce">
                {gameStatus === 'won' ? (
                  <span className={currentDungeon === 'fire' ? "text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "text-blue-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]"}>
                    🎉 던전을 완벽히 정화했습니다! 🎉
                  </span>
                ) : (
                  <span className="text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,1)]">
                    💥 악마의 정수와 접촉했습니다! 💥
                  </span>
                )}
              </div>
            )}

            {/* 포탈 이탈 경고 팝업 */}
            {showExitPopup && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-neutral-950 border border-neutral-700 p-6 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,1)] max-w-xs w-full text-center flex flex-col items-center">
                  <h3 className="text-xl font-bold text-red-500 mb-4 drop-shadow-md">포탈 이탈</h3>
                  <p className="text-neutral-300 text-sm mb-8 leading-relaxed">
                    정말 나가시겠습니까?<br/>
                    게임 플레이 기록이 <span className="text-red-400 font-bold">저장되지 않습니다</span>.
                  </p>
                  <div className="flex w-full gap-3">
                    <button 
                      onClick={() => { 
                        setShowExitPopup(false); 
                        initGame();
                        setCurrentScreen('DUNGEON_SELECTION'); 
                      }}
                      className="flex-1 bg-red-900/80 hover:bg-red-800 text-red-100 py-3 rounded-lg font-bold transition-all border border-red-700/50 active:scale-95"
                    >
                      확인
                    </button>
                    <button 
                      onClick={() => {
                        setShowExitPopup(false);
                        resumeTimer();
                      }}
                      className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 py-3 rounded-lg font-bold transition-all border border-neutral-600 active:scale-95"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      );
      break; 
    
    default:
      currentView = null;
  }

  return (
    <>
      {currentView}
      {showToast && (
        <div className="portal-exit-toast">
          뒤로가기를 한 번 더 누르면 포탈이 닫힙니다.
        </div>
      )}
    </>
  );
}
