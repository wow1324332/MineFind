// src/App.jsx
import React, { useState, useEffect, useRef } from 'react'; // 💡 useRef 가 추가되었습니다.
import { useMinesweeper } from './hooks/useMinesweeper';
import Header from './components/Header';
import Board from './components/Board';
import Controls from './components/Controls';
import LoginModal from './components/LoginModal';
import SplashScreen from './components/SplashScreen';
import HuntList from './components/HuntList';
import DevilMineMode from './components/DevilMineMode'; 
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
    bgOpacity: "opacity-80",
    disablePulse: true,
    useFadeIn: true
  },
  MODE_LOADING: {
    message: "Loading...",
    logoSrc: "/huntlistloading-logo.png",
    bgSrc: "/devilmineloading-bg.jpg",
    bgOpacity: "opacity-100",
    disablePulse: true,
    useFadeIn: true
  },
  GAME_LOADING: {
    message: "Loading...",
    logoSrc: "/huntlistloading-logo.png",
    bgSrc: "/devilmineloading-bg.jpg",
    bgOpacity: "opacity-80",
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

  // 💡 [핵심 추가] 무한 루프를 방지하고 앱 기동 시 딱 한 번만 실행하기 위한 이정표
  const startupLoggedOut = useRef(false);

  // 💡 [핵심 추가] 앱이 완전히 새로 켜지면 무조건 기존 로그인 세션을 폭파(로그아웃)합니다.
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

  // 앱 최초 구동 3초 타이머
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
    // 1. 방어벽 설치 함수
    const pushFakeState = () => {
      window.history.pushState({ trap: true }, null, window.location.href);
    };

    // 앱 기동 시 최초 방어벽 설치
    pushFakeState();

    const handlePopState = (e) => {
      const currentTime = new Date().getTime();

      // 2. 2초(2000ms) 안에 두 번 연타했을 경우!
      if (currentTime - lastBackPressTime.current < 2000) {
        // 방어벽을 아예 치워버리고 브라우저 본연의 뒤로가기(앱 종료)를 허락합니다.
        window.removeEventListener('popstate', handlePopState);
        window.history.back(); 
      } else {
        // 3. 한 번만 눌렀을 경우!
        // 즉시 깨진 방어벽을 리필하고 시간을 기록합니다.
        pushFakeState();
        lastBackPressTime.current = currentTime;

        // 토스트를 띄우고 진동을 줍니다.
        setShowToast(true);
        if (navigator.vibrate) navigator.vibrate(200);

        // 💡 3초 뒤에 토스트를 자동으로 숨깁니다.
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

  const handleCancelExit = () => {
    setShowExitPopup(false);
    isPopupOpen.current = false; // 💡 취소 버튼 누를 때도 닫힘 상태로 정확히 업데이트!
  };

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

  // PWA 설치 버튼 클릭 함수
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
    setCurrentScreen('GAME_LOADING');
    setTimeout(() => setCurrentScreen('GAME_PVE'), 2000);
  };

  // ==========================================
  // 🎬 화면 렌더링 (라우팅) 섹션
  // ==========================================

  // 1. 앱 최초 켜질 때 스플래시 (3초 동안 무조건 노출되는 동안 로그아웃이 완료됨)
  if (loading || showSplash) {
    return <SplashScreen {...SPLASH_CONFIG.INITIAL} />;
  }

  // 2. 로그인 미완료 시 로그인 모달 (세션이 풀렸으므로 3초 스플래시가 끝나면 무조건 여기로 옵니다)
  if (!user) {
    return <LoginModal deferredPrompt={deferredPrompt} handleInstallClick={handleInstallClick} />;
  }

  // 3. '현재 상태'가 로딩 상태라면 메뉴판에서 설정 띄우기
  if (currentScreen.endsWith('_LOADING')) {
    const config = SPLASH_CONFIG[currentScreen];
    return <SplashScreen {...config} />;
  }

// ==========================================
  // 🎬 화면 렌더링 (라우팅) 섹션
  // ==========================================

  // 1. 앱 최초 켜질 때 스플래시 (3초 동안 무조건 노출되는 동안 로그아웃이 완료됨)
  if (loading || showSplash) {
    return <SplashScreen {...SPLASH_CONFIG.INITIAL} />;
  }

  // 2. 로그인 미완료 시 로그인 모달 (세션이 풀렸으므로 3초 스플래시가 끝나면 무조건 여기로 옵니다)
  if (!user) {
    return <LoginModal deferredPrompt={deferredPrompt} handleInstallClick={handleInstallClick} />;
  }

  // 3. '현재 상태'가 로딩 상태라면 메뉴판에서 설정 띄우기
  if (currentScreen.endsWith('_LOADING')) {
    const config = SPLASH_CONFIG[currentScreen];
    return <SplashScreen {...config} />;
  }

// 4. 일반 화면 내용물 준비 (바로 return 하지 않고 상자에 담습니다)
  let currentView = null;
  switch (currentScreen) {
    case 'HUNT_LIST':
      // 💡 로그아웃(logout) 함수를 onLogout이라는 이름으로 헌트 리스트에 넘겨줍니다.
      currentView = <HuntList onSelectDevilMine={handleSelectDevilMine} onLogout={logout} />;
      break;
    
    case 'DEVIL_MINE_MODE':
      currentView = <DevilMineMode onSelectPVE={handleSelectPVE} onBack={() => setCurrentScreen('HUNT_LIST')} />;
      break;
    
    case 'GAME_PVE':
      currentView = (
        <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4 select-none touch-manipulation">
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
      break;
    
    default:
      currentView = null;
  }

  // 💡 5. [최종 반환] 준비된 화면(currentView)과 종료 팝업을 한 보따리(<>)로 묶어서 반환합니다!
return (
    <>
      {currentView}

      {/* 💡 [추가] 토스트 팝업 */}
      {showToast && (
        <div className="portal-exit-toast">
          뒤로가기를 한 번 더 누르면 포탈이 닫힙니다.
        </div>
      )}
    </>
  );
}
