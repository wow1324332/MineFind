import React from 'react';
import { useMinesweeper } from './hooks/useMinesweeper';
import Header from './components/Header';
import Board from './components/Board';
import Controls from './components/Controls';
import LoginModal from './components/LoginModal';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { user, loading, logout } = useAuth();
  
  const { 
    board, gameStatus, minesLeft, timeElapsed, isFlagMode, 
    setIsFlagMode, initGame, handleCellClick, toggleFlag 
  } = useMinesweeper();

  // 로그인 상태 확인 중
  if (loading) {
    return <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white text-2xl font-bold">포탈 연결 중...</div>;
  }

  // 로그인되지 않은 경우 로그인 모달 표시
  if (!user) {
    return <LoginModal />;
  }

  // 로그인 완료된 경우 게임 화면 표시
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
        <Header 
          minesLeft={minesLeft} 
          gameStatus={gameStatus} 
          timeElapsed={timeElapsed} 
          onReset={initGame} 
        />
        <Board 
          board={board} 
          onCellClick={handleCellClick} 
          onCellRightClick={toggleFlag} 
        />
        <Controls 
          isFlagMode={isFlagMode} 
          setIsFlagMode={setIsFlagMode} 
        />
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
}
