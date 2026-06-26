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
    message: "Unsealing Devil Mine...",
    logoSrc: "/Splash-logo.jpg",
    bgSrc: "/stone-tablet.jpg" 
  },
  GAME_LOADING: {
    message: "Generating Devil's Dungeon...",
    logoSrc: "/Splash-logo.jpg",
    bgSrc: "/stone-tablet.jpg" 
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

  // 💡 [추가] 뒤로가기 방지 및 더블탭 종료 로직
  const lastBackPressTime = useRef(0);

  useEffect(() => {
    // 1. 앱이 켜지자마자 현재 위치에 '가짜 방문 기록'을 하나 쑤셔 넣습니다.
    window.history.pushState(null, null, window.location.href);

    const handlePopState = (e) => {
      // 2. 사용자가 뒤로가기(백스와이프)를 시도하면, 진짜 뒤로 가지 못하게 즉시 가짜 기록을 다시 덮어씌웁니다.
      window.history.pushState(null, null, window.location.href);

      const currentTime = new Date().getTime();

      // 3. 더블 탭 계산: 방금 누른 시간과 지금 누른 시간의 차이가 2초(2000ms) 이내라면?
      if (currentTime - lastBackPressTime.current < 2000) {
        // 💥 두 번 연속 누름: 종료 확인 창 띄우기
        if (window.confirm("포탈을 닫고 앱을 종료하시겠습니까?")) {
          // 참고: 웹/PWA 환경에서는 보안상 window.close()가 완벽히 동작하지 않을 수 있습니다.
          // 작동하지 않을 경우를 대비해 빈 페이지나 로그인 화면으로 튕겨내는 로직을 넣기도 합니다.
          window.close(); 
        }
      } else {
        // 📱 한 번 누름: 진동만 울리고 무반응 (현재 시간 기록)
        lastBackPressTime.current = currentTime;
        
        // 기기가 진동을 지원하면 200ms(0.2초) 동안 짧게 진동합니다.
        if (navigator.vibrate) {
          navigator.vibrate(200); 
        }
      }
    };

    // 브라우저의 '뒤로가기' 이벤트(popstate)가 발생할 때마다 위 함수를 실행하도록 연결합니다.
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
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

  // 4. 일반 화면
  switch (currentScreen) {
    case 'HUNT_LIST':
      return <HuntList onSelectDevilMine={handleSelectDevilMine} />;
    
    case 'DEVIL_MINE_MODE':
      return <DevilMineMode onSelectPVE={handleSelectPVE} onBack={() => setCurrentScreen('HUNT_LIST')} />;
    
    case 'GAME_PVE':
      return (
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
    
    default:
      return null;
  }
}
