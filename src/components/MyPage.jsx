import React, { useState, useEffect } from 'react';
// 💡 파이어베이스 핵심 기능들을 불러옵니다.
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
// 🚨 본인의 프로젝트 구조에 맞게 firebase 설정(db) 파일과 로그인(useAuth) 훅의 경로를 꼭 확인해주세요!
import { db } from '../firebase'; 
import { useAuth } from '../hooks/useAuth'; 

export default function MyPage({ onBack }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [nickname, setNickname] = useState('로딩 중...'); // 초기 로딩 상태 표시
  const [tempNickname, setTempNickname] = useState('');
  
  // 💡 현재 로그인된 유저의 고유 ID(uid)를 가져옵니다.
  const { user } = useAuth(); 

  // 💡 1. 화면이 켜지면 파이어베이스 구름 데이터베이스에서 유저의 진짜 닉네임을 불러옵니다.
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        // users 콜렉션에서 현재 로그인한 유저의 UID를 이름으로 가진 문서를 찾습니다.
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists() && userDoc.data().nickname) {
          setNickname(userDoc.data().nickname);
        } else {
          setNickname('용사'); // 파이어베이스에 저장된 게 없다면 기본값 세팅
        }
      } catch (error) {
        console.error("파이어베이스 데이터 로딩 실패:", error);
        setNickname('용사');
      }
    };

    fetchUserData();
  }, [user]);

  // 모달이 열릴 때 현재 닉네임을 인풋창에 미리 넣어줍니다.
  useEffect(() => {
    if (isProfileOpen) {
      setTempNickname(nickname === '로딩 중...' ? '' : nickname);
    }
  }, [isProfileOpen, nickname]);

  // 💡 2. [변경] 버튼을 누르면 파이어베이스에 영구 저장합니다. (절대 날아가지 않음)
  const handleSaveNickname = async () => {
    if (!tempNickname.trim()) {
      alert('닉네임을 입력해주세요!');
      return;
    }
    if (tempNickname.length > 10) {
      alert('닉네임은 최대 10자까지 설정 가능합니다.');
      return;
    }
    if (!user) {
      alert('로그인 정보가 올바르지 않습니다.');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.uid);
      
      // { merge: true } 를 주어야 기존 유저 문서에 레벨, 골드 등 다른 정보가 있어도 날아가지 않고 닉네임만 쏙 바뀝니다.
      await setDoc(userDocRef, { nickname: tempNickname }, { merge: true });
      
      setNickname(tempNickname); // 화면에 실시간 반영
      setIsProfileOpen(false); // 모달 닫기
    } catch (error) {
      console.error("파이어베이스 저장 에러:", error);
      alert('데이터베이스 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center px-6 pb-6 pt-0 animate-[fadeIn_0.5s_ease-in-out] overflow-hidden">
      
      {/* 배경 이미지 */}
      <div 
        className="absolute inset-x-0 top-[15%] bottom-0 bg-cover bg-bottom bg-no-repeat opacity-60 z-0 pointer-events-none"
        style={{ 
          backgroundImage: "url('/mypage-bg.jpeg')", 
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)'
        }}
      ></div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        
        {/* 타이틀 영역 */}
        <div className="w-full max-w-sm mt-2 mb-0 mx-auto relative flex justify-center pointer-events-none z-20">
          <div 
            className="w-full"
            style={{ 
              WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
            }}
          >
            <img 
              src="/mypage-title.jpeg" 
              alt="My Page Title" 
              className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.2)]"
            />
          </div>
        </div>

        {/* 돌담 헤더 */}
        <div className="w-full max-w-sm h-12 -mt-1 mb-0 flex justify-between items-center relative z-10">
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

          {/* 왼쪽 뒤로 가기 버튼 */}
          <button 
            onClick={onBack}
            className="transition-all duration-150 brightness-90 saturate-90 active:scale-90 active:brightness-75 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] px-2 select-none z-30"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            <img src="/My-icon.png" alt="Back" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
          </button>
          
          {/* 헤더 중앙 닉네임 표시 (파이어베이스에서 받아온 값 연동) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-lg font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-200 to-yellow-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-serif">
              {nickname}
            </span>
          </div>
          
          <div className="w-12 px-2 pointer-events-none"></div>
        </div>
        
        {/* 간격 긴밀하게 유지 완료 (-mt-16) */}
        <div className="w-full max-w-sm flex flex-col items-center -mt-16 space-y-4 relative z-20">
          
          {/* 마이 프로필 휘장 버튼 */}
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="w-full max-w-[18rem] transition-all duration-200 hover:brightness-110 active:scale-95 drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] select-none"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            <img 
              src="/myprofile-bt.png" 
              alt="My Profile" 
              className="w-full h-auto object-contain pointer-events-none" 
              draggable="false"
            />
          </button>

        </div>
      </div>

      {/* 마이 프로필 모달창 */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 animate-[fadeIn_0.2s_ease-in-out]">
          
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsProfileOpen(false)}
          ></div>
          
          <div className="relative z-10 w-full max-w-sm bg-neutral-900 border-2 border-amber-700/60 rounded-xl p-6 shadow-2xl flex flex-col items-center">
            
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-300 mb-6 font-serif tracking-wider">
              My Profile
            </h2>
            
            {/* 닉네임 설정 메뉴 구역 */}
            <div className="w-full bg-black/40 border border-neutral-800 rounded-lg p-5 mb-6 flex flex-col items-start space-y-2">
              <label className="text-xs font-bold text-amber-500/80 tracking-wider uppercase">
                Change Nickname
              </label>
              <div className="w-full flex space-x-2">
                <input 
                  type="text"
                  value={tempNickname}
                  onChange={(e) => setTempNickname(e.target.value)}
                  maxLength={10}
                  className="flex-1 bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-600 transition-colors"
                  placeholder="닉네임 입력 (최대 10자)"
                />
                <button
                  onClick={handleSaveNickname}
                  className="px-4 py-2 bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 border border-amber-900/50 rounded text-xs font-bold text-white transition-all active:scale-95 shadow-md"
                >
                  변경
                </button>
              </div>
            </div>

            <button 
              onClick={() => setIsProfileOpen(false)}
              className="px-8 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded text-xs font-bold text-neutral-400 hover:text-neutral-200 transition-all active:scale-95"
            >
              닫기
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
