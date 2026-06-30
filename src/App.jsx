import React, { useState, useEffect, useRef } from 'react';
import { useMinesweeper } from './hooks/useMinesweeper';
import Header from './components/Header';
import Board from './components/Board';
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
  
  // 💡 수정된 부분 1: 오프닝 화면은 켜고(true), 로딩 화면은 꺼둔(false) 상태로 시작합니다.
  const [showOpening, setShowOpening] = useState(true);
  const [showSplash, setShowSplash] = useState(false); 
  
  const [currentScreen, setCurrentScreen] = useState('HUNT_LIST_LOADING');
  const [currentDungeon, setCurrentDungeon] = useState('fire');
  const [currentDifficulty, setCurrentDifficulty] = useState('Normal');
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

  // 💡 수정된 부분 2: Game Start 버튼을 눌러 showSplash가 true가 되었을 때만 3초 타이머가 돕니다.
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

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

  const handleSelectDungeon = (dungeonId, selectedDifficulty) => {
    setCurrentDungeon(dungeonId); 
    setCurrentDifficulty(selectedDifficulty); 

    initGame(selectedDifficulty); 

    if (dungeonId === 'fire') {
      setCurrentScreen('FIRE_DUNGEON_LOADING');
    } else if (dungeonId === 'water') {
      setCurrentScreen('WATER_DUNGEON_LOADING');
    } else {
      setCurrentScreen('GAME_LOADING');
    }
    setTimeout(() => setCurrentScreen('GAME_PVE'), 2000);
  };

  // 💡 수정된 부분 3: 게임 오프닝 화면 (Game Start 버튼 포함)
  if (showOpening) {
    return (
      <div 
        // 💡 justify-end pb-32를 justify-center로 변경하여 완벽한 상하 정중앙 배치
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center select-none bg-black"
        style={{
          backgroundImage: "url('/gameopening-bg.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: 'fadeInOpening 2s ease-in-out forwards' // 💡 2초 동안 스르륵 나타나는 효과
        }}
      >
        {/* 오프닝 화면 페이드인 애니메이션 CSS */}
        <style>{`
          @keyframes fadeInOpening {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>

        <button
          onClick={() => {
            setShowOpening(false); 
            setShowSplash(true);   
          }}
          // 💡 배경/테두리 제거, font-serif로 중세풍 적용, text-xl로 크기 축소, 자간(tracking) 넓힘
          className="animate-pulse transition-all duration-300 active:scale-90 text-yellow-600/90 font-serif text-xl tracking-[0.4em] drop-shadow-[0_0_10px_rgba(202,138,4,0.6)]"
          style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
        >
          GAME START
        </button>
      </div>
    );
  }

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
        <div className="min-h-screen bg-black flex flex-col items-center justify-start pt-0 px-4 pb-4 select-none touch-manipulation">
          
          <div className="w-full max-w-sm flex justify-center relative z-10 drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]">
            <img 
              src={currentDungeon === 'fire' ? "/hellofflame-title.jpg" : "/hellofaqua-title.jpg"} 
              alt="Dungeon Title" 
              className="w-full object-contain block"
              draggable="false"
            />
            <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-black to-transparent"></div>
          </div>

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

            <div className="w-8 px-2"></div>
          </div>

          <div 
            className="p-4 sm:p-6 rounded-2xl shadow-2xl max-w-full relative z-10 bg-cover bg-center"
            style={{ backgroundImage: "url('/dungeoninsite-bg.jpg')" }}
          >
            <Header minesLeft={minesLeft} gameStatus={gameStatus} timeElapsed={timeElapsed} onReset={() => initGame()} dungeon={currentDungeon} />
            <Board board={board} onCellClick={handleCellClick} onCellRightClick={toggleFlag} dungeon={currentDungeon} />
            
            {gameStatus === 'won' && (
              <div 
                className="fixed inset-0 z-[100] flex flex-col justify-end pb-8"
                style={{ 
                  backgroundImage: `url(${currentDungeon === 'fire' ? '/hellofflamewin.jpeg' : '/hellofaquawin.jpeg'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  animation: 'fadeInOverlay 1.0s cubic-bezier(0.25, 1, 0.5, 1) forwards'
                }}
              >
                <style>{`
                  @keyframes fadeInOverlay {
                    from { opacity: 0; }
                    to { opacity: 1; }
                  }
                `}</style>
                
                <div className="absolute inset-0 bg-black/50 pointer-events-none z-0"></div>
                
                <div className="flex justify-center items-center gap-4 px-6 mb-8 w-full max-w-md mx-auto relative z-10">
                  
                  <button 
                    onClick={() => {
                      initGame();
                      setCurrentScreen('DUNGEON_SELECTION');
                    }}
                    className="flex-1 transition-all duration-200 active:scale-95 hover:brightness-110 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] select-none"
                    style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                  >
                    <img 
                      src="/back.png" 
                      alt="Back to Dungeon Selection" 
                      className="w-full h-auto object-contain pointer-events-none"
                      draggable="false"
                    />
                  </button>
                  
                  <button 
                    onClick={() => initGame()}
                    className="flex-1 transition-all duration-200 active:scale-95 hover:brightness-110 drop-shadow-[0_5px_15px_rgba(234,179,8,0.4)] select-none"
                    style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                  >
                    <img 
                      src="/replay.png" 
                      alt="Replay Game" 
                      className="w-full h-auto object-contain pointer-events-none"
                      draggable="false"
                    />
                  </button>
                  
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-0"></div>
              </div>
            )}

            {gameStatus === 'lost' && (
              <div 
                className="fixed inset-0 z-[100] flex flex-col justify-end pb-8"
                style={{ 
                  backgroundImage: `url(${currentDungeon === 'fire' ? '/hellofflamelose-bg.jpg' : '/hellofaqualose-bg.jpg'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  animation: 'fadeInOverlay 1.4s cubic-bezier(0.25, 1, 0.5, 1) forwards'
                }}
              >
                <style>{`
                  @keyframes fadeInOverlay {
                    from { opacity: 0; }
                    to { opacity: 1; }
                  }
                `}</style>
                
                <div className="absolute inset-0 bg-black/50 pointer-events-none z-0"></div>
                
                <div className="flex justify-center items-center gap-4 px-6 mb-8 w-full max-w-md mx-auto relative z-10">
                  
                  <button 
                    onClick={() => {
                      initGame();
                      setCurrentScreen('DUNGEON_SELECTION');
                    }}
                    className="flex-1 transition-all duration-200 active:scale-95 hover:brightness-110 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] select-none"
                    style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                  >
                    <img 
                      src="/back.png" 
                      alt="Back to Dungeon Selection" 
                      className="w-full h-auto object-contain pointer-events-none"
                      draggable="false"
                    />
                  </button>
                  
                  <button 
                    onClick={() => initGame()}
                    className="flex-1 transition-all duration-200 active:scale-95 hover:brightness-110 drop-shadow-[0_5px_15px_rgba(220,38,38,0.3)] select-none"
                    style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                  >
                    <img 
                      src="/replay.png" 
                      alt="Replay Game" 
                      className="w-full h-auto object-contain pointer-events-none"
                      draggable="false"
                    />
                  </button>
                  
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-0"></div>
              </div>
            )}

            {showExitPopup && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                
                <div 
                  className="relative px-6 w-full max-w-[22rem] aspect-[1.3/1] flex flex-col items-center justify-center drop-shadow-[0_0_30px_rgba(0,0,0,1)]"
                  style={{ 
                    backgroundImage: "url('/popup-bg.png')",
                    backgroundSize: '100% 100%', 
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {/* 텍스트가 바위의 복잡한 무늬에 묻히지 않도록, 중앙 부분에만 살짝 어두운 원형 그라데이션을 줍니다. */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/50 via-black/10 to-transparent pointer-events-none z-0 rounded-3xl"></div>

                  <h3 className="text-xl font-black text-red-500 mb-2 drop-shadow-[0_2px_5px_rgba(0,0,0,1)] relative z-10">포탈 이탈</h3>
                  <p className="text-neutral-200 text-sm mb-5 leading-relaxed font-bold drop-shadow-[0_2px_5px_rgba(0,0,0,1)] relative z-10 text-center">
                    정말 나가시겠습니까?<br/>
                    게임 플레이 기록이 <span className="text-red-400 font-black">저장되지 않습니다</span>.
                  </p>
                  
                  <div className="flex justify-center items-center gap-2 w-full px-2 relative z-10">
                    
                    {/* 확인(나가기) 버튼 - Back 이미지 */}
                    <button 
                      onClick={() => { 
                        setShowExitPopup(false); 
                        initGame();
                        setCurrentScreen('DUNGEON_SELECTION'); 
                      }}
                      className="flex-1 transition-all duration-200 active:scale-95 hover:brightness-110 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] select-none"
                      style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                    >
                      <img 
                        src="/back.png" 
                        alt="Confirm Exit" 
                        className="w-full h-auto object-contain pointer-events-none"
                        draggable="false"
                      />
                    </button>
                    
                    {/* 취소(계속하기) 버튼 - Replay 이미지 */}
                    <button 
                      onClick={() => {
                        setShowExitPopup(false);
                        resumeTimer();
                      }}
                      className="flex-1 transition-all duration-200 active:scale-95 hover:brightness-110 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] select-none"
                      style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                    >
                      <img 
                        src="/replay.png" 
                        alt="Cancel Exit" 
                        className="w-full h-auto object-contain pointer-events-none"
                        draggable="false"
                      />
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
