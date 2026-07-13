import React from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { TITLE_DATABASE } from '../constants/titleData';

export default function TitleModal({ user, userData, onClose, onEquip }) {
  // DB에 데이터가 없으면 기본값(novice)으로 처리
  const unlockedTitles = userData?.unlockedTitles || ['novice'];
  const equippedTitle = userData?.equippedTitle || 'novice';

  const handleEquip = async (titleId) => {
    if (!unlockedTitles.includes(titleId)) return; // 해금 안 된 칭호는 클릭 무시

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { equippedTitle: titleId });
    }
    onEquip(titleId);
    onClose(); // 장착 후 창 닫기
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-sm bg-[#1a1008] border-2 border-[#5c3e23] shadow-[0_0_40px_rgba(0,0,0,1)] rounded-md flex flex-col max-h-[80vh] relative overflow-hidden">
        
        {/* 양피지 배경 텍스처 (필요시 경로 수정) */}
        <div className="absolute inset-0 bg-cover bg-center z-0 opacity-40" style={{ backgroundImage: "url('/yangpiji-bg.jpeg')" }}></div>
        
        <div className="relative z-10 flex flex-col h-full p-4">
          <div className="flex justify-between items-center border-b border-[#8c6543]/40 pb-3 mb-4">
            <h2 className="text-[#f5d5a9] font-serif font-black text-lg drop-shadow-md">칭호 장착</h2>
            <button onClick={onClose} className="text-[#a6845c] hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-1">
            {Object.values(TITLE_DATABASE).map((title) => {
              const isUnlocked = unlockedTitles.includes(title.id);
              const isEquipped = equippedTitle === title.id;

              return (
                <div 
                  key={title.id}
                  onClick={() => handleEquip(title.id)}
                  className={`relative p-3 border rounded-sm flex flex-col transition-all duration-200 
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
                    {isEquipped && <span className="text-yellow-500 text-[10px] font-bold bg-yellow-950/50 px-1.5 py-0.5 rounded-sm border border-yellow-700/50">장착 중</span>}
                    {!isUnlocked && <span className="text-neutral-500 text-[18px]">🔒</span>}
                  </div>
                  
                  <span className="text-[#a6845c] text-[11px] font-bold leading-tight mb-2">
                    {title.description}
                  </span>
                  
                  <div className={`text-[9px] font-bold mt-auto pt-2 border-t border-dashed ${isUnlocked ? 'border-[#8c6543]/30 text-[#8c6543]' : 'border-neutral-700 text-neutral-600'}`}>
                    조건: {title.conditionText}
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
