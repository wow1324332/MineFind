import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { db } from '../firebase'; 
import { useAuth } from '../hooks/useAuth'; 

export default function MyPage({ onBack }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); 
  
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  
  const [nickname, setNickname] = useState(''); 
  const [userTitle, setUserTitle] = useState('무명의 용사'); 
  const [tempNickname, setTempNickname] = useState('');
  
  // 💡 프로필 이미지 업로드를 위한 상태와 Ref
  const [avatarUrl, setAvatarUrl] = useState('');
  const fileInputRef = useRef(null);
  
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
          // 실제 서비스 시 파이어베이스에서 저장된 이미지 URL을 불러옵니다.
          if (data.photoURL) setAvatarUrl(data.photoURL);
        }
        
        // 파이어베이스에 이미지가 없을 경우 구글 기본 이미지 또는 기본 아바타 세팅
        if (!avatarUrl) {
          setAvatarUrl(user.photoURL || "/default-avatar.png");
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };

    fetchUserData();
  }, [user, avatarUrl]);

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
      setIsEditingNickname(false); 
    } catch (error) {
      console.error("저장 에러:", error);
      alert('저장에 실패했습니다.');
    }
  };

  // 💡 갤러리 이미지 선택 핸들러 (미리보기)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
        // 🚨 참고: 영구 저장을 위해서는 Firebase Storage 연동 코드가 이곳에 추가되어야 합니다.
      };
      reader.readAsDataURL(file);
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
        
        <div className="w-full max-w-sm mt-2 mb-0 mx-auto relative flex justify-center pointer-events-none z-20">
          <div className="w-full" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' }}>
            <img src="/mypage-title.jpeg" alt="Title" className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.2)]" />
          </div>
        </div>

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
          
          <div className="relative z-10 w-full max-w-sm rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.9)] flex flex-col items-center min-h-[400px]">
            
            {/* 💡 배경 원상복구 (흐림 효과 제거) */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/yangpiji-bg.jpeg')" }}
            ></div>

            {/* 💡 시네마틱 우측 상단 X 닫기 버튼 */}
            <button 
              onClick={() => setIsProfileOpen(false)}
              className="absolute top-3 right-3 p-2 text-amber-900/60 hover:text-amber-950 transition-transform hover:scale-110 z-30"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            {/* 실제 내용 */}
            <div className="relative z-10 w-full h-full flex flex-col">
              
              {/* 상단 탭 메뉴 */}
              <div className="w-full flex border-b border-amber-900/30 bg-amber-950/10 pt-2 pr-10">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-3 text-sm font-bold transition-all ${activeTab === 'profile' ? 'text-amber-950 bg-amber-50/40 border-b-2 border-amber-900 rounded-t-lg mx-1' : 'text-amber-900/60 hover:text-amber-900 mx-1'}`}
                >
                  캐릭터 프로필
                </button>
                <button 
                  onClick={() => setActiveTab('account')}
                  className={`flex-1 py-3 text-sm font-bold transition-all ${activeTab === 'account' ? 'text-amber-950 bg-amber-50/40 border-b-2 border-amber-900 rounded-t-lg mx-1' : 'text-amber-900/60 hover:text-amber-900 mx-1'}`}
                >
                  계정 정보
                </button>
              </div>

              <div className="w-full p-6 flex-1 flex flex-col mt-2">
                
                {/* 1. 프로필 탭 내용 */}
                {activeTab === 'profile' && (
                  <div className="w-full animate-[fadeIn_0.3s_ease-in-out]">
                    
                    {/* 💡 좌측 사각 프레임 + 우측 텍스트 정보 레이아웃 */}
                    <div className="flex flex-row items-center bg-amber-50/60 border border-amber-900/20 p-4 rounded-xl shadow-sm backdrop-blur-sm">
                      
                      {/* 💡 좌측 사진 영역 (클릭하여 갤러리 열기) */}
                      <div 
                        className="relative w-20 h-20 shrink-0 cursor-pointer group"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {/* 낡은 사각 프레임 테두리 */}
                        <div className="absolute inset-0 border-2 border-amber-900/40 rounded-lg group-hover:border-amber-700 transition-colors z-10"></div>
                        <img 
                          src={avatarUrl} 
                          alt="Avatar" 
                          className="w-full h-full rounded-lg object-cover"
                        />
                        {/* 사진 변경 오버레이 아이콘 (마우스 올렸을 때) */}
                        <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        {/* 숨겨진 갤러리 파일 업로드 input */}
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleImageChange} 
                        />
                        
                        {/* 💡 우측 하단 레벨 뱃지 */}
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-b from-amber-700 to-amber-900 text-amber-50 text-[10px] px-2 py-0.5 rounded border border-amber-950 shadow-md z-20 font-bold">
                          LV.1
                        </div>
                      </div>

                      {/* 💡 우측 텍스트 (칭호 & 닉네임) */}
                      <div className="ml-5 flex flex-col items-start flex-1 w-full overflow-hidden">
                        
                        {/* 칭호 */}
                        <span className="text-xs font-bold text-amber-900/80 mb-1">
                          {userTitle}
                        </span>
                        
                        {/* 닉네임 및 편집 버튼 */}
                        {!isEditingNickname ? (
                          <div className="flex items-center w-full">
                            <span className="text-base font-black text-amber-950 tracking-wide truncate max-w-[120px]">
                              {nickname}
                            </span>
                            <button 
                              onClick={() => {
                                setTempNickname(nickname);
                                setIsEditingNickname(true);
                              }}
                              className="ml-2 p-1 rounded-full hover:bg-amber-900/10 transition-colors group"
                            >
                              <svg className="w-4 h-4 text-amber-900/60 group-hover:text-amber-950 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col space-y-2 w-full mt-1 animate-[fadeIn_0.2s_ease-in-out]">
                            <input 
                              type="text"
                              value={tempNickname}
                              onChange={(e) => setTempNickname(e.target.value)}
                              maxLength={10}
                              className="w-full bg-white/70 border border-amber-900/40 rounded px-2 py-1 text-sm text-amber-950 font-bold focus:outline-none focus:border-amber-700 shadow-inner"
                              placeholder="최대 10자"
                            />
                            <div className="flex space-x-1">
                              <button onClick={handleSaveNickname} className="flex-1 py-1 bg-amber-900 text-amber-50 text-[10px] font-bold rounded shadow-sm hover:bg-amber-800">
                                저장
                              </button>
                              <button onClick={() => setIsEditingNickname(false)} className="flex-1 py-1 bg-transparent border border-amber-900/40 text-amber-900 text-[10px] font-bold rounded hover:bg-amber-900/10">
                                취소
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. 계정 탭 내용 */}
                {activeTab === 'account' && (
                  <div className="w-full animate-[fadeIn_0.3s_ease-in-out] space-y-4">
                    <div className="bg-amber-50/60 backdrop-blur-sm border border-amber-900/20 rounded-xl p-5 shadow-sm">
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-bold text-amber-900/70 uppercase block mb-1">연동 이메일</label>
                          <p className="text-sm font-bold text-amber-950 break-all bg-white/40 px-3 py-2 rounded border border-amber-900/10">{user?.email || '알 수 없음'}</p>
                        </div>
                        <div className="pt-2">
                          <label className="text-[10px] font-bold text-amber-900/70 uppercase block mb-1">최초 가입일</label>
                          <p className="text-sm font-bold text-amber-950 bg-white/40 px-3 py-2 rounded border border-amber-900/10">
                            {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
