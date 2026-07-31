// src/constants/raidBossData.js

export const RAID_BOSS_DATABASE = {
  // ========================================================
  // 🌋 Hell of Flame 보스: 단탈리온
  // ========================================================
  dantalion: {
    id: 'dantalion',
    name: '단탈리온 (Dantalion)',
    title: '화염 지옥의 대악마',
    element: 'fire', 
    image: '/bossraid/raidboss-dantalion.webp',
    description: '지옥의 불꽃을 다루는 고위 악마입니다. 둔하지만 강력한 한 방을 가지고 있습니다.',
    
    // ⚔️ 전투 스탯 (공격력 범위 및 크리 데미지 추가 완료!)
    stats: {
      hp: 3500,           // 보스 현재 체력
      maxHp: 3500,        // 보스 최대 체력
      minAtk: 300,         // 최소 평타 공격력
      maxAtk: 450,         // 최대 평타 공격력
      defense: 40,         // 보스 방어력
      spd: 30,             // 턴 속도 판정용 민첩
      evasionRate: 5.0,    // 회피율 (5%) - 기획자 강제 지정
      critRate: 10.0,      // 크리티컬 확률 (10%) - 기획자 강제 지정
      critDmg: 1.5,        // 크리티컬 데미지 배율 (1.5배)
    },

    // 🎁 처치 보상
    rewards: {
      gold: 3000,
      exp: 1000,
      dropItems: [
        { itemId: 'potion_exp_fire_large', chance: 1.0 }, 
        { itemId: 'mat_fire_1', chance: 0.5 },            
        { itemId: 'mat_fire_2', chance: 0.1 },            
        { itemId: 'con_soul_1', chance: 0.1 }            
      ]
    },
    // 💀 패배 보상 (새로 추가됨)
    defeatRewards: {
      gold: 500,          // 승리 시의 약 15~20% 수준의 위로금
      exp: 200,           // 승리 시의 약 20% 수준의 경험치
      dropItems: [
        { itemId: 'potion_exp_fire_small', chance: 0.5 }, // 50% 확률로 작은 경험치 포션
        { itemId: 'mat_fire_1', chance: 0.05 }            // 5%의 매우 낮은 확률로 재료 아이템
      ]
    },
  },
};
