import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginModal() {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('PWA 설치 티켓 발급 완료');
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') console.log('PWA 설치 완료');
      setDeferredPrompt(null);
    } else {
      alert("이미 앱이 설치되어 있거나 자동 설치를 지원하지 않는 기기입니다.\n\n브라우저 메뉴에서 '홈 화면에 추가'를 눌러주세요.");
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
      else if (err.code === 'auth/invalid-credential') setError('이메일/비밀번호를 확인해주세요.');
      else setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* 배경 이미지 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-bg-breath opacity-70"
        style={{ backgroundImage: "url('/login-bg.jpg')" }}
      ></div>
      
      {/* 🚨 PWA 설치 버튼 (조건문 없이 무조건 노출, 상단바 안 가려지게 top-12 설정) 🚨 */}
      <button 
        onClick={handleInstallClick}
        className="fixed top-12 right-4 z-[9999] bg-black/60 hover:bg-black/80 border border-white/20 text-white text-sm px-4 py-2 rounded-full font-bold shadow-2xl backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5"
      >
        <span>📲</span> Install
      </button>

      {/* 로그인 폼 영역 */}
      <div className="relative z-10 w-full max-w-xs mx-4 p-5 bg-black/60 rounded-2xl shadow-2xl backdrop-blur-sm transition-all">
        <div className="flex justify-center mb-4">
          <img 
            src="/title-logo.png" 
            alt="Mine Legend" 
            className="w-48 h-auto object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]"
          />
        </div>
        
        <div className="flex mb-4 border-b border-white/10 text-sm">
          <button 
            className={`flex-1 pb-1.5 font-bold transition-colors ${isLoginTab ? 'text-white border-b-2 border-white' : 'text-neutral-400 hover:text-neutral-200'}`}
            onClick={() => setIsLoginTab(true)}
          >
            Login
          </button>
          <button 
            className={`flex-1 pb-1.5 font-bold transition-colors ${!isLoginTab ? 'text-white border-b-2 border-white' : 'text-neutral-400 hover:text-neutral-200'}`}
            onClick={() => setIsLoginTab(false)}
          >
            Create
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input 
              type="email" 
              placeholder="ID..." 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-black/60 text-white text-sm rounded-lg border border-white/10 focus:outline-none focus:border-white placeholder-neutral-500"
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-black/60 text-white text-sm rounded-lg border border-white/10 focus:outline-none focus:border-white placeholder-neutral-500"
              required
            />
          </div>
          
          {error && <p className="text-red-400 text-xs font-bold text-center bg-red-950/40 p-1.5 rounded border border-red-900/50">{error}</p>}
          
          <button 
            type="submit" 
            aria-label={isLoginTab ? 'Login' : 'Create'}
            className="w-full h-10 rounded-lg shadow-md transition-all active:scale-95 hover:brightness-110"
            style={{ 
              backgroundImage: "url('/login-button-bg.jpg')", 
              backgroundSize: 'cover', 
              backgroundPosition: 'center' 
            }}
          />
        </form>
      </div>
    </div>
  );
}
