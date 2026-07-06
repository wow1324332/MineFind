import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { db } from '../firebase'; 
import { useAuth } from '../hooks/useAuth'; 

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%231e140d'/%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' fill='%238c6543'/%3E%3C/svg%3E";

const AVAILABLE_AVATARS = [
  { id: 'warrior', src: '/avatars/avatar-warrior.png', name: '전사 광부' },
  { id: 'mage', src: '/avatars/avatar-mage.png', name: '마법사 탐사원' },
  { id: 'rogue', src: '/avatars/avatar-rogue.png', name: '도적 탐험가' },
  { id: 'dwarf', src: '/avatars/avatar-dwarf.png', name: '드워프 황금 정찰꾼' },
  { id: 'elf', src: '/avatars/avatar-elf.png', name: '엘프 보물 사냥꾼' },
  { id: 'goblin', src: '/avatars/avatar-goblin.png', name: '고블린 공병' },
  { id: 'earth', src: '/avatars/avatar-earth.png', name: '대지 정령' },
  { id: 'helmet', src: '/avatars/avatar-helmet.png', name: '황금 투구' },
  { id: 'map', src: '/avatars/avatar-map.png', name: '고대 지도' },
  { id: 'chest', src: '/avatars/avatar-chest.png', name: '국왕의 보물상자' },
];

