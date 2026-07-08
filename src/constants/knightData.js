// src/constants/knightData.js

export const KNIGHT_DATABASE = {
  // ========================================================
  // 👑 1. 주인공 (플레이어 본인 - 기본 보유)
  // ========================================================
  'knight_main': {
    id: 'knight_main',
    name: '주인공', 
    title: '견습 기사',
    attribute: 'neutral', 
    rarity: 'player', 
    image: '/knights/mainknight-profile.png',
    bgImage: '/knights/mainknight.jpg', 
    description: '기사단의 단장인 당신 자신입니다. 끝없는 잠재력을 지니고 있습니다.',
    
    baseStats: {
      str: 10,
      agi: 10,
      int: 10,
      vit: 15,
      luk: 10
    },

    // 💡 레벨업 당 스탯 상승치
    statGrowth: {
      str: 2,
      agi: 2,
      int: 2,
      vit: 2,
      luk: 2
    },

    // 💡 10레벨 도달 시 유저가 선택하게 될 3가지 스킬 트랙
    selectableSkills: {
      'skill_main_str': {
        id: 'skill_main_str',
        name: '단장의 긍지',
        type: 'buff',
        mpCost: 20,
        description: '3턴 동안 파티 전체 기사들의 공격력을 15% 상승시킵니다.'
      },
      'skill_main_vit': {
        id: 'skill_main_vit',
        name: '불굴의 방진',
        type: 'defense',
        mpCost: 30,
        description: '보스의 다음 공격 데미지를 50% 감소시키고, 파티 체력을 소량 회복합니다.'
      },
      'skill_main_agi': {
        id: 'skill_main_agi',
        name: '치명적인 지휘',
        type: 'debuff',
        mpCost: 25,
        description: '보스의 회피율을 0으로 만들고, 이번 턴 아군의 모든 공격이 치명타로 적중합니다.'
      }
    }
  },

  // ========================================================
  // 🌋 2. 이프리트 (불의 던전 소환 기사)
  // ========================================================
  'knight_fire_ifrit': {
    id: 'knight_fire_ifrit',
    name: '이프리트',
    title: '화염의 화신',
    attribute: 'fire',
    rarity: 'epic',
    image: '/knights/ifrit-profile.png',    // 갤러리/목록용 미니 프로필
    fullImage: '/knights/ifrit-full.png',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '지옥불 던전 깊은 곳에서 계약을 맺은 화염의 정령 기사입니다.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'mat_fire_rare', // 불의 던전 난이도별 확률 드랍템 (지옥염룡의 역린 등)
      count: 1,
      gold: 5000
    },

    baseStats: {
      str: 25,
      agi: 15,
      int: 5,
      vit: 20,
      luk: 5
    },

    statGrowth: {
      str: 4,
      agi: 2,
      int: 1,
      vit: 3,
      luk: 1
    }
  },

  // ========================================================
  // 💧 3. 운디네 (물의 던전 소환 기사)
  // ========================================================
  'knight_water_undine': {
    id: 'knight_water_undine',
    name: '운디네',
    title: '심해의 인도자',
    attribute: 'water',
    rarity: 'epic',
    image: '/knights/undine-profile.png',
    fullImage: '/knights/undine-full.png',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '물의 던전에서 구출된 후 당신에게 충성을 맹세한 기사입니다.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'mat_water_rare', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 1,
      gold: 5000
    },

    baseStats: {
      str: 10,
      agi: 25,
      int: 20,
      vit: 10,
      luk: 15
    },

    statGrowth: {
      str: 1,
      agi: 4,
      int: 3,
      vit: 1,
      luk: 2
    }
  }
};
