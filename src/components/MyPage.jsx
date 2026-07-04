import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { db } from '../firebase'; 
import { useAuth } from '../hooks/useAuth'; 

export default function MyPage({ onBack }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); 
  
  // 💡 닉네임 편집 모드 상태 추가
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  
  const [nickname, setNickname] = useState(''); 
  const [userTitle, setUserTitle] = useState('무명의 용사'); 
  const [tempNickname, setTempNickname] = useState('');
  
  const { user } = useAuth(); 

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
          // 계급(rank) 로직 삭제
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };

    fetchUserData();
  }, [user]);

  // 모달 닫힐 때 편집 모드도 초기화
  useEffect(() => {
    if (isProfileOpen) {
      setTempNickname(nickname);
      setIsEditingNickname(false);
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
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { nickname: tempNickname }, { merge: true });
      setNickname(tempNickname); 
      setIsEditingNickname(false); // 💡 저장 후 모달창이 아닌 편집 필드만 닫도록 수정
    } catch (error) {
      console.error("저장 에러:", error);
      alert('저장에 실패했습니다.');
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center px-6 pb-6 pt-0 animate-[fadeIn_0.5s_ease-in-out] overflow-hidden">
      
      {/* 화면 전체 배경 */}
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
        
        {/* 프로필 팝업 버튼 */}
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
          
          <div className="relative z-10 w-full max-w-sm rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.9)] flex flex-col items-center min-h-[500px]">
            
            {/* 💡 [핵심] 배경 분리 및 블러(Blur) 처리: 배경 이미지만 흐려지고, 글씨는 선명하게 유지됩니다. */}
            <div 
              className="absolute inset-0 bg-cover bg-center blur-[2px] scale-105"
              style={{ backgroundImage: "url('/yangpiji-bg.jpeg')" }}
            ></div>
            {/* 가독성을 높여주는 연한 오버레이 */}
            <div className="absolute inset-0 bg-amber-50/40"></div>

            {/* 실제 내용 (블러 영향 안 받음) */}
            <div className="relative z-10 w-full h-full flex flex-col">
              
              {/* 상단 탭 메뉴 */}
              <div className="w-full flex border-b border-amber-900/20 bg-amber-950/5">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'profile' ? 'text-amber-950 bg-amber-900/10 border-b-2 border-amber-900' : 'text-amber-900/50'}`}
                >
                  캐릭터 프로필
                </button>
                <button 
                  onClick={() => setActiveTab('account')}
                  className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'account' ? 'text-amber-950 bg-amber-900/10 border-b-2 border-amber-900' : 'text-amber-900/50'}`}
                >
                  계정 정보
                </button>
              </div>

              <div className="w-full p-6 flex-1 flex flex-col items-center">
                
                {/* 1. 프로필 탭 내용 */}
                {activeTab === 'profile' && (
                  <div className="w-full animate-[fadeIn_0.3s_ease-in-out] flex flex-col items-center mt-2">
                    
                    {/* 아바타 영역 */}
                    <div className="relative w-24 h-24 mb-4">
                      <div className="absolute inset-0 rounded-full border-4 border-amber-900/30 shadow-inner"></div>
                      <img 
                        src={user?.photoURL || "/default-avatar.png"} 
                        alt="Avatar" 
                        className="w-full h-full rounded-full object-cover p-1"
                      />
                    </div>

                    {/* 💡 칭호 (가운데 정렬 & 항목명 제거) */}
                    <h3 className="text-xl font-black text-amber-950 font-serif tracking-widest drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)] mb-2">
                      {userTitle}
                    </h3>

                    {/* 💡 닉네임 및 편집 버튼 (시네마틱) */}
                    {!isEditingNickname ? (
                      <div className="flex items-center justify-center space-x-2 mt-2 bg-amber-900/5 px-4 py-2 rounded-full border border-amber-900/10">
                        <span className="text-lg font-bold text-amber-900 tracking-wide">{nickname}</span>
                        <button 
                          onClick={() => {
                            setTempNickname(nickname);
                            setIsEditingNickname(true);
                          }}
                          className="p-1.5 rounded-full hover:bg-amber-900/10 transition-colors group"
                          title="닉네임 편집"
                        >
                          {/* 깃펜(Pencil) 형태의 얇고 세련된 SVG 아이콘 */}
                          <svg className="w-4 h-4 text-amber-900/60 group-hover:text-amber-950 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="w-full bg-amber-950/5 border border-amber-900/20 rounded-lg p-4 shadow-inner mt-2 animate-[fadeIn_0.2s_ease-in-out]">
                        <label className="text-[10px] font-bold text-amber-900/60 uppercase mb-2 block">새 닉네임 입력</label>
                        <div className="flex space-x-2">
                          <input 
                            type="text"
                            value={tempNickname}
                            onChange={(e) => setTempNickname(e.target.value)}
                            maxLength={10}
                            className="flex-1 min-w-0 bg-white/30 border border-amber-900/30 rounded px-2 py-1.5 text-sm text-amber-950 font-bold focus:outline-none focus:border-amber-700"
                            placeholder="최대 10자"
                          />
                          <button onClick={handleSaveNickname} className="shrink-0 px-3 py-1.5 bg-amber-900 text-amber-50 text-xs font-bold rounded hover:bg-amber-800 transition-colors">
                            저장
                          </button>
                          <button onClick={() => setIsEditingNickname(false)} className="shrink-0 px-3 py-1.5 bg-transparent border border-amber-900/40 text-amber-900 text-xs font-bold rounded hover:bg-amber-900/10 transition-colors">
                            취소
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. 계정 탭 내용 */}
                {activeTab === 'account' && (
                  <div className="w-full animate-[fadeIn_0.3s_ease-in-out] space-y-4 mt-2">
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
                    
                    <p className="text-[10px] text-center text-amber-900/50 italic">
                      * 계정 정보는 안전하게 보호됩니다.
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
        </div>
      )}

    </div>
  );
}
