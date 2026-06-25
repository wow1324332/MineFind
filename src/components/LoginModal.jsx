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
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // 1. 브라우저가 설치를 허락한 경우 (정상 동작)
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') console.log('PWA 설치 완료');
      setDeferredPrompt(null);
    } else {
      // 2. 환경 문제로 자동 설치가 불가능한 경우 (수동 안내)
      alert(
        "이미 앱이 설치되어 있거나, 자동 설치를 지원하지 않는 환경(아이폰, 인앱 브라우저 등)입니다.\n\n" +
        "💡 수동 설치 방법:\n" +
        "브라우저의 메뉴(⋮) 또는 공유(↑) 버튼을 누르고\n" +
        "'홈 화면에 추가'를 선택해 주세요!"
      );
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
      {/* 배경 이미지 선명도 확보를 위해 opacity를 70%로 살짝 상향 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-bg-breath"
        style={{ backgroundImage: "url('/login-bg.jpg')" }}
      ></div>
      
      {deferredPrompt && (
      <button 
        onClick={handleInstallClick}
        className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 border border-white/20 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg backdrop-blur-sm transition-all active:scale-95 flex items-center gap-1.5"
      >
        Install
      </button>
      )}

      {/* [주요 변경 포인트]
        1. max-w-sm(384px) -> max-w-xs(320px)로 가로폭 대폭 축소
        2. bg-neutral-900/80 -> bg-neutral-900/40으로 투명도 극대화 (배경이 훤히 보임)
        3. backdrop-blur-md -> backdrop-blur-sm으로 블러를 낮춰 뒷배경의 형체가 더 잘 인지되도록 변경
        4. 내부 패딩(p-6 -> p-5) 및 컴포넌트 간격(mb-6 -> mb-4, space-y-4 -> space-y-3) 축소로 컴팩트화
      */}
      <div className="relative z-10 w-full max-w-xs mx-4 p-5 bg-black/60 rounded-2xl shadow-2xl backdrop-blur-sm transition-all">
        {/* 타이틀 크기 축소 (text-3xl -> text-xl) */}
        <div className="flex justify-center mb-4">
          <img 
           src="/title-logo.png" 
           alt="Mine Legend" 
           className="w-48 h-auto object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]"
          />
        </div>
        
        {/* 탭 버튼 마진 축소 */}
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

        {/* 인풋창 간격 및 높이 축소 (py-3 -> py-2.5) */}
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
          
          {/* 버튼 높이 축소 (py-3 -> py-2.5) */}
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
