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

// 로딩 화면 설정 메뉴판
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
    bgSrc: "/devilmineloading-bg.jpg", 
    bgOpacity: "opacity-90",
    disablePulse: true,
    useFadeIn: true
  },
  // 💡 [추가] 물의 던전 전용 로딩 추가
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
    setIsFlagMode, initGame, handleCellClick, toggleFlag 
  } = useMinesweeper();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  // 현재 화면 상태
  const [currentScreen, setCurrentScreen] = useState('HUNT_LIST_LOADING');
  
  // 💡 [추가] 현재 진입한 던전이 무엇인지 기억하는 상태!
  const [currentDungeon, setCurrentDungeon] = useState('fire'); 

  const startupLoggedOut = useRef(false);

  useEffect(() => {
    if (!startupLoggedOut.current) {
      logout();
      startupLoggedOut.current = true;
      console.log("💥 앱 구동: 기존 세션 자동 해제 완료");
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
    // 💡 버튼을 눌렀을 때 어떤 던전인지 메모장에 저장합니다.
    setCurrentDungeon(dungeonId); 

    if (dungeonId === 'fire') {
      setCurrentScreen('FIRE_DUNGEON_LOADING');
    } else if (dungeonId === 'water') {
      setCurrentScreen('WATER_DUNGEON_LOADING'); // 물의 던전 로딩 분기
    } else {
      setCurrentScreen('GAME_LOADING');
    }
    setTimeout(() => setCurrentScreen('GAME_PVE'), 2000);
  };

  // ==========================================
  // 🎬 화면 렌더링 (라우팅) 섹션
  // ==========================================

  if (loading || showSplash) {
    return <SplashScreen {...SPLASH_CONFIG.INITIAL} />;
  }

  if (!user) {
    return <LoginModal deferredPrompt={deferredPrompt} handleInstallClick={handleInstallClick} />;
  }

  if (currentScreen.endsWith('_LOADING')) {
    const config = SPLASH_CONFIG[currentScreen];
    return <SplashScreen {...config} />;
  }

  // 4. 일반 화면 내용물 준비
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
          <div className="w-full max-w-full sm:max-w-md flex justify-between items-center mb-3 px-2 text-neutral-400 font-semibold relative z-10">
            <span className="text-sm truncate mr-4">정화자: {user.email}</span>
            <button 
              onClick={() => setCurrentScreen('DUNGEON_SELECTION')} // 💡 포탈 이탈 시 로그아웃 대신 던전 선택 창으로 돌아가도록 수정
              className="text-xs bg-neutral-900 border border-neutral-700 px-3 py-1.5 rounded-lg hover:bg-neutral-800 active:scale-95 transition-all text-neutral-300"
            >
              포탈 이탈
            </button>
          </div>

          <div className="bg-neutral-900/90 p-4 sm:p-6 rounded-2xl shadow-2xl max-w-full border border-neutral-800 relative z-10">
            {/* 💡 하위 컴포넌트들에게 현재 던전(dungeon) 상태를 전달합니다! */}
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
