import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { db } from '../firebase'; 
import { useAuth } from '../hooks/useAuth'; 

export default function MyPage({ onBack }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [nickname, setNickname] = useState(''); 
  const [tempNickname, setTempNickname] = useState('');
  
  const { user } = useAuth(); 

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists() && userDoc.data().nickname) {
          setNickname(userDoc.data().nickname);
        } else {
          setNickname(''); 
        }
      } catch (error) {
        console.error("파이어베이스 데이터 로딩 실패:", error);
        setNickname('');
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (isProfileOpen) {
      setTempNickname(nickname);
    }
  }, [isProfileOpen, nickname]);

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
      
      await setDoc(userDocRef, { nickname: tempNickname }, { merge: true });
      
      setNickname(tempNickname); 
      setIsProfileOpen(false); 
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

        {/* 돌담 헤더 (z-30 유지) */}
        <div className="w-full max-w-sm h-12 -mt-1 mb-0 flex justify-between items-center relative z-30">
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
            onClick={onBack}
            className="transition-all duration-150 brightness-90 saturate-90 active:scale-90 active:brightness-75 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] px-2 select-none"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            <img src="/My-icon.png" alt="Back" className="w-8 h-8 object-contain pointer-events-none" draggable="false" />
          </button>
          
          {nickname && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <span className="text-base font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-200 to-yellow-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-serif">
                {nickname}
              </span>
            </div>
          )}
          
          <div className="w-12 px-2 pointer-events-none"></div>
        </div>
        
        {/* 컨텐츠 영역 (z-10 유지) */}
        <div className="w-full max-w-sm flex flex-col items-center -mt-16 space-y-4 relative z-10">
          
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
          
          {/* 어두운 오버레이 배경 */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsProfileOpen(false)}
          ></div>
          
          {/* 💡 [핵심 수정] 양피지 이미지를 배경으로 설정하고 글자색을 진갈색(amber-950)으로 반전시켰습니다. */}
          <div 
            className="relative z-10 w-full max-w-sm rounded-xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col items-center bg-cover bg-center"
            style={{ backgroundImage: "url('/yangpiji-bg.jpeg')" }}
          >
            
            {/* 타이틀: 잉크로 쓴 듯한 폰트와 밑줄 */}
            <h2 className="text-2xl font-bold text-amber-950 mb-6 font-serif tracking-wider drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)] border-b-2 border-amber-900/30 pb-2 w-full text-center">
              My Profile
            </h2>

            {/* 계정 정보 구역: 종이 질감에 맞게 배경 투명도와 테두리를 갈색으로 조정 */}
            <div className="w-full bg-amber-950/10 border border-amber-900/30 rounded-lg p-5 mb-4 flex flex-col items-start space-y-3 shadow-inner">
              <label className="text-xs font-bold text-amber-900 tracking-wider uppercase border-b border-amber-900/20 pb-2 w-full text-left">
                Account Info
              </label>
              
              <div className="w-full flex flex-col space-y-2 text-sm font-medium">
                <div className="flex justify-between items-center">
                  <span className="text-amber-900/80">이메일</span>
                  <span className="text-amber-950">{user?.email || '알 수 없음'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-amber-900/80">가입일</span>
                  <span className="text-amber-950">
                    {user?.metadata?.creationTime 
                      ? new Date(user.metadata.creationTime).toLocaleDateString('ko-KR') 
                      : '-'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* 닉네임 변경 구역 */}
            <div className="w-full bg-amber-950/10 border border-amber-900/30 rounded-lg p-4 mb-6 flex flex-col items-start space-y-2 shadow-inner">
              <label className="text-xs font-bold text-amber-900 tracking-wider uppercase">
                Change Nickname
              </label>
              
              <div className="w-full flex space-x-2 items-center mt-1">
                {/* 인풋 필드: 투명하게 만들고 테두리만 잉크색으로 부여 */}
                <input 
                  type="text"
                  value={tempNickname}
                  onChange={(e) => setTempNickname(e.target.value)}
                  maxLength={10}
                  className="flex-1 min-w-0 bg-transparent border border-amber-900/50 rounded px-