export default function MyPage({ onBack }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); 
  
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isSelectAvatarOpen, setIsSelectAvatarOpen] = useState(false);
  
  const [nickname, setNickname] = useState(''); 
  const [userTitle, setUserTitle] = useState('무명의 용사'); 
  const [tempNickname, setTempNickname] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(AVAILABLE_AVATARS[0].src);
  
  // 💡 PVE 게임 통계 및 최근 기록 상태 추가
  const [stats, setStats] = useState({ wins: 0, losses: 0 });
  const [records, setRecords] = useState([]);
  
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
          if (data.photoURL) setAvatarUrl(data.photoURL);
          
          // 파이어베이스에서 통계와 기록 불러오기 (없으면 기본값 설정)
          if (data.stats) setStats(data.stats);
          if (data.records) setRecords(data.records);
        }

        if (!avatarUrl && !userDoc.data()?.photoURL) {
          setAvatarUrl(DEFAULT_AVATAR);
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
      setIsSelectAvatarOpen(false); 
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

  const handleSelectAvatar = async (src) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { photoURL: src }, { merge: true });
      setAvatarUrl(src);
    } catch (error) {
      console.error("아바타 저장 실패:", error);
      alert("아바타 저장에 실패했습니다.");
    }
  };

  // 💡 승패 초기화 기능
  const handleResetStats = async () => {
    if (!window.confirm("정말 승패 기록을 초기화하시겠습니까?")) return;
    if (!user) return;
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const resetStats = { wins: 0, losses: 0 };
      await setDoc(userDocRef, { stats: resetStats }, { merge: true });
      setStats(resetStats);
    } catch (error) {
      console.error("통계 초기화 실패:", error);
      alert("초기화에 실패했습니다.");
    }
  };

  // 승률 계산 로직
  const totalGames = stats.wins + stats.losses;
  const winRate = totalGames > 0 ? Math.round((stats.wins / totalGames) * 100) : 0;

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center px-6 pb-6 pt-0 animate-[fadeIn_0.5s_ease-in-out] overflow-hidden">
      
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
          <div className="w-12 px-2"></div>
        </div>
        
        <div className="w-full max-w-sm flex flex-col items-center -mt-16 space-y-4 relative z-10">
          <button onClick={() => setIsProfileOpen(true)} className="w-full max-w-[18rem] transition-all duration-200 hover:brightness-110 active:scale-95 drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]">
            <img src="/myprofile-bt.png" alt="My Profile" className="w-full h-auto object-contain" />
          </button>
        </div>
      </div>

      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-[fadeIn_0.2s_ease-in-out]">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsProfileOpen(false)}></div>
          
          {/* 💡 [수정] 모달의 최대 너비를 max-w-[320px]로 줄여 슬림하게 만들었습니다. */}
          <div className="relative z-10 w-full max-w-[320px] flex flex-col rounded-md border-[3px] border-[#3c2a1a] shadow-[0_0_30px_rgba(0,0,0,1)] bg-[#1e140d]">
            
            <div className="w-full bg-[#2a1a10] border-b-[3px] border-[#1a1008] relative py-2.5 flex justify-center items-center">
              <div className="absolute left-3 w-1.5 h-1.5 rotate-45 bg-[#7c5432]"></div>
              <h2 className="text-[#d8b486] font-bold text-[15px] tracking-widest font-serif">유저 정보</h2>
              <div className="absolute right-3 w-1.5 h-1.5 rotate-45 bg-[#7c5432]"></div>
            </div>

            <div 
              className="flex-1 w-full bg-cover bg-center flex flex-col relative p-4 min-h-[350px]"
              style={{ backgroundImage: "url('/yangpiji-bg.jpeg')" }}
            >
              <div className="absolute inset-0 bg-amber-50/40 pointer-events-none"></div>

              <div className="relative z-10 h-full flex flex-col">
                
                {activeTab === 'profile' && (
                  <div className="animate-[fadeIn_0.3s_ease-in-out] h-full flex flex-col">
                    <div className="flex flex-row items-start mb-3">
                      
                      <div 
                        className={`relative w-[70px] h-[70px] shrink-0 cursor-pointer group bg-black rounded-sm border-2 ${isSelectAvatarOpen ? 'border-amber-500 shadow-[0_0_8px_rgba(230,150,50,0.5)]' : 'border-[#4a3522]'} shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-all`}
                        onClick={() => setIsSelectAvatarOpen(!isSelectAvatarOpen)}
                        title="아바타 변경"
                      >
                        <img 
                          src={avatarUrl} 
                          alt="Avatar" 
                          onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                          className="w-full h-full object-cover p-[2px]" 
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5 text-white animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18"></path></svg>
                        </div>
                        
                        <div className="absolute -bottom-1.5 -right-1.5 bg-black w-5 h-5 rounded-full border-[1.5px] border-[#a6845c] flex items-center justify-center shadow-md z-20">
                          <span className="text-white text-[9px] font-black leading-none">1</span>
                        </div>
                      </div>

                      <div className="ml-3 flex flex-col flex-1 mt-0.5">
                        <div className="flex items-center flex-wrap gap-y-1 mb-1">
                          <div className="bg-[#633f20] border border-[#a6845c] px-2 py-0.5 rounded-sm shadow-sm flex items-center justify-center">
                            <span className="text-[#f5d5a9] text-[9px] font-black tracking-wider">{userTitle}</span>
                          </div>
                          
                          {!isEditingNickname ? (
                            <div className="flex items-center ml-2">
                              <span className="text-[14px] font-black text-[#2e2016] tracking-tight">{nickname}</span>
                              <button 
                                onClick={() => { setTempNickname(nickname); setIsEditingNickname(true); }}
                                className="ml-1 text-[#6b4c33] hover:text-black transition-colors p-1"
                              >
                                <svg className="w-[12px] h-[12px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                              </button>
                            </div>
                          ) : (
                            <div className="flex w-full mt-1.5 space-x-1">
                              <input 
                                type="text" value={tempNickname} onChange={(e) => setTempNickname(e.target.value)} maxLength={10}
                                className="flex-1 bg-white/70 border border-[#8c6543] px-1 py-0.5 text-[11px] text-black font-bold focus:outline-none"
                              />
                              <button onClick={handleSaveNickname} className="bg-[#4a3522] text-white px-1.5 py-0.5 text-[10px] font-bold">저장</button>
                              <button onClick={() => setIsEditingNickname(false)} className="bg-transparent border border-[#4a3522] text-[#4a3522] px-1.5 py-0.5 text-[10px] font-bold">취소</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {!isSelectAvatarOpen ? (
                      <>
                        {/* 💡 [수정] 상세 통계 헤더 영역 & 초기화 버튼 */}
                        <div className="flex justify-between items-center bg-[#5c3e23]/10 border-y border-[#7c5432]/30 px-2 py-1 mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-green-600 rotate-45"></div>
                            <span className="text-[#4a3522] text-[11px] font-black tracking-wide">PVE 상세 통계</span>
                          </div>
                          <button 
                            onClick={handleResetStats}
                            className="text-[#a84444] text-[9px] font-bold border border-[#a84444]/40 px-1.5 py-0.5 rounded-sm bg-white/30 hover:bg-[#a84444] hover:text-white transition-colors"
                          >
                            기록 초기화
                          </button>
                        </div>

                        {/* 💡 [추가] 승/패/승률 정보 박스 */}
                        <div className="flex justify-around items-center mb-3 px-2">
                           <div className="flex flex-col items-center justify-center">
                             <span className="text-[10px] text-[#7c5432] font-bold mb-0.5">승리</span>
                             <span className="text-[14px] text-green-700 font-black">{stats.wins}</span>
                           </div>
                           <div className="w-px h-6 bg-[#a6845c]/30"></div>
                           <div className="flex flex-col items-center justify-center">
                             <span className="text-[10px] text-[#7c5432] font-bold mb-0.5">패배</span>
                             <span className="text-[14px] text-red-700 font-black">{stats.losses}</span>
                           </div>
                           <div className="w-px h-6 bg-[#a6845c]/30"></div>
                           <div className="flex flex-col items-center justify-center">
                             <span className="text-[10px] text-[#7c5432] font-bold mb-0.5">승률</span>
                             <span className="text-[14px] text-[#2e2016] font-black">{winRate}%</span>
                           </div>
                        </div>

                        {/* 💡 [수정] 최근 던전 기록 목록 (최대 5개) */}
                        <div className="w-full flex-1 min-h-[140px] bg-[#3a2618]/5 border-[2px] border-[#a6845c] rounded-sm p-1.5 flex flex-col shadow-inner relative overflow-y-auto">
                          
                          {records.length === 0 ? (
                            <div className="m-auto text-[#7c5432]/50 text-xs font-bold tracking-widest bg-white/30 px-3 py-1 rounded">최근 전적이 없습니다</div>
                          ) : (
                            <div className="w-full flex flex-col space-y-1">
                              {[...records].reverse().slice(0, 5).map((rec, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-[#633f20]/10 border border-[#a6845c]/30 px-2 py-1.5 rounded-sm">
                                  <span className="text-[10px] font-bold text-[#4a3522] w-2/5 truncate">{rec.dungeon}</span>
                                  <span className={`text-[10px] font-black w-1/5 text-center ${rec.result === '승리' ? 'text-green-700' : 'text-red-700'}`}>{rec.result}</span>
                                  <span className="text-[9px] font-bold text-[#7c5432] w-2/5 text-right">{rec.time}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 모서리 장식 */}
                          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#633f20]"></div>
                          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#633f20]"></div>
                          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#633f20]"></div>
                          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#633f20]"></div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full flex-1 min-h-[224px] bg-[#2a1a10]/5 border-[2px] border-[#a6845c] rounded-sm p-2 flex flex-col shadow-inner animate-[fadeIn_0.2s_ease-in-out]">
                        <div className="flex justify-between items-center border-b border-[#a6845c]/30 pb-1.5 mb-2">
                          <span className="text-[#633f20] text-[11px] font-black tracking-wide">아바타 인벤토리</span>
                          <button 
                            onClick={() => setIsSelectAvatarOpen(false)}
                            className="text-[#a36b33] text-[9px] font-black hover:text-black border border-[#a6845c]/30 px-1.5 py-0.5 rounded-sm bg-white/20 shadow-sm"
                          >
                            닫기
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-1.5">
                          {AVAILABLE_AVATARS.map((av) => {
                            const isSelected = avatarUrl === av.src;
                            return (
                              <div
                                key={av.id}
                                onClick={() => handleSelectAvatar(av.src)}
                                className={`relative aspect-square bg-black rounded-sm border cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-md ${isSelected ? 'border-amber-500 ring-1 ring-amber-600/50 shadow-[0_0_8px_rgba(230,150,50,0.8)]' : 'border-[#4a3522] hover:border-[#7c5432]'}`}
                                title={av.name}
                              >
                                <img src={av.src} alt={av.name} className="w-full h-full object-cover p-[1px]" />
                                {isSelected && (
                                  <div className="absolute inset-0 border border-amber-400 pointer-events-none rounded-sm"></div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'account' && (
                  <div className="animate-[fadeIn_0.3s_ease-in-out] h-full flex flex-col justify-center px-1">
                    <div className="bg-[#633f20]/10 border border-[#a6845c]/50 p-4 rounded-sm flex flex-col space-y-4 shadow-inner">
                      
                      <div className="flex justify-between items-center border-b border-[#a6845c]/30 pb-2">
                         <span className="text-[#a36b33] font-bold text-[12px] tracking-wide">연동 이메일</span>
                         <span className="text-[#2e2016] font-black text-[12px]">{user?.email || '알 수 없음'}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pt-1">
                         <span className="text-[#a36b33] font-bold text-[12px] tracking-wide">최초 가입일</span>
                         <span className="text-[#2e2016] font-black text-[12px]">
                           {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('ko-KR') : '-'}
                         </span>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            </div>

            <div className="flex w-full bg-[#2a1a10] border-t-[3px] border-[#1a1008] text-[11px] font-bold">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-3 border-r border-[#1a1008] transition-colors ${activeTab === 'profile' ? 'bg-[#4a301c] text-[#f5d5a9]' : 'text-[#8c6543] hover:bg-[#3a2618] hover:text-[#d8b486]'}`}
              >
                프로필
              </button>
              
              <button 
                onClick={() => setActiveTab('account')}
                className={`flex-1 py-3 border-r border-[#1a1008] transition-colors ${activeTab === 'account' ? 'bg-[#4a301c] text-[#f5d5a9]' : 'text-[#8c6543] hover:bg-[#3a2618] hover:text-[#d8b486]'}`}
              >
                계정 정보
              </button>
              
              <button 
                onClick={() => setIsProfileOpen(false)} 
                className="flex-1 py-3 hover:bg-[#3a2618] text-[#a84444] hover:text-[#d65a5a] transition-colors"
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
