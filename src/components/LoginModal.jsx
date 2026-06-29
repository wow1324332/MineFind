import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginModal({ deferredPrompt, handleInstallClick }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // 💡 [추가] 아이디 저장 체크박스 상태
  const [isRememberId, setIsRememberId] = useState(false);

  // 💡 [추가] 모달이 켜질 때, 예전에 저장해둔 아이디가 있다면 불러옵니다.
  useEffect(() => {
    // 💡 키(Key) 이름을 mineLegends_ 용으로 통일해서 안전하게 가져옵니다.
    const savedEmail = localStorage.getItem('mineLegends_savedEmail');
    const savedPassword = localStorage.getItem('mineLegends_savedPassword');

    if (savedEmail) {
      setEmail(savedEmail);
      setIsRememberId(true); // 💡 오타 수정: setRememberMe가 아니라 setIsRememberId 입니다!
    }
    if (savedPassword) {
      setPassword(savedPassword);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLoginTab) {
        await signInWithEmailAndPassword(auth, email, password);
        if (isRememberId) {
          localStorage.setItem('mineLegends_savedEmail', email);
          localStorage.setItem('mineLegends_savedPassword', password); // 💡 비밀번호 저장 추가!
        } else {
          localStorage.removeItem('mineLegends_savedEmail');
          localStorage.removeItem('mineLegends_savedPassword'); // 💡 비밀번호 삭제 추가!
        }
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        if (isRememberId) {
          localStorage.setItem('mineLegends_savedEmail', email);
          localStorage.setItem('mineLegends_savedPassword', password); // 💡 가입 시에도 비밀번호 저장!
        }
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError('이미 사용 중인 이메일입니다.');
      else if (err.code === 'auth/weak-password') setError('비밀번호는 6자리 이상이어야 합니다.');
      else if (err.code === 'auth/invalid-credential') setError('이메일/비밀번호를 확인해주세요.');
      else setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full z-50 flex items-center justify-center bg-black">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat animate-bg-breath opacity-70 pointer-events-none animate-[fadeIn_0.5s_ease-in-out]"
        style={{ backgroundImage: "url('/login-bg.jpg')" }}
      ></div>
      
      {deferredPrompt && (
        <button 
          onClick={handleInstallClick}
          className="fixed top-12 right-4 z-[9999] bg-black/60 hover:bg-black/80 border border-white/20 text-white text-sm px-4 py-2 rounded-full font-bold shadow-2xl backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5"
        >
          <span>📲</span> Install
        </button>
      )}

      <div className="relative z-10 w-full max-w-xs mx-4 p-5 bg-black/60 rounded-2xl shadow-2xl backdrop-blur-sm transition-all animate-[fadeIn_0.5s_ease-in-out]">
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
              placeholder="ID(E-mail)..." 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // 💡 [추가] 브라우저가 아이디 자동완성을 제안하도록 속성 추가
              autoComplete="username"
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
              // 💡 [추가] 브라우저가 비밀번호 저장/자동완성을 제안하도록 속성 추가
              autoComplete={isLoginTab ? "current-password" : "new-password"}
              className="w-full px-3.5 py-2.5 bg-black/60 text-white text-sm rounded-lg border border-white/10 focus:outline-none focus:border-white placeholder-neutral-500"
              required
            />
          </div>

          {/* 💡 [추가] 다크 판타지 컨셉에 맞는 '아이디 저장' 체크박스 */}
          <div className="flex items-center gap-2 px-1">
            <input 
              type="checkbox" 
              id="rememberId"
              checked={isRememberId}
              onChange={(e) => setIsRememberId(e.target.checked)}
              className="w-4 h-4 accent-black bg-black/60 border-white/20 rounded cursor-pointer"
            />
            <label htmlFor="rememberId" className="text-xs text-neutral-400 cursor-pointer hover:text-neutral-200 transition-colors">
              Remember
            </label>
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
