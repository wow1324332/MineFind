import React from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { TITLE_DATABASE } from '../constants/titleData';

export default function TitleModal({ user, userData, onClose, onEquip }) {
  // DB에 데이터가 없으면 기본값(novice)으로 처리 및 잠금 방지
  const dbTitles = userData?.unlockedTitles || [];
  const unlockedTitles = dbTitles.includes('novice') ? dbTitles : ['novice', ...dbTitles];
  const equippedTitle = userData?.equippedTitle || 'novice';

  // 💡 내가 획득한 칭호들의 포인트를 전부 합산하는 로직
  const totalPoints = unlockedTitles.reduce((sum, id) => {
    return sum + (TITLE_DATABASE[id]?.point || 0);
  }, 0);

  const handleEquip = async (titleId) => {
    if (!unlockedTitles.includes(titleId)) return; // 해금 안 된 칭호는 클릭 무시

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { equippedTitle: titleId });
    }
    if(onEquip) onEquip(titleId);
    onClose(); 
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out] select-none"
      style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', WebkitTapHighlightColor: 'transparent' }}
      onClick={onClose} // 💡 1. 모달 바깥 배경을 누르면 닫히게 설정
    >
      <div 
        className="w-full max-w-sm bg-[#1a1008] border-2 border-[#5c3e23] shadow-[0_0_40px_rgba(0,0,0,1)] rounded-md flex flex-col max-h-[80vh] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()} // 💡 2. 모달 안쪽을 눌렀을 때는 닫히지 않게 방어
      >
        <div className="absolute inset-0 bg-cover bg-center z-0 opacity-40" style={{ backgroundImage: "url('/yangpiji-bg.jpeg')" }}></div>
        
        <div className="relative z-10 flex flex-col h-full p-4">
          <div className="flex justify-between items-center border-b border-[#8c6543]/40 pb-3 mb-4">
            <h2 className="text-[#f5d5a9] font-serif font-black text-lg drop-shadow-md">칭호 장착</h2>
            
            {/* 💡 3. X 닫기 버튼을 지우고 칭호 포인트(TP)를 표시 */}
            <div className="text-amber-400 font-serif font-black text-sm tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)] bg-[#3a2210]/40 px-2.5 py-1 rounded-sm border border-[#8c6543]/30">
              TP {totalPoints}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-1">
            {Object.values(TITLE_DATABASE).map((title) => {
              const isUnlocked = unlockedTitles.includes(title.id);
              const isEquipped = equippedTitle === title.id;

              return (
                <div 
                  key={title.id}
                  onClick={() => handleEquip(title.id)}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  className={`relative p-3 border rounded-sm flex flex-col transition-all duration-200 active:scale-[0.98] 
                    ${isUnlocked 
                      ? 'bg-black/40 border-[#8c6543]/60 cursor-pointer hover:bg-black/60 hover:border-[#d8b486]' 
                      : 'bg-black/80 border-neutral-800 opacity-60 cursor-not-allowed grayscale-[50%]'
                    }
                    ${isEquipped ? 'border-[#d8b486] shadow-[0_0_15px_rgba(216,180,134,0.3)] bg-[#3a2210]/40' : ''}
                  `}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-serif font-black text-base ${isUnlocked ? title.textColor : 'text-neutral-500'} ${isUnlocked ? title.glow : ''}`}>
                      {title.name}
                    </span>
                    {isEquipped && <span className="text-yellow-500 text-[10px] font-bold bg-yellow-950/50 px-1.5 py-0.5 rounded-sm border border-yellow-700/50 shrink-0">장착 중</span>}
                    {!isUnlocked && <span className="text-neutral-500 text-[18px] shrink-0">🔒</span>}
                  </div>
                  
                  <span className="text-[#a6845c] text-[11px] font-bold leading-tight mb-2">
                    {title.description}
                  </span>
                  
                  {/* 💡 4. 각 칭호 아이템에도 하단에 포인트를 표시 */}
                  <div className={`flex justify-between items-center text-[9px] font-bold mt-auto pt-2 border-t border-dashed ${isUnlocked ? 'border-[#8c6543]/30' : 'border-neutral-700'}`}>
                    <span className={isUnlocked ? 'text-[#8c6543]' : 'text-neutral-600'}>
                      조건: {title.conditionText}
                    </span>
                    <span className={isUnlocked ? 'text-amber-500 font-black' : 'text-neutral-600 font-black'}>
                      {title.point} PT
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
