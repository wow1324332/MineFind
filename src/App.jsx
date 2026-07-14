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
import Knights from './components/Knights';
import { DUNGEON_INFO } from './constants/dungeonData';
// 💡 보상 아이템의 아이콘과 이름을 가져오기 위해 도감 호출
import { ITEM_DATABASE } from './constants/itemData';
import UserProfileCard from './components/UserProfileCard';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase'; // (파이어베이스 설정 파일 경로)

const SPLASH_CONFIG = {
  INITIAL: {
    message: "Transfer...",
    logoSrc: "/Splash-logo.jpg",
    bgSrc: null
  },
  HUNT_LIST_LOADING: {
    message: "Loading...",
    logoSrc: "/huntlistloading-logo.webp",
    bgSrc: "/huntlist-bg.webp",
    bgOpacity: "opacity-70",
    disablePulse: true,
    useFadeIn: true
  },
  GAME_LOADING: {
    message: "Loading...",
    logoSrc: "/huntlistloading-logo.webp",
    bgSrc: "/devilminemode/devilmineloading-bg.webp",
    bgOpacity: "opacity-70",
    disablePulse: true,
    useFadeIn: true
  },
  DUNGEON_SELECT_LOADING: {
    message: "던전 탐색 중...",
    logoSrc: "/devilminemode/hunting-bt.webp",
    bgSrc: "/dungeonselection/dungeonselectionloading-bg.webp",
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
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('HUNT_LIST_LOADING');
  const [currentDungeon, setCurrentDungeon] = useState('fire');
  const [currentDifficulty, setCurrentDifficulty] = useState('Normal');
  const [showExitPopup, setShowExitPopup] = useState(false);

  const [showEnergyToast, setShowEnergyToast] = useState(false);
  const energyToastTimer = useRef(null);

  const [activeAchievement, setActiveAchievement] = useState(null);

  // 💡 보상(rewards) 데이터에 신규 칭호가 도착하면 즉시 감지해서 화면에 띄움
  useEffect(() => {
    if (rewards && rewards.newTitles && rewards.newTitles.length > 0) {
      setActiveAchievement(rewards.newTitles[0]);
    }
  }, [rewards]);

  const triggerEnergyToast = () => {
    setShowEnergyToast(true);
    if (energyToastTimer.current) clearTimeout(energyToastTimer.current);
    energyToastTimer.current = setTimeout(() => {
      setShowEnergyToast(false);
    }, 2500); // 2.5초 후 자연스럽게 사라짐
  };
  
  const MAX_HP = 5;
  const REGEN_TIME_MS = 6 * 60 * 1000; // 6분 (360,000 밀리초)
  
  const [hpData, setHpData] = useState({ hp: MAX_HP, lastUpdate: Date.now() });
  const [hasDeductedHp, setHasDeductedHp] = useState(false);

  // 1️⃣ 오프라인 체력 회복 동기화
  useEffect(() => {
    if (!user) return;
    const syncHp = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          let currentHp = data.hp ?? MAX_HP;
          let lastHpUpdate = data.lastHpUpdate?.toMillis ? data.lastHpUpdate.toMillis() : (data.lastHpUpdate || Date.now());
          
          if (currentHp < MAX_HP) {
            const now = Date.now();
            const elapsed = now - lastHpUpdate;
            const recovered = Math.floor(elapsed / REGEN_TIME_MS);
            
            if (recovered > 0) {
              currentHp = Math.min(MAX_HP, currentHp + recovered);
              lastHpUpdate = currentHp === MAX_HP ? now : lastHpUpdate + (recovered * REGEN_TIME_MS);
              await updateDoc(userRef, { hp: currentHp, lastHpUpdate });
            }
          }
          setHpData({ hp: currentHp, lastUpdate: lastHpUpdate });
        }
      } catch (error) {
        console.error("체력 정보 동기화 에러:", error);
      }
    };
    syncHp();
  }, [user]);

  // 2️⃣ 접속 중일 때 실시간 체력 회복 타이머
  useEffect(() => {
    if (!user || hpData.hp >= MAX_HP) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - hpData.lastUpdate;
      
      if (elapsed >= REGEN_TIME_MS) {
        const recovered = Math.floor(elapsed / REGEN_TIME_MS);
        const newHp = Math.min(MAX_HP, hpData.hp + recovered);
        const newLastUpdate = newHp === MAX_HP ? now : hpData.lastUpdate + (recovered * REGEN_TIME_MS);
        
        setHpData({ hp: newHp, lastUpdate: newLastUpdate });
        updateDoc(doc(db, 'users', user.uid), { hp: newHp, lastHpUpdate: newLastUpdate });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hpData, user]);

  // 3️⃣ 핵심: 타일을 처음 눌러 게임이 'playing'이 되는 순간 체력 차감!
  useEffect(() => {
    if (gameStatus === 'playing' && !hasDeductedHp && user) {
      setHasDeductedHp(true); 
      
      const now = Date.now();
      const newHp = Math.max(0, hpData.hp - 1);
      const newLastUpdate = hpData.hp === MAX_HP ? now : hpData.lastUpdate;
      
      setHpData({ hp: newHp, lastUpdate: newLastUpdate });
      updateDoc(doc(db, 'users', user.uid), { hp: newHp, lastHpUpdate: newLastUpdate });
    }
  }, [gameStatus, hasDeductedHp, hpData, user]);

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

  const handleRetryGame = () => {
    // 💡 이미 타일을 눌러서 체력을 1 소모한 상태(hasDeductedHp === true)라면, 남은 체력이 있는지 검사!
    if (hasDeductedHp && hpData.hp < 1) {
      triggerEnergyToast();
      return; // 체력이 없으면 함수 실행을 강제로 멈춰버림 (게임 시작 불가)
    }
    setHasDeductedHp(false); // 새 게임을 시작할 수 있게 차감 자물쇠 해제
    initGame();
  };

  const handleBackToSelection = () => {
    setShowExitPopup(false); // 나가기 팝업 닫기
    setHasDeductedHp(false); // 자물쇠 초기화
    initGame(); // 보드판 초기화
    setCurrentScreen('DUNGEON_SELECTION'); // 던전 선택 창으로 이동
  };

  const handleSelectDungeon = (dungeonId, selectedDifficulty) => {
    // 여기서 던전을 누를 때 체력이 없으면 입구컷!
    if (hpData.hp < 1) {
      triggerEnergyToast();
      return;
    }

    setCurrentDungeon(dungeonId); 
    setCurrentDifficulty(selectedDifficulty); 
    
    setHasDeductedHp(false); // 💡 새 게임 입장 시 '차감 자물쇠'를 다시 풀어줌
    initGame(selectedDifficulty, dungeonId); 

    setCurrentScreen('DUNGEON_LOADING');
    setTimeout(() => setCurrentScreen('GAME_PVE'), 2000);
  };

  // 💡 획득한 보상(골드, 아이템)을 모달창에 예쁘게 그려주는 미니 렌더링 함수
    const renderRewardsUI = () => {
    if (!rewards) return null;

    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[16rem] z-10 animate-[fadeIn_0.5s_ease-in-out]">
        
        {rewards.hasLeveledUp && (
          <div className="absolute -top-16 left-0 w-full flex flex-col items-center justify-center animate-bounce z-20 pointer-events-none">
            <span className="text-yellow-400 font-black text-3xl tracking-widest drop-shadow-[0_0_15px_rgba(250,204,21,1)] italic border-black text-stroke-2">
              LEVEL UP!
            </span>
            <div className="text-[#f5d5a9] text-xs font-bold mt-1 drop-shadow-md">
              Lv. {rewards.newLevel} Up!
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
        // 💡 1. transition-opacity를 추가하여 서서히 투명해지도록 합니다.
        className={`fixed inset-0 z-[200] flex flex-col items-center justify-center select-none bg-black transition-opacity duration-700 ease-in-out ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        style={{
          backgroundImage: "url('/gameopening-bg.webp')",
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
            // 💡 2. 즉시 화면을 없애지 않고, 스르륵 투명해지게 만든 후 0.7초 뒤에 완전히 닫습니다.
            setIsFadingOut(true);
            setTimeout(() => setShowOpening(false), 700); 
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
    // 💡 3. 파이어베이스가 정보를 읽는 찰나의 순간에는 완벽한 검은 화면을 유지합니다.
    return <div className="fixed inset-0 bg-black z-[500]"></div>;
  }

  if (!user) {
    // 💡 4. 로그인 화면이 나타날 때 검은 어둠 속에서 서서히 밝아지며 나타나게 감싸줍니다.
    return (
      <div className="fixed inset-0 z-[100] bg-black animate-[fadeIn_0.8s_ease-in-out]">
        <LoginModal deferredPrompt={deferredPrompt} handleInstallClick={handleInstallClick} />
      </div>
    );
  }

  if (currentScreen.endsWith('_LOADING')) {
    let config = SPLASH_CONFIG[currentScreen];
    
    if (currentScreen === 'DUNGEON_LOADING') {
      const dungeon = DUNGEON_INFO[currentDungeon];
      config = {
        message: dungeon?.loadingMsg || "던전 입장 중...",
        logoSrc: dungeon?.loadingLogo || "/huntlistloading-logo.webp",
        bgSrc: dungeon?.loadingBg || "/devilminemode/devilmineloading-bg.webp",
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
          hp={hpData.hp} // 💡 1. 체력 데이터를 전달합니다!
          onSelectDevilMine={handleSelectDevilMine} 
          onLogout={logout} 
          onMyPage={() => setCurrentScreen('MY_PAGE')} 
        />
      );
      break;

    case 'MY_PAGE':
      currentView = (
        <MyPage 
          hp={hpData.hp}
          onBack={() => setCurrentScreen('HUNT_LIST')} 
          onKnights={() => setCurrentScreen('KNIGHTS')} // 💡 기사단 화면으로 이동 신호 연결
        />
      );
      break;

    // 💡 마이페이지 아래에 기사단 전용 독립 화면 라우팅 추가
    case 'KNIGHTS':
      currentView = <Knights hp={hpData.hp} onBack={() => setCurrentScreen('MY_PAGE')} />;
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
          <DevilMineMode hp={hpData.hp} onSelectPVE={handleSelectPVE} onBack={() => setCurrentScreen('HUNT_LIST')} onLogout={logout} />
        </div>
      );
      break;

    case 'DUNGEON_SELECTION':
      currentView = <DungeonSelection hp={hpData.hp} onSelectDungeon={handleSelectDungeon} onBack={() => setCurrentScreen('DEVIL_MINE_MODE')} onLogout={logout} />;
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
                backgroundImage: "url('/header/header-bg.webp')",
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
              <img src="/header/backkey.webp" alt="Exit Portal" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
            </button>

            <div className="w-8 px-2"></div>
          </div>

          <div 
            className="p-4 sm:p-6 rounded-2xl shadow-2xl max-w-full relative z-10 bg-cover bg-center min-h-[550px] flex flex-col"
            style={{ 
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${DUNGEON_INFO[currentDungeon]?.boardBg || '/dungeoninsite-bg.jpg'}')` 
            }}
          >
            <Header minesLeft={minesLeft} gameStatus={gameStatus} timeElapsed={timeElapsed} onReset={handleRetryGame} dungeon={currentDungeon} />
            <div className="flex-1 flex flex-col justify-center">
              <Board board={board} onCellClick={handleCellClick} onCellRightClick={toggleFlag} dungeon={currentDungeon} />
            </div>
            
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
                    onClick={handleBackToSelection} // 💡 로비 이동 방어 적용
                    className="flex-1 transition-all duration-200 active:scale-95 hover:brightness-110 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] select-none"
                    style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                  >
                    <img src="/back.png" alt="Back to Dungeon Selection" className="w-full h-auto object-contain pointer-events-none" draggable="false" />
                  </button>
                  
                  <button 
                    onClick={handleRetryGame} // 💡 리플레이 방어 적용
                    className="flex-1 transition-all duration-200 active:scale-95 hover:brightness-110 drop-shadow-[0_5px_15px_rgba(234,179,8,0.4)] select-none"
                    style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                  >
                    <img src="/replay.png" alt="Replay Game" className="w-full h-auto object-contain pointer-events-none" draggable="false" />
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
                    onClick={handleBackToSelection} // 💡 로비 이동 방어 적용
                    className="flex-1 transition-all duration-200 active:scale-95 hover:brightness-110 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] select-none"
                    style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                  >
                    <img src="/back.png" alt="Back to Dungeon Selection" className="w-full h-auto object-contain pointer-events-none" draggable="false" />
                  </button>
                  
                  <button 
                    onClick={handleRetryGame} // 💡 리플레이 방어 적용
                    className="flex-1 transition-all duration-200 active:scale-95 hover:brightness-110 drop-shadow-[0_5px_15px_rgba(234,179,8,0.4)] select-none"
                    style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                  >
                    <img src="/replay.png" alt="Replay Game" className="w-full h-auto object-contain pointer-events-none" draggable="false" />
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
                      onClick={handleBackToSelection} // 💡 나갈 때 안전하게 초기화하며 로비로 이동
                      className="w-24 transition-all duration-200 active:scale-95 hover:brightness-110 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] select-none"
                      style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                    >
                      <img src="/back.png" alt="Confirm Exit" className="w-full h-auto object-contain pointer-events-none" draggable="false" />
                    </button>
                    
                    <button 
                      onClick={() => {
                        setShowExitPopup(false);
                        resumeTimer();
                      }}
                      className="w-24 transition-all duration-200 active:scale-95 hover:brightness-110 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] select-none"
                      style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                    >
                      <img src="/replay.png" alt="Cancel Exit" className="w-full h-auto object-contain pointer-events-none" draggable="false" />
                    </button>
                  </div>
                  
                </div>
              </div>
            )}
            
          </div>

          {gameStatus === 'playing' || gameStatus === 'idle' ? (
            <UserProfileCard user={user} isDimmed={showExitPopup} />
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
      {showEnergyToast && (
        <>
          {/* 💡 2.5초의 타이머에 딱 맞게 나타났다가 스르륵 사라지는 전용 애니메이션 */}
          <style>{`
            @keyframes toastFadeInOut {
              0% { opacity: 0; }
              15% { opacity: 1; }
              80% { opacity: 1; }
              100% { opacity: 0; }
            }
          `}</style>
          
          <div 
            className="fixed top-28 left-1/2 -translate-x-1/2 z-[300] flex flex-col items-center justify-center pointer-events-none"
            style={{ animation: 'toastFadeInOut 2.5s ease-in-out forwards' }}
          >
            {/* 💡 배경 투명도를 90에서 60으로 낮추고, 뒤가 은은하게 비치는 backdrop-blur-md 추가 */}
            <div className="bg-black/60 backdrop-blur-md border border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.5)] px-6 py-2 rounded-md flex items-center justify-center">
              <span className="text-red-500 font-serif font-black tracking-wider text-sm italic drop-shadow-md whitespace-nowrap opacity-90">
                Not enough energy..
              </span>
            </div>
          </div>
        </>
)}

      {/* ========================================= */}
      {/* 🏆 시네마틱 업적 달성 오버레이 (던전 플레이용) */}
      {/* ========================================= */}
      {activeAchievement && (
        <div 
          className="fixed inset-0 z-[400] flex items-center justify-center bg-black animate-[fadeIn_0.5s_ease-out] select-none cursor-pointer"
          style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', WebkitTapHighlightColor: 'transparent' }}
          onClick={() => setActiveAchievement(null)} 
        >
          {/* 배경 이미지 */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/achievement-bg.jpg')" }}
          ></div>

          {/* 중앙 텍스트 영역 (동적 데이터 매핑) */}
          <div className="absolute top-1/2 left-0 w-full -translate-y-[45%] flex flex-col items-center justify-center pointer-events-none">
            <span className={`font-serif font-black text-4xl tracking-widest mb-3 text-center px-4 leading-tight ${activeAchievement.textColor} ${activeAchievement.glow}`}>
              {activeAchievement.name}
            </span>
            <span className="text-neutral-300 font-bold text-[13px] tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              {activeAchievement.description}
            </span>
          </div>

          {/* 하단 터치 유도 문구 */}
          <div className="absolute bottom-12 w-full text-center pointer-events-none">
            <span className="text-white/60 font-serif tracking-[0.3em] text-[10px] animate-pulse">
              - Touch -
            </span>
          </div>
        </div>
      )}
    </>
  );
}
