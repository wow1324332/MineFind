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
  andromalius: {
    id: 'andromalius',
    name: '안드로말리우스 (Andromalius)',
    title: '화염 연옥의 지배자',
    element: 'fire',
    image: '/bossraid/raidboss-andromalius.webp', // 💡 첨부해주신 이미지 경로
    description: '용암이 흐르는 심연에서 눈을 뜬 지옥의 감시자.',
    stats: {
      maxHp: 6000,   // 단탈리온보다 조금 더 높은 체력
      minAtk: 600,
      maxAtk: 700,
      defense: 120
    },
    rewards: {
      gold: 25000,
      exp: 5000,
      dropItems: [
        { itemId: 'mat_fire_3', chance: 1.0 }, // 코어 오브 플레임 100% 드랍
        { itemId: 'mat_fire_4', chance: 0.3 }, // 희귀 재료 30% 드랍
        { itemId: 'con_soul_1', chance: 0.5 }, // 화염 기사의 영혼석 50%
        { itemId: 'potion_exp_fire_large', chance: 0.8 }
      ]
    },
    defeatRewards: {
      gold: 3000,
      exp: 200,
      dropItems: [
        { itemId: 'mat_fire_3', chance: 0.2 } // 패배 시 위로 보상
      ]
    },
  },
  mephisto: {
    id: 'mephisto',
    name: '메피스토 (Mephisto)',
    title: '화염 지옥의 마왕',
    element: 'fire',
    image: '/bossraid/raidboss-mephisto.webp', // 💡 첨부해주신 이미지 경로
    description: '불의 지옥을 지배하는 대마왕.',
    stats: {
      maxHp: 15000,   // 단탈리온보다 조금 더 높은 체력
      minAtk: 1000,
      maxAtk: 1200,
      defense: 250
    },
    rewards: {
      gold: 55000,
      exp: 10000,
      dropItems: [
        { itemId: 'mat_fire_4', chance: 1.0 }, // 코어 오브 플레임 100% 드랍
        { itemId: 'mat_fire_5', chance: 0.4 }, // 희귀 재료 30% 드랍
        { itemId: 'con_soul_1', chance: 0.7 }, // 화염 기사의 영혼석 50%
        { itemId: 'potion_exp_fire_large', chance: 0.8 }
      ]
    },
    defeatRewards: {
      gold: 5000,
      exp: 200,
      dropItems: [
        { itemId: 'mat_fire_4', chance: 0.2 } // 패배 시 위로 보상
      ]
    },
  },
  rahab: {
    id: 'rahab',
    name: '라합 (Rahab)',
    title: '수중 지옥의 대악마',
    element: 'water', 
    image: '/bossraid/raidboss-rahab.webp',
    description: '지옥의 파도를 다루는 고위 악마입니다. 지치지 않는 체력을 가진 악마입니다.',
    
    // ⚔️ 전투 스탯 (공격력 범위 및 크리 데미지 추가 완료!)
    stats: {
      hp: 4500,           // 보스 현재 체력
      maxHp: 4500,        // 보스 최대 체력
      minAtk: 200,         // 최소 평타 공격력
      maxAtk: 350,         // 최대 평타 공격력
      defense: 50,         // 보스 방어력
      spd: 30,             // 턴 속도 판정용 민첩
      evasionRate: 7.0,    // 회피율 (5%) - 기획자 강제 지정
      critRate: 5.0,      // 크리티컬 확률 (10%) - 기획자 강제 지정
      critDmg: 1.5,        // 크리티컬 데미지 배율 (1.5배)
    },

    // 🎁 처치 보상
    rewards: {
      gold: 3000,
      exp: 1000,
      dropItems: [
        { itemId: 'potion_exp_water_large', chance: 1.0 }, 
        { itemId: 'mat_water_1', chance: 0.5 },            
        { itemId: 'mat_water_2', chance: 0.1 },            
        { itemId: 'con_soul_2', chance: 0.1 }            
      ]
    },
    // 💀 패배 보상 (새로 추가됨)
    defeatRewards: {
      gold: 500,          // 승리 시의 약 15~20% 수준의 위로금
      exp: 200,           // 승리 시의 약 20% 수준의 경험치
      dropItems: [
        { itemId: 'potion_exp_water_small', chance: 0.5 }, // 50% 확률로 작은 경험치 포션
        { itemId: 'mat_water_1', chance: 0.05 }            // 5%의 매우 낮은 확률로 재료 아이템
      ]
    },
  },
  dagon: {
    id: 'dagon',
    name: '다곤 (Dagon)',
    title: '수중 감옥의 지배자',
    element: 'water',
    image: '/bossraid/raidboss-dagon.webp', // 💡 첨부해주신 이미지 경로
    description: '지옥의 수중 감옥을 지배하는 대악마입니다.',
    stats: {
      maxHp: 7500,   // 단탈리온보다 조금 더 높은 체력
      minAtk: 400,
      maxAtk: 550,
      defense: 130
    },
    rewards: {
      gold: 25000,
      exp: 5000,
      dropItems: [
        { itemId: 'mat_water_3', chance: 1.0 }, // 코어 오브 플레임 100% 드랍
        { itemId: 'mat_water_4', chance: 0.3 }, // 희귀 재료 30% 드랍
        { itemId: 'con_soul_2', chance: 0.5 }, // 화염 기사의 영혼석 50%
        { itemId: 'potion_exp_water_large', chance: 0.8 }
      ]
    },
    defeatRewards: {
      gold: 3000,
      exp: 200,
      dropItems: [
        { itemId: 'mat_water_3', chance: 0.2 } // 패배 시 위로 보상
      ]
    },
  },
  tiamat: {
    id: 'tiamat',
    name: '티아메트 (Tiamat)',
    title: '고대 바다의 대마왕',
    element: 'water',
    image: '/bossraid/raidboss-tiamat.webp', // 💡 첨부해주신 이미지 경로
    description: '물의 지옥을 지배하는 고대 바다의 대마왕.',
    stats: {
      maxHp: 18000,   // 단탈리온보다 조금 더 높은 체력
      minAtk: 800,
      maxAtk: 900,
      defense: 280
    },
    rewards: {
      gold: 55000,
      exp: 10000,
      dropItems: [
        { itemId: 'mat_water_4', chance: 1.0 }, // 코어 오브 플레임 100% 드랍
        { itemId: 'mat_water_5', chance: 0.4 }, // 희귀 재료 30% 드랍
        { itemId: 'con_soul_2', chance: 0.7 }, // 화염 기사의 영혼석 50%
        { itemId: 'potion_exp_water_large', chance: 0.8 }
      ]
    },
    defeatRewards: {
      gold: 5000,
      exp: 200,
      dropItems: [
        { itemId: 'mat_water_4', chance: 0.2 } // 패배 시 위로 보상
      ]
    },
  },
  basilisk: {
    id: 'basilisk',
    name: '바실리스크 (Basilisk)',
    title: '독연의 거대한 암살자',
    element: 'poison', 
    image: '/bossraid/raidboss-basilisk.webp',
    description: '지옥의 독연에 숨어서 용사들을 노리는 어둠의 지배자입니다.',
    
    // ⚔️ 전투 스탯 (공격력 범위 및 크리 데미지 추가 완료!)
    stats: {
      hp: 3000,           // 보스 현재 체력
      maxHp: 3000,        // 보스 최대 체력
      minAtk: 350,         // 최소 평타 공격력
      maxAtk: 550,         // 최대 평타 공격력
      defense: 20,         // 보스 방어력
      spd: 40,             // 턴 속도 판정용 민첩
      evasionRate: 12.0,    // 회피율 (5%) - 기획자 강제 지정
      critRate: 10.0,      // 크리티컬 확률 (10%) - 기획자 강제 지정
      critDmg: 2.0,        // 크리티컬 데미지 배율 (1.5배)
    },

    // 🎁 처치 보상
    rewards: {
      gold: 3000,
      exp: 1000,
      dropItems: [
        { itemId: 'potion_exp_poison_large', chance: 1.0 }, 
        { itemId: 'mat_poison_1', chance: 0.5 },            
        { itemId: 'mat_poison_2', chance: 0.1 },            
        { itemId: 'con_soul_3', chance: 0.1 }            
      ]
    },
    // 💀 패배 보상 (새로 추가됨)
    defeatRewards: {
      gold: 500,          // 승리 시의 약 15~20% 수준의 위로금
      exp: 200,           // 승리 시의 약 20% 수준의 경험치
      dropItems: [
        { itemId: 'potion_exp_poison_small', chance: 0.5 }, // 50% 확률로 작은 경험치 포션
        { itemId: 'mat_poison_1', chance: 0.05 }            // 5%의 매우 낮은 확률로 재료 아이템
      ]
    },
  },
  pazuzu: {
    id: 'pazuzu',
    name: '파주주 (Pazuzu)',
    title: '독충의 지배자',
    element: 'poison',
    image: '/bossraid/raidboss-pazuzu.webp', // 💡 첨부해주신 이미지 경로
    description: '지옥의 독충을 지배하고 조련하는 독마성의 대악마.',
    stats: {
      maxHp: 4700,   // 단탈리온보다 조금 더 높은 체력
      minAtk: 700,
      maxAtk: 850,
      defense: 90
    },
    rewards: {
      gold: 25000,
      exp: 5000,
      dropItems: [
        { itemId: 'mat_poison_3', chance: 1.0 }, // 코어 오브 플레임 100% 드랍
        { itemId: 'mat_poison_4', chance: 0.3 }, // 희귀 재료 30% 드랍
        { itemId: 'con_soul_3', chance: 0.5 }, // 화염 기사의 영혼석 50%
        { itemId: 'potion_exp_poison_large', chance: 0.8 }
      ]
    },
    defeatRewards: {
      gold: 3000,
      exp: 200,
      dropItems: [
        { itemId: 'mat_poison_3', chance: 0.2 } // 패배 시 위로 보상
      ]
    },
  },
  samael: {
    id: 'samael',
    name: '사마엘 (Samael)',
    title: '검은 독의 영혼 찬탈자',
    element: 'poison',
    image: '/bossraid/raidboss-samael.webp', // 💡 첨부해주신 이미지 경로
    description: '고대 유대교의 전설적인 대악마, 검은 칼로 영혼을 거둔다.',
    stats: {
      maxHp: 13000,   // 단탈리온보다 조금 더 높은 체력
      minAtk: 1100,
      maxAtk: 1300,
      defense: 200
    },
    rewards: {
      gold: 55000,
      exp: 10000,
      dropItems: [
        { itemId: 'mat_poison_4', chance: 1.0 }, // 코어 오브 플레임 100% 드랍
        { itemId: 'mat_poison_5', chance: 0.4 }, // 희귀 재료 30% 드랍
        { itemId: 'con_soul_3', chance: 0.7 }, // 화염 기사의 영혼석 50%
        { itemId: 'potion_exp_poison_large', chance: 0.8 }
      ]
    },
    defeatRewards: {
      gold: 5000,
      exp: 200,
      dropItems: [
        { itemId: 'mat_poison_4', chance: 0.2 } // 패배 시 위로 보상
      ]
    },
  },
};
