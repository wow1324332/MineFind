// src/components/LoginModal.jsx
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginModal() {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // PWA 설치 프롬프트 상태
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // PWA 설치 가능 여부 감지
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // 기본 설치 팝업 막기
      setDeferredPrompt(e); // 이벤트를 저장해둠
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // 설치 버튼 클릭 핸들러
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // 브라우저 설치 팝업 띄우기
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('사용자가 앱 설치를 수락했습니다.');
      } else {
        console.log('사용자가 앱 설치를 거부했습니다.');
      }
      setDeferredPrompt(null); // 프롬프트 사용 후 초기화
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLoginTab) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError('이미 사용 중인 이메일입니다.');
      else if (err.code === 'auth/weak-password') setError('비밀번호는 6자리 이상이어야 합니다.');
      else if (err.code === 'auth/invalid-credential') setError('이메일이나 비밀번호가 틀렸습니다.');
      else setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url('/login-bg.jpg')" }}
      ></div>
      
      {/* PWA 설치 버튼 (우측 상단 고정) */}
      {deferredPrompt && (
        <button 
          onClick={handleInstallClick}
          className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/30 border border-white/40 text-white px-4 py-2 rounded-full font-bold shadow-lg backdrop-blur-sm transition-all active:scale-95 flex items-center gap-2"
        >
          <span>📲</span> 앱 설치
        </button>
      )}

      <div className="relative z-10 w-full max-w-sm mx-4 p-6 bg-neutral-900/80 rounded-2xl shadow-2xl border border-neutral-700 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center text-white mb-6 tracking-widest drop-shadow-md">MINE LEGENDS</h1>
        
        <div className="flex mb-6 border-b border-neutral-600">
          <button 
            className={`flex-1 pb-2 font-bold text-lg transition-colors ${isLoginTab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-neutral-400 hover:text-neutral-200'}`}
            onClick={() => setIsLoginTab(true)}
          >
            로그인
          </button>
          <button 
            className={`flex-1 pb-2 font-bold text-lg transition-colors ${!isLoginTab ? 'text-red-400 border-b-2 border-red-400' : 'text-neutral-400 hover:text-neutral-200'}`}
            onClick={() => setIsLoginTab(false)}
          >
            계정 생성
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder="이메일 (ID)" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800/90 text-white rounded-lg border border-neutral-600 focus:outline-none focus:border-blue-500 placeholder-neutral-500"
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="비밀번호 (6자 이상)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800/90 text-white rounded-lg border border-neutral-600 focus:outline-none focus:border-blue-500 placeholder-neutral-500"
              required
            />
          </div>
          
          {error && <p className="text-red-400 text-sm font-bold text-center bg-red-900/30 p-2 rounded">{error}</p>}
          
          <button 
            type="submit" 
            className={`w-full py-3 rounded-lg font-bold text-lg text-white shadow-lg transition-transform active:scale-95 ${isLoginTab ? 'bg-blue-600 hover:bg-blue-500' : 'bg-red-700 hover:bg-red-600'}`}
          >
            {isLoginTab ? '던전 입장' : '정화자 등록'}
          </button>
        </form>
      </div>
    </div>
  );
}
