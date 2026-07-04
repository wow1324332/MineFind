import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { db } from '../firebase'; 
import { useAuth } from '../hooks/useAuth'; 

export default function MyPage({ onBack }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' 또는 'account'
  
  // 유저 정보 상태
  const [nickname, setNickname] = useState(''); 
  const [userTitle, setUserTitle] = useState('무명의 용사'); // 칭호 기본값
  const [userRank, setUserRank] = useState('훈련병'); // 계급 기본값
  const [tempNickname, setTempNickname] = useState('');
  
  const { user } = useAuth(); 

  // 데이터 로딩
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.nickname) setNickname(data.nickname);
          if (data.title) setUserTitle(data.title);
          if (data.rank) setUserRank(data.rank);
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };

    fetchUserData();
  }, [user]);

  // 모달 열릴 때 인풋 초기화
  useEffect(() => {
    if (isProfileOpen) {
      setTempNickname(nickname);
    }
  }, [isProfileOpen, nickname]);

  // 닉네임 저장
  const handleSaveNickname = async () => {
    if (!tempNickname.trim()) {
      alert('닉네임을 입력해주세요!');
      return;
    }
    if (tempNickname.length > 10) {
      alert('닉네임은 최대 10자까지 설정 가능합니다.');
      return;
    }
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { nickname: tempNickname }, { merge: true });
      setNickname(tempNickname); 
      alert('닉네임이 변경되었습니다.');
    } catch (error) {
      console.error("저장 에러:", error);
      alert('저장에 실패했습니다.');
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
        
        {/* 타이틀 */}
        <div className="w-full max-w-sm mt-2 mb-0 mx-auto relative flex justify-center pointer-events-none z-20">
          <div className="w-full" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' }}>
            <img src="/mypage-title.jpeg" alt="Title" className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.2)]" />
          </div>
        </div>

        {/* 헤더 */}
        <div className="w-full max-w-sm h-12 -mt-1 mb-0 flex justify-between items-center relative z-30">
          <div className="absolute top-0 w-[100vw] left-1/2 -translate-x-1/2 h-full bg-cover bg-center pointer-events-none -z-10" style={{ backgroundImage: "url('/header-bg.jpg')", WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)' }}>
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <button onClick={onBack} className="transition-all duration-150 active:scale-90 px-2 outline-none">
            <img src="/My-icon.png" alt="Back" className="w-8 h-8 object-contain" />
          </button>
          {nickname && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <span className="text-base font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-200 to-yellow-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-serif">
                {nickname}
              </span>
            </div>
          )}
          <div className="w-12 px-2"></div>
        </div>
        
        {/* 버튼 */}
        <div className="w-full max-w-sm flex flex-col items-center -mt-16 space-y-4 relative z-10">
          <button onClick={() => setIsProfileOpen(true)} className="w-full max-w-[18rem] transition-all duration-200 hover:brightness-110 active:scale-95 drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]">
            <img src="/myprofile-bt.png" alt="My Profile" className="w-full h-auto object-contain" />
          </button>
        </div>
      </div>

      {/* 마이 프로필 모달 */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 animate-[fadeIn_0.2s_ease-in-out]">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsProfileOpen(false)}></div>
          
          <div 
            className="relative z-10 w-full max-w-sm rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.9)] flex flex-col items-center bg-cover bg-center min-h-[500px]"
            style={{ backgroundImage: "url('/yangpiji-bg.jpeg')" }}
          >
            {/* 상단 탭 메뉴 */}
            <div className="w-full flex border-b border-amber-900/20 bg-amber-950/5">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'profile' ? 'text-amber-950 bg-amber-900/10 border-b-2 border-amber-900' : 'text-amber-900/40'}`}
              >
                캐릭터 프로필
              </button>
              <button 
                onClick={() => setActiveTab('account')}
                className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'account' ? 'text-amber-950 bg-amber-900/10 border-b-2 border-amber-900' : 'text-amber-900/40'}`}
              >
                계정 정보
              </button>
            </div>

            <div className="w-full p-6 flex-1 flex flex-col items-center">
              
              {/* 1. 프로필 탭 내용 */}
              {activeTab === 'profile' && (
                <div className="w-full animate-[fadeIn_0.3s_ease-in-out] flex flex-col items-center">
                  {/* 프로필 사진 (휘장 느낌) */}
                  <div className="relative w-24 h-24 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-amber-900/20 shadow-inner"></div>
                    <img 
                      src={user?.photoURL || "/default-avatar.png"} 
                      alt="Avatar" 
                      className="w-full h-full rounded-full object-cover p-1"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-amber-900 text-amber-50 text-[10px] px-2 py-0.5 rounded-full border border-amber-700">
                      LV.1
                    </div>
                  </div>

                  {/* 상세 정보 리스트 */}
                  <div className="w-full space-y-3 mb-6">
                    <div className="flex justify-between items-center bg-amber-950/5 p-3 rounded-lg border border-amber-900/10">
                      <span className="text-xs font-bold text-amber-900/60 uppercase">칭호</span>
                      <span className="text-sm font-bold text-amber-950">{userTitle}</span>
                    </div>
                    <div className="flex justify-between items-center bg-amber-950/5 p-3 rounded-lg border border-amber-900/10">
                      <span className="text-xs font-bold text-amber-900/60 uppercase">계급</span>
                      <span className="text-sm font-bold text-amber-950">{userRank}</span>
                    </div>
                  </div>

                  {/* 닉네임 변경 (잉크 스타일) */}
                  <div className="w-full bg-amber-950/5 border border-amber-900/20 rounded-lg p-4 shadow-inner">
                    <label className="text-[10px] font-bold text-amber-900/60 uppercase mb-2 block">닉네임 변경</label>
                    <div className="flex space-x-2">
                      <input 
                        type="text"
                        value={tempNickname}
                        onChange={(e) => setTempNickname(e.target.value)}
                        maxLength={10}
                        className="flex-1 min-w-0 bg-white/20 border border-amber-900/30 rounded px-2 py-1.5 text-sm text-amber-950 font-bold focus:outline-none focus:border-amber-700"
                        placeholder="새 닉네임"
                      />
                      <button onClick={handleSaveNickname} className="shrink-0 px-3 py-1.5 bg-amber-900 text-amber-50 text-xs font-bold rounded hover:bg-amber-800 transition-colors">
                        적용
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. 계정 탭 내용 */}
              {activeTab === 'account' && (
                <div className="w-full animate-[fadeIn_0.3s_ease-in-out] space-y-4">
                  <div className="bg-amber-950/5 border border-amber-900/20 rounded-lg p-5 shadow-inner">
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-amber-900/60 uppercase block mb-1">연동 이메일</label>
                        <p className="text-sm font-bold text-amber-950 break-all">{user?.email || '알 수 없음'}</p>
                      </div>
                      <div className="pt-4 border-t border-amber-900/10">
                        <label className="text-[10px] font-bold text-amber-900/60 uppercase block mb-1">최초 가입일</label>
                        <p className="text-sm font-bold text-amber-950">
                          {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-center text-amber-900/40 italic">
                    * 계정 정보는 보안을 위해 안전하게 보호됩니다.
                  </p>
                </div>
              )}

            </div>

            {/* 하단 닫기 버튼 */}
            <div className="w-full p-6 pt-0">
              <button 
                onClick={() => setIsProfileOpen(false)}
                className="w-full py-3 bg-amber-950/10 hover:bg-amber-950/20 border border-amber-900/40 rounded-lg text-sm font-bold text-amber-950 transition-all active:scale-95"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
