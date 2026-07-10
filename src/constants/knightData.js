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
  // 🌋 2. 랜슬록 (불의 던전 소환 기사)
  // ========================================================
  'knight_fire_lancelot': {
    id: 'knight_fire_lancelot',
    name: 'Lancelot',
    title: 'Knight of Flame',
    attribute: 'fire',
    rarity: 'rare',
    image: '/knights/knight-lencelot-profile.png',    // 갤러리/목록용 미니 프로필
    fullImage: '/knights/knight-lancelot.jpg',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '지옥불 던전 깊은 곳에서 계약을 맺은 화염의 기사입니다.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_1', // 불의 던전 난이도별 확률 드랍템 (지옥염룡의 역린 등)
      count: 5,
      gold: 5000
    },

    baseStats: {
      str: 20,
      agi: 10,
      int: 5,
      vit: 20,
      luk: 15
    },

    statGrowth: {
      str: 3,
      agi: 1,
      int: 1,
      vit: 3,
      luk: 2
    }
  },

  // ========================================================
  // 💧 3. 가웨인 (불의 던전 소환 기사)
  // ========================================================
  'knight_fire_gawain': {
    id: 'knight_fire_gawain',
    name: 'Gawain',
    title: 'Knight of Fire',
    attribute: 'fire',
    rarity: 'rare',
    image: '/knights/knight-gawain-profile.png',
    fullImage: '/knights/knight-gawain.jpg',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '불의 던전에서 구출된 후 당신에게 충성을 맹세한 기사입니다.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_1', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 5,
      gold: 5000
    },

    baseStats: {
      str: 25,
      agi: 5,
      int: 10,
      vit: 20,
      luk: 10
    },

    statGrowth: {
      str: 5,
      agi: 2,
      int: 1,
      vit: 1,
      luk: 1
    }
  },
  
  // ========================================================
  // 4. 겔러해드 (물의 던전 소환 기사)
  // ========================================================
  'knight_water_galahad': {
    id: 'knight_water_galahad',
    name: 'Galahad',
    title: 'Defender of Water',
    attribute: 'water',
    rarity: 'rare',
    image: '/knights/knight-galahad-profile.png',
    fullImage: '/knights/knight-galahad.jpg',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '물의 던전을 수호하던 고대 기사의 영령.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_2', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 5,
      gold: 5000
    },

    baseStats: {
      str: 15,
      agi: 5,
      int: 10,
      vit: 25,
      luk: 15
    },

    statGrowth: {
      str: 2,
      agi: 1,
      int: 1,
      vit: 4,
      luk: 2
    }
  },
  // ========================================================
  // 5. 퍼시벌 (물의 던전 소환 기사)
  // ========================================================
  'knight_water_percival': {
    id: 'knight_water_percival',
    name: 'Percival',
    title: 'Defender of Water',
    attribute: 'water',
    rarity: 'rare',
    image: '/knights/knight-percival-profile.png',
    fullImage: '/knights/knight-percival.jpg',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '물의 던전을 수호하던 고대 기사의 영령.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_2', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 5,
      gold: 5000
    },

    baseStats: {
      str: 10,
      agi: 5,
      int: 10,
      vit: 30,
      luk: 15
    },

    statGrowth: {
      str: 1,
      agi: 1,
      int: 1,
      vit: 5,
      luk: 2
    }
  },
  // ========================================================
  // 6. 모드레드 (독의 던전 소환 기사)
  // ========================================================
  'knight_poison_mordred': {
    id: 'knight_poison_mordred',
    name: 'Mordred',
    title: 'Assassin of poison',
    attribute: 'poison',
    rarity: 'rare',
    image: '/knights/knight-mordred-profile.png',
    fullImage: '/knights/knight-mordred.jpg',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '독의 던전을 수호하던 고대 기사의 영령.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_3', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 5,
      gold: 5000
    },

    baseStats: {
      str: 10,
      agi: 25,
      int: 10,
      vit: 15,
      luk: 10
    },

    statGrowth: {
      str: 2,
      agi: 3,
      int: 1,
      vit: 1,
      luk: 2
    }
  },
  // ========================================================
  // 7. 가레스 (물의 던전 소환 기사)
  // ========================================================
  'knight_poison_gareth': {
    id: 'knight_poison_gareth',
    name: 'Gareth',
    title: 'Assassin of Shadow',
    attribute: 'poison',
    rarity: 'rare',
    image: '/knights/knight-gareth-profile.png',
    fullImage: '/knights/knight-gareth.jpg',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '독의 던전을 수호하던 고대 기사의 그림자.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_3', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 5,
      gold: 5000
    },

    baseStats: {
      str: 15,
      agi: 20,
      int: 10,
      vit: 10,
      luk: 15
    },

    statGrowth: {
      str: 2,
      agi: 3,
      int: 1,
      vit: 1,
      luk: 3
    }
  },
  // ========================================================
  // 8. 트리스탄 (빛의 던전 소환 기사)
  // ========================================================
  'knight_light_tristan': {
    id: 'knight_light_tristan',
    name: 'Tristan',
    title: 'Defender of light',
    attribute: 'light',
    rarity: 'rare',
    image: '/knights/knight-tristan-profile.png',
    fullImage: '/knights/knight-tristan.jpg',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '빛을 수호하는 아서왕의 수호 기사.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_4', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 5,
      gold: 5000
    },

    baseStats: {
      str: 20,
      agi: 10,
      int: 10,
      vit: 15,
      luk: 15
    },

    statGrowth: {
      str: 3,
      agi: 1,
      int: 2,
      vit: 2,
      luk: 2
    }
  },
  // ========================================================
  // 9. 카이 (빛의 던전 소환 기사)
  // ========================================================
  'knight_light_kay': {
    id: 'knight_light_kay',
    name: 'Kay',
    title: 'Light Saver',
    attribute: 'light',
    rarity: 'rare',
    image: '/knights/knight-kay-profile.png',
    fullImage: '/knights/knight-kay.jpg',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '빛을 수호하는 검.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_4', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 5,
      gold: 5000
    },

    baseStats: {
      str: 15,
      agi: 10,
      int: 15,
      vit: 15,
      luk: 15
    },

    statGrowth: {
      str: 2,
      agi: 1,
      int: 2,
      vit: 2,
      luk: 3
    }
  }
};
