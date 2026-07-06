import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { db } from '../firebase'; 
import { useAuth } from '../hooks/useAuth'; 

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%231e140d'/%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' fill='%238c6543'/%3E%3C/svg%3E";

const AVAILABLE_AVATARS = [
  { id: 'knight1', src: '/avatars/knight1.jpeg', name: '견습 기사' },
  { id: 'knight2', src: '/avatars/knight2.jpeg', name: '견습 기사' },
  { id: 'knight3', src: '/avatars/knight3.jpeg', name: '견습 기사' },
];

export default function MyPage({ onBack }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // profile, record, account
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isSelectAvatarOpen, setIsSelectAvatarOpen] = useState(false);
  
  const [recordMode, setRecordMode] = useState('PVE'); 

  const [nickname, setNickname] = useState(''); 
  const [userTitle, setUserTitle] = useState('무명의 용사'); 
  const [tempNickname, setTempNickname] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(AVAILABLE_AVATARS[0].src);
  
  const [stats, setStats] = useState({ wins: 0, losses: 0 });
  const [records, setRecords] = useState([]);
  
  const [expandedDungeons, setExpandedDungeons] = useState({});

  const toggleDungeon = (dungeonName) => {
    setExpandedDungeons(prev => ({
      ...prev,
      [dungeonName]: !prev[dungeonName]
    }));
  };
  
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
      alert('닉네임을 입력해주세요!'); return;
    }
    if (tempNickname.length > 10) {
      alert('닉네임은 최대 10자까지 설정 가능합니다.'); return;
    }
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { nickname: tempNickname }, { merge: true });
      setNickname(tempNickname); 
      setIsEditingNickname(false); 
    } catch (error) {
      console.error("저장 에러:", error); alert('저장에 실패했습니다.');
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
    }
  };

  const handleResetStats = async () => {
    if (!window.confirm("정말 승패 기록을 초기화하시겠습니까? (PVE 전체 통계만 초기화되며 상세 기록은 유지됩니다)")) return;
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const resetStats = { wins: 0, losses: 0 };
      await setDoc(userDocRef, { stats: resetStats }, { merge: true });
      setStats(resetStats);
    } catch (error) {
      console.error("통계 초기화 실패:", error);
    }
  };

  const totalGames = stats.wins + stats.losses;
  const winRate = totalGames > 0 ? Math.round((stats.wins / totalGames) * 100) : 0;

  // 💡 던전별, 난이도별 데이터 재구성 로직
  const getDungeonStats = () => {
    const dungeonData = {};
    // 게임에 존재하는 5가지 난이도 (이름은 추후 게임 설정에 맞게 변경 가능합니다)
    const STANDARD_DIFFICULTIES = ['Easy', 'Normal', 'Hard', 'Expert', 'Hell'];

    records.forEach(rec => {
      // 정규식으로 "던전명 (난이도)" 추출 -> 던전명과 난이도 분리
      const match = rec.dungeon.match(/(.+?)\s*\((.+?)\)$/);
      const dName = match ? match[1] : rec.dungeon;
      const diff = match ? match[2] : 'Normal';

      if (!dungeonData[dName]) {
        dungeonData[dName] = {};
        // 해당 던전에 처음 데이터가 들어올 때 5가지 난이도 슬롯을 미리 생성
        STANDARD_DIFFICULTIES.forEach(d => {
           dungeonData[dName][d] = { plays: 0, wins: 0, bestTime: null };
        });
      }
      
      // 만약 고정된 5개 난이도 외의 이름이 파싱되었을 경우를 대비해 슬롯 생성
      if (!dungeonData[dName][diff]) {
        dungeonData[dName][diff] = { plays: 0, wins: 0, bestTime: null };
      }

      dungeonData[dName][diff].plays += 1;
      
      if (rec.result === '승리') {
        dungeonData[dName][diff].wins += 1;
        if (!dungeonData[dName][diff].bestTime || rec.time < dungeonData[dName][diff].bestTime) {
          dungeonData[dName][diff].bestTime = rec.time;
        }
      }
    });

    return Object.entries(dungeonData).map(([name, diffs]) => {
      // 난이도별 배열로 변환 및 정렬 (미리 정의된 5가지 난이도 순서대로)
      const sortedDiffs = Object.keys(diffs).sort((a, b) => {
        const idxA = STANDARD_DIFFICULTIES.indexOf(a);
        const idxB = STANDARD_DIFFICULTIES.indexOf(b);
        if (idxA === -1 && idxB === -1) return 0;
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
      }).map(diffName => {
        const data = diffs[diffName];
        return {
          diffName,
          plays: data.plays,
          wins: data.wins,
          winRate: data.plays > 0 ? Math.round((data.wins / data.plays) * 100) : 0,
          bestTime: data.bestTime || '-'
        };
      });

      return { name, diffs: sortedDiffs };
    });
  };

  const dungeonStatsList = getDungeonStats();

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center px-6 pb-6 pt-0 animate-[fadeIn_0.5s_ease-in-out] overflow-hidden">
      
      <div 
        className="absolute inset-x-0 top-[15%] bottom-0 bg-cover bg-bottom bg-no-repeat opacity-60 z-0 pointer-events-none"
        style={{ backgroundImage: "url('/mypage-bg.jpeg')", WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)' }}
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
        
        <div className="w-full max-w-sm flex flex-col items-center -mt-6 space-y-3 relative z-10">
          
          {/* 1. 마이 프로필 버튼 */}
          <button 
            onClick={() => setIsProfileOpen(true)} 
            // 💡 실제 클릭되는 "보이지 않는 투명한 네모 상자" 크기를 딱 휘장 두께만큼(h-[55px]) 잡아줍니다.
            className="group relative flex justify-center items-center w-full max-w-[17rem] h-[55px] z-10"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            {/* 이미지는 상자 밖으로 자유롭게 삐져나가지만, pointer-events-none으로 허공 클릭을 무시합니다. */}
            <img 
              src="/myprofile-bt.png" 
              alt="My Profile" 
              // group-hover, group-active를 써서 버튼을 누를 때 삐져나간 이미지도 같이 애니메이션 되게 합니다!
              className="absolute w-full h-auto pointer-events-none transition-all duration-200 group-hover:brightness-110 group-active:scale-95 drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]" 
              draggable="false" 
            />
          </button>

          {/* 2. 인벤토리 버튼 */}
          <button 
            onClick={() => setIsInventoryOpen(true)} 
            // 💡 실제 클릭 영역 (Hitbox)
            className="group relative flex justify-center items-center w-full max-w-[17rem] h-[55px] z-10"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            <img 
              src="/inventory-bt.png" 
              alt="Inventory" 
              className="absolute w-full h-auto pointer-events-none transition-all duration-200 group-hover:brightness-110 group-active:scale-95 drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]" 
              draggable="false" 
            />
          </button>

        </div>
      </div>

      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-[fadeIn_0.2s_ease-in-out]">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsProfileOpen(false)}></div>
          
          <div className="relative z-10 w-full max-w-[320px] flex flex-col rounded-md border-[3px] border-[#3c2a1a] shadow-[0_0_30px_rgba(0,0,0,1)] bg-[#1e140d]">
            
            <div className="w-full bg-[#2a1a10] border-b-[3px] border-[#1a1008] relative py-2.5 flex justify-center items-center">
              <div className="absolute left-3 w-1.5 h-1.5 rotate-45 bg-[#7c5432]"></div>
              <h2 className="text-[#d8b486] font-bold text-[15px] tracking-widest font-serif">User Profile</h2>
              <div className="absolute right-3 w-1.5 h-1.5 rotate-45 bg-[#7c5432]"></div>
            </div>

              <div className="w-full bg-cover bg-center flex flex-col relative p-4 h-[380px] overflow-hidden" style={{ backgroundImage: "url('/yangpiji-bg.jpeg')" }}>
              <div className="absolute inset-0 bg-amber-50/40 pointer-events-none"></div>

              <div className="relative z-10 h-full flex flex-col">
                
                {/* 탭 1: 프로필 */}
                {activeTab === 'profile' && (
                  <div className="animate-[fadeIn_0.3s_ease-in-out] h-full flex flex-col">
                    <div className="flex flex-row items-start mb-3">
                      <div 
                        className={`relative w-[70px] h-[70px] shrink-0 cursor-pointer group bg-black rounded-sm border-2 ${isSelectAvatarOpen ? 'border-amber-500 shadow-[0_0_8px_rgba(230,150,50,0.5)]' : 'border-[#4a3522]'} shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-all`}
                        onClick={() => setIsSelectAvatarOpen(!isSelectAvatarOpen)}
                      >
                        <img src={avatarUrl} alt="Avatar" onError={(e) => { e.target.src = DEFAULT_AVATAR; }} className="w-full h-full object-cover p-[2px]" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5 text-white animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18"></path></svg>
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
                              <button onClick={() => { setTempNickname(nickname); setIsEditingNickname(true); }} className="ml-1 text-[#6b4c33] hover:text-black transition-colors p-1">
                                <svg className="w-[12px] h-[12px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                              </button>
                            </div>
                          ) : (
                            <div className="flex w-full mt-1.5 space-x-1">
                              <input type="text" value={tempNickname} onChange={(e) => setTempNickname(e.target.value)} maxLength={10} className="flex-1 bg-white/70 border border-[#8c6543] px-1 py-0.5 text-[11px] text-black font-bold focus:outline-none" />
                              <button onClick={handleSaveNickname} className="bg-[#4a3522] text-white px-1.5 py-0.5 text-[10px] font-bold">Save</button>
                              <button onClick={() => setIsEditingNickname(false)} className="bg-transparent border border-[#4a3522] text-[#4a3522] px-1.5 py-0.5 text-[10px] font-bold">취소</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {!isSelectAvatarOpen ? (
                      <>
                        <div className="flex justify-between items-center bg-[#5c3e23]/10 border-y border-[#7c5432]/30 px-2 py-1 mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-green-600 rotate-45"></div>
                            <span className="text-[#4a3522] text-[11px] font-black tracking-wide">PVE 전체 통계</span>
                          </div>
                          <button onClick={handleResetStats} className="text-[#a84444] text-[9px] font-bold border border-[#a84444]/40 px-1.5 py-0.5 rounded-sm bg-white/30 hover:bg-[#a84444] hover:text-white transition-colors">
                            Reset
                          </button>
                        </div>

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

                        <div className="w-full flex-1 min-h-[140px] bg-[#3a2618]/5 border-[2px] border-[#a6845c] rounded-sm p-1.5 flex flex-col shadow-inner relative overflow-y-auto">
                          {records.length === 0 ? (
                            <div className="m-auto text-[#7c5432]/50 text-xs font-bold tracking-widest bg-white/30 px-3 py-1 rounded">No Records</div>
                          ) : (
                            <div className="w-full flex flex-col space-y-1">
                              {[...records].reverse().slice(0, 5).map((rec, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-[#633f20]/10 border border-[#a6845c]/30 px-2 py-1.5 rounded-sm">
                                  <span className="text-[10px] font-bold text-[#4a3522] w-[45%] truncate">{rec.dungeon}</span>
                                  <span className={`text-[10px] font-black w-[15%] text-center ${rec.result === '승리' ? 'text-green-700' : 'text-red-700'}`}>{rec.result}</span>
                                  <span className="text-[9px] font-bold text-[#7c5432] w-[35%] text-right">{rec.time}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="w-full flex-1 min-h-[224px] bg-[#2a1a10]/5 border-[2px] border-[#a6845c] rounded-sm p-2 flex flex-col shadow-inner animate-[fadeIn_0.2s_ease-in-out]">
                        <div className="flex justify-between items-center border-b border-[#a6845c]/30 pb-1.5 mb-2">
                          <span className="text-[#633f20] text-[11px] font-black tracking-wide">Avatars</span>
                          <button onClick={() => setIsSelectAvatarOpen(false)} className="text-[#a36b33] text-[9px] font-black hover:text-black border border-[#a6845c]/30 px-1.5 py-0.5 rounded-sm bg-white/20 shadow-sm">닫기</button>
                        </div>
                        <div className="grid grid-cols-5 gap-1.5">
                          {AVAILABLE_AVATARS.map((av) => {
                            const isSelected = avatarUrl === av.src;
                            return (
                              <div key={av.id} onClick={() => handleSelectAvatar(av.src)} className={`relative aspect-square bg-black rounded-sm border cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-md ${isSelected ? 'border-amber-500 ring-1 ring-amber-600/50 shadow-[0_0_8px_rgba(230,150,50,0.8)]' : 'border-[#4a3522] hover:border-[#7c5432]'}`} title={av.name}>
                                <img src={av.src} alt={av.name} className="w-full h-full object-cover p-[1px]" />
                                {isSelected && <div className="absolute inset-0 border border-amber-400 pointer-events-none rounded-sm"></div>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 💡 탭 2: 모험 일지 (던전별/난이도별 컨테이너 구조) */}
                {activeTab === 'record' && (
                  <div className="animate-[fadeIn_0.3s_ease-in-out] h-full flex flex-col overflow-hidden">
                    
                    {/* 상단 PVE/PVP 토글 (shrink-0으로 안 찌그러지게 고정) */}
                    <div className="flex w-full bg-[#1a1008] rounded-sm p-1 mb-2 border border-[#3c2a1a] shrink-0">
                      <button onClick={() => setRecordMode('PVE')} className={`flex-1 py-1 text-[11px] font-bold rounded-sm transition-all duration-200 ${recordMode === 'PVE' ? 'bg-[#4a301c] text-[#f5d5a9] shadow-inner' : 'text-[#8c6543] hover:text-[#d8b486]'}`}>PVE</button>
                      <button onClick={() => setRecordMode('PVP')} className={`flex-1 py-1 text-[11px] font-bold rounded-sm transition-all duration-200 ${recordMode === 'PVP' ? 'bg-[#4a301c] text-[#f5d5a9] shadow-inner' : 'text-[#8c6543] hover:text-[#d8b486]'}`}>PVP</button>
                    </div>

                    {/* 💡 외부 연갈색 테두리 제거 + 내부 스크롤(overflow-y-auto) 완벽 적용 */}
                    <div className="w-full flex-1 bg-[#3a2618]/5 rounded-sm p-2 flex flex-col shadow-inner relative overflow-y-auto">
                      
                      {recordMode === 'PVE' ? (
                        dungeonStatsList.length === 0 ? (
                          <div className="m-auto flex flex-col items-center">
                            <span className="text-[#7c5432]/50 text-xs font-bold tracking-widest bg-white/30 px-3 py-1 rounded">No records</span>
                          </div>
                        ) : (
                          <div className="w-full flex flex-col space-y-4 pb-2">
                            
                            {dungeonStatsList.map((dungeon, idx) => {
                              const isExpanded = expandedDungeons[dungeon.name] || false;

                              return (
                              <div key={idx} className="flex flex-col bg-[#633f20]/10 rounded-sm shadow-sm overflow-hidden">
                                
                                <div 
                                  onClick={() => toggleDungeon(dungeon.name)}
                                  className={`w-full bg-[#3a2618]/80 px-3 py-2 flex justify-between items-center shadow-inner cursor-pointer hover:bg-[#4a301c] transition-colors duration-200 ${isExpanded ? 'border-b border-[#a6845c]/40' : ''}`}
                                >
                                  <span className="text-[12px] font-black text-[#f5d5a9] tracking-wider leading-none">{dungeon.name}</span>
                                  <svg className={`w-4 h-4 text-[#f5d5a9] transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                                
                                <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                  <div className="overflow-hidden">
                                    <div className="flex flex-col p-1.5">
                                      <div className="flex border-b border-[#a6845c]/20 pb-1 mb-1 px-1">
                                         <div className="w-[30%] text-[9px] text-[#4a3522] font-bold">난이도</div>
                                         <div className="w-[25%] text-[9px] text-[#4a3522] font-bold text-center">승리 <span className="text-[8px]">(도전)</span></div>
                                         <div className="w-[20%] text-[9px] text-[#4a3522] font-bold text-center">승률</div>
                                         <div className="w-[25%] text-[9px] text-[#4a3522] font-bold text-right">최고기록</div>
                                      </div>
                                      
                                      {dungeon.diffs.map((diff, dIdx) => (
                                         <div key={dIdx} className="flex items-center px-1 py-1 hover:bg-[#633f20]/20 rounded-sm transition-colors border-b border-[#8c6543]/10 last:border-0">
                                            <div className="w-[30%] text-[10px] text-[#4a3522] font-black">{diff.diffName}</div>
                                            <div className="w-[25%] text-[10px] text-[#4a3522] font-bold text-center">
                                              {diff.wins} <span className="text-[8px] text-[#4a3522]">({diff.plays})</span>
                                            </div>
                                            <div className="w-[20%] text-[10px] font-black text-center text-[#4a3522]">
                                              {diff.plays > 0 ? `${diff.winRate}%` : '-'}
                                            </div>
                                            <div className="w-[25%] text-[9px] text-[#4a3522] font-bold text-right">
                                              {diff.bestTime}
                                            </div>
                                         </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                              </div>
                            )})}
                          </div>
                        )
                      ) : (
                         <div className="m-auto flex flex-col items-center opacity-70">
                            <svg className="w-8 h-8 text-[#4a3522] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            <span className="text-[#4a3522] text-xs font-black tracking-widest">업데이트 예정</span>
                         </div>
                      )}
                      
                    </div>
                  </div>
                )}

                {/* 탭 3: 계정 정보 */}
                {activeTab === 'account' && (
                  <div className="animate-[fadeIn_0.3s_ease-in-out] h-full flex flex-col justify-center px-1">
                    <div className="bg-[#633f20]/10 border border-[#a6845c]/50 p-4 rounded-sm flex flex-col space-y-4 shadow-inner">
                      <div className="flex justify-between items-center border-b border-[#a6845c]/30 pb-2">
                         <span className="text-[#a36b33] font-bold text-[12px] tracking-wide">Account</span>
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
              <button onClick={() => setActiveTab('profile')} className={`flex-1 py-3 border-r border-[#1a1008] transition-colors ${activeTab === 'profile' ? 'bg-[#4a301c] text-[#f5d5a9]' : 'text-[#8c6543] hover:bg-[#3a2618] hover:text-[#d8b486]'}`}>Profile</button>
              <button onClick={() => setActiveTab('record')} className={`flex-1 py-3 border-r border-[#1a1008] transition-colors ${activeTab === 'record' ? 'bg-[#4a301c] text-[#f5d5a9]' : 'text-[#8c6543] hover:bg-[#3a2618] hover:text-[#d8b486]'}`}>Records</button>
              <button onClick={() => setActiveTab('account')} className={`flex-1 py-3 border-r border-[#1a1008] transition-colors ${activeTab === 'account' ? 'bg-[#4a301c] text-[#f5d5a9]' : 'text-[#8c6543] hover:bg-[#3a2618] hover:text-[#d8b486]'}`}>Account</button>
              <button onClick={() => setIsProfileOpen(false)} className="flex-1 py-3 hover:bg-[#3a2618] text-[#a84444] hover:text-[#d65a5a] transition-colors">닫기</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
