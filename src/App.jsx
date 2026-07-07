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
import MyPage from './components/MyPage';
import { DUNGEON_INFO } from './constants/dungeonData';
// 💡 보상 아이템의 아이콘과 이름을 가져오기 위해 도감 호출
import { ITEM_DATABASE } from './constants/itemData';
import UserProfileCard from './components/UserProfileCard';

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
  }
};

export default function App() {
  const { user, loading, logout } = useAuth();
  
  // 💡 방금 추가한 rewards(보상 데이터)도 훅에서 가져옵니다!
  const { 
    board, gameStatus, minesLeft, timeElapsed, isFlagMode, rewards,
    setIsFlagMode, initGame, handleCellClick, toggleFlag,
    pauseTimer, resumeTimer
  } = useMinesweeper();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showOpening, setShowOpening] = useState(true);
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
    setCurrentScreen('DEVIL_MINE_MODE');
  };

  const handleSelectPVE = () => {
    setCurrentScreen('DUNGEON_SELECT_LOADING');
    setTimeout(() => setCurrentScreen('DUNGEON_SELECTION'), 2000);
  };

  const handleSelectDungeon = (dungeonId, selectedDifficulty) => {
    setCurrentDungeon(dungeonId); 
    setCurrentDifficulty(selectedDifficulty); 

    const fullDungeonName = DUNGEON_INFO[dungeonId]?.name || '알 수 없는 던전';
    initGame(selectedDifficulty, fullDungeonName); 

    setCurrentScreen('DUNGEON_LOADING');
    setTimeout(() => setCurrentScreen('GAME_PVE'), 2000);
  };

  // 💡 획득한 보상(골드, 아이템)을 모달창에 예쁘게 그려주는 미니 렌더링 함수
    const renderRewardsUI = () => {
    if (!rewards) return null;

    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[16rem] z-10 animate-[fadeIn_0.5s_ease-in-out]">
        
        {/* 💡 레벨업 시 화려한 이펙트 텍스트 띄우기 */}
        {rewards.hasLeveledUp && (
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-full text-center animate-bounce z-20">
            <span className="text-yellow-400 font-black text-3xl tracking-widest drop-shadow-[0_0_15px_rgba(250,204,21,1)] italic border-black text-stroke-2">
              LEVEL UP!
            </span>
            <div className="text-[#f5d5a9] text-xs font-bold mt-1 drop-shadow-md">
              Lv. {rewards.newLevel} 달성!
            </div>
          </div>
        )}

        <div className="bg-black/70 rounded-md p-4 border border-[#a6845c]/20 shadow-[0_0_30px_rgba(0,0,0,0.9)]">
          <h3 className="text-center font-serif text-[#d8b486] text-sm tracking-[0.3em] mb-4 drop-shadow-md uppercase">
            Acquired
          </h3>
          
          {/* 골드 & 경험치 표시 영역 */}
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex justify-center items-center bg-black/40 rounded-sm py-1.5">
              <span className="text-[#f5d5a9] font-black text-[16px] tracking-widest font-serif drop-shadow-md">
                +{rewards.gold} <span className="text-[10px] text-[#d8b486] ml-1 font-sans uppercase">Gold</span>
              </span>
            </div>
            
            {/* 💡 경험치 표시 줄 추가 */}
            <div className="flex justify-center items-center bg-black/40 rounded-sm py-1.5 border border-blue-900/30">
              <span className="text-blue-300 font-black text-[16px] tracking-widest font-serif drop-shadow-md">
                +{rewards.earnedExp} <span className="text-[10px] text-blue-400/80 ml-1 font-sans uppercase">EXP</span>
              </span>
            </div>
          </div>

          {/* 아이템 렌더링 (구분선 추가) */}
          {rewards.items && Object.keys(rewards.items).length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-2 pt-3 border-t border-[#a6845c]/20">
              {Object.entries(rewards.items).map(([itemId, count]) => {
                const item = ITEM_DATABASE[itemId];
                if (!item) return null;
                return (
                  <div key={itemId} className="w-12 h-12 bg-black/40 rounded-sm flex items-center justify-center relative group">
                    {item.icon.startsWith('/') ? (
                      <img src={item.icon} alt={item.name} className="w-[70%] h-[70%] object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" draggable="false" />
                    ) : (
                      <span className="text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] select-none">{item.icon}</span>
                    )}
                    <span className="absolute bottom-0 right-1 text-[10px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,1)] select-none">
                      {count}
                    </span>
                    
                    <div className="absolute inset-0 bg-black/85 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 rounded-sm p-0.5">
                      <span className="text-[#f5d5a9] text-[9px] font-bold text-center leading-tight break-keep drop-shadow-md">
                        {item.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (showOpening) {
    return (
      <div 
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center select-none bg-black"
        style={{
          backgroundImage: "url('/gameopening-bg.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: 'fadeInOpening 2s ease-in-out forwards'
        }}
      >
        <style>{`
          @keyframes fadeInOpening {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>

        <button
          onClick={() => {
            setShowOpening(false); 
          }}
          className="animate-pulse transition-all duration-300 active:scale-90 text-yellow-600/90 font-serif text-xl tracking-[0.4em] drop-shadow-[0_0_10px_rgba(202,138,4,0.6)]"
          style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
        >
          GAME START
        </button>
      </div>
    );
  }

  if (loading) {
    return <SplashScreen {...SPLASH_CONFIG.INITIAL} />;
  }

  if (!user) {
    return <LoginModal deferredPrompt={deferredPrompt} handleInstallClick={handleInstallClick} />;
  }

  if (currentScreen.endsWith('_LOADING')) {
    let config = SPLASH_CONFIG[currentScreen];
    
    if (currentScreen === 'DUNGEON_LOADING') {
      const dungeon = DUNGEON_INFO[currentDungeon];
      config = {
        message: dungeon?.loadingMsg || "던전 입장 중...",
        logoSrc: dungeon?.loadingLogo || "/huntlistloading-logo.png",
        bgSrc: dungeon?.loadingBg || "/devilmineloading-bg.jpg",
        bgOpacity: dungeon?.loadingOpacity || "opacity-70",
        disablePulse: true,
        useFadeIn: true
      };
    }
    
    const finalConfig = config || SPLASH_CONFIG.GAME_LOADING;
    return <SplashScreen {...finalConfig} />;
  }

  let currentView = null;
  switch (currentScreen) {
    case 'HUNT_LIST':
      currentView = (
        <HuntList 
          onSelectDevilMine={handleSelectDevilMine} 
          onLogout={logout} 
          onMyPage={() => setCurrentScreen('MY_PAGE')} 
        />
      );
      break;

    case 'MY_PAGE':
      currentView = <MyPage onBack={() => setCurrentScreen('HUNT_LIST')} />;
      break;
    
    case 'DEVIL_MINE_MODE':
      currentView = (
        <div style={{ animation: 'fadeInMode 0.4s ease-in-out forwards' }}>
          <style>{`
            @keyframes fadeInMode {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
          <DevilMineMode onSelectPVE={handleSelectPVE} onBack={() => setCurrentScreen('HUNT_LIST')} onLogout={logout} />
        </div>
      );
      break;

    case 'DUNGEON_SELECTION':
      currentView = <DungeonSelection onSelectDungeon={handleSelectDungeon} onBack={() => setCurrentScreen('DEVIL_MINE_MODE')} onLogout={logout} />;
      break;
      
    case 'GAME_PVE':
      currentView = (
        <div className="min-h-screen bg-black flex flex-col items-center justify-start pt-0 px-4 pb-4 select-none touch-manipulation">
          
          <div className="w-full max-w-sm flex justify-center relative z-10 drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]">
            <img 
              src={DUNGEON_INFO[currentDungeon]?.titleImg} 
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
              <img src="/backkey.png" alt="Exit Portal" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
            </button>

            <div className="w-8 px-2"></div>
          </div>

          <div 
            className="p-4 sm:p-6 rounded-2xl shadow-2xl max-w-full relative z-10 bg-cover bg-center"
            style={{ 
              backgroundImage: `url('${DUNGEON_INFO[currentDungeon]?.boardBg || '/dungeoninsite-bg.jpg'}')` 
            }}
          >
            <Header minesLeft={minesLeft} gameStatus={gameStatus} timeElapsed={timeElapsed} onReset={() => initGame()} dungeon={currentDungeon} />
            <Board board={board} onCellClick={handleCellClick} onCellRightClick={toggleFlag} dungeon={currentDungeon} />
            
            {gameStatus === 'won' && (
              <div className="fixed inset-0 z-[100] flex flex-col justify-end pb-8"
                style={{ 
                  backgroundImage: `url(${DUNGEON_INFO[currentDungeon]?.winBg})`,
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
                
                {/* 💡 승리 보상 UI 렌더링! */}
                {renderRewardsUI()}

                <div className="flex justify-center items-center gap-4 px-6 w-full max-w-md mx-auto relative z-10">
                  
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
                  backgroundImage: `url(${DUNGEON_INFO[currentDungeon]?.loseBg})`,
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
                
                {/* 💡 패배 위로 보상 UI 렌더링! */}
                {renderRewardsUI()}

                <div className="flex justify-center items-center gap-4 px-6 w-full max-w-md mx-auto relative z-10">
                  
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
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/50 via-black/10 to-transparent pointer-events-none z-0 rounded-3xl"></div>

                  <h3 className="text-xl font-black text-red-500 mb-2 drop-shadow-[0_2px_5px_rgba(0,0,0,1)] relative z-10">포탈 이탈</h3>
                  <p className="text-neutral-200 text-sm mb-5 leading-relaxed font-bold drop-shadow-[0_2px_5px_rgba(0,0,0,1)] relative z-10 text-center">
                    정말 나가시겠습니까?<br/>
                    게임 플레이 기록이 <span className="text-red-400 font-black">저장되지 않습니다</span>.
                  </p>
                  
                  <div className="flex justify-center items-center gap-1 w-full px-2 relative z-10">
                    
                    <button 
                      onClick={() => { 
                        setShowExitPopup(false); 
                        initGame();
                        setCurrentScreen('DUNGEON_SELECTION'); 
                      }}
                      className="w-24 transition-all duration-200 active:scale-95 hover:brightness-110 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] select-none"
                      style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                    >
                      <img 
                        src="/back.png" 
                        alt="Confirm Exit" 
                        className="w-full h-auto object-contain pointer-events-none"
                        draggable="false"
                      />
                    </button>
                    
                    <button 
                      onClick={() => {
                        setShowExitPopup(false);
                        resumeTimer();
                      }}
                      className="w-24 transition-all duration-200 active:scale-95 hover:brightness-110 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] select-none"
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

          {gameStatus === 'playing' || gameStatus === 'idle' ? (
            <UserProfileCard user={user} />
          ) : null}
          
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
