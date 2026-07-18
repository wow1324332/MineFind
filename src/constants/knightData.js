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
    image: '/knights/main/mainknight-profile.webp',
    bgImage: '/knights/main/mainknight.webp', 
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
  // 🌋 2. 랜슬롯 (불의 던전 소환 기사)
  // ========================================================
  'knight_fire_lancelot': {
    id: 'knight_fire_lancelot',
    name: 'Lancelot',
    title: 'Knight of Flame',
    attribute: 'fire',
    rarity: 'rare',
    image: '/knights/fire/knight-lencelot-profile.webp',    // 갤러리/목록용 미니 프로필
    fullImage: '/knights/fire/knight-lancelot.webp',   // 🎬 시네마틱 연출용 전신 일러스트
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
    image: '/knights/fire/knight-gawain-profile.webp',
    fullImage: '/knights/fire/knight-gawain.webp',   // 🎬 시네마틱 연출용 전신 일러스트
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
  // 4. 라리스 (불의 던전 소환 기사)
  // ========================================================
  'knight_fire_laris': {
    id: 'knight_fire_laris',
    name: 'Laris',
    title: 'Sister of Flame King',
    attribute: 'fire',
    rarity: 'rare',
    image: '/knights/fire/knight-laris-profile.webp',
    fullImage: '/knights/fire/knight-laris.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '불의 여제의 첫째 딸.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_1', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
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
      int: 1,
      vit: 3,
      luk: 2
    }
  },

    // ========================================================
  // 🌋 5. 이그니트 (불의 던전 소환 기사)
  // ========================================================
  'knight_fire_ignite': {
    id: 'knight_fire_ignite',
    name: 'Ignite',
    title: 'Knight of Flame',
    attribute: 'fire',
    rarity: 'rare',
    image: '/knights/fire/knight-ignite-profile.webp',    // 갤러리/목록용 미니 프로필
    fullImage: '/knights/fire/knight-ignite.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '어려서 부터 화염의 기운을 갖고 태어난 화염의 성기사.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_1', // 불의 던전 난이도별 확률 드랍템 (지옥염룡의 역린 등)
      count: 10,
      gold: 5000
    },

    baseStats: {
      str: 15,
      agi: 15,
      int: 10,
      vit: 15,
      luk: 15
    },

    statGrowth: {
      str: 5,
      agi: 4,
      int: 1,
      vit: 3,
      luk: 2
    }
  },

  // ========================================================
  // 🌋 6. 파라미르 (불의 던전 소환 기사)
  // ========================================================
  'knight_fire_paramir': {
    id: 'knight_fire_paramir',
    name: 'Paramir',
    title: 'Knight of Flame',
    attribute: 'fire',
    rarity: 'rare',
    image: '/knights/fire/knight-paramir-profile.webp',    // 갤러리/목록용 미니 프로필
    fullImage: '/knights/fire/knight-paramir.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '화염의 정령의 선택을 받은 불의 성기사.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_1', // 불의 던전 난이도별 확률 드랍템 (지옥염룡의 역린 등)
      count: 10,
      gold: 5000
    },

    baseStats: {
      str: 20,
      agi: 15,
      int: 5,
      vit: 20,
      luk: 10
    },

    statGrowth: {
      str: 5,
      agi: 2,
      int: 1,
      vit: 4,
      luk: 3
    }
  },
  
  // ========================================================
  // 7. 겔러해드 (물의 던전 소환 기사)
  // ========================================================
  'knight_water_galahad': {
    id: 'knight_water_galahad',
    name: 'Galahad',
    title: 'Defender of Water',
    attribute: 'water',
    rarity: 'rare',
    image: '/knights/water/knight-galahad-profile.webp',
    fullImage: '/knights/water/knight-galahad.webp',   // 🎬 시네마틱 연출용 전신 일러스트
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
  // 8. 퍼시벌 (물의 던전 소환 기사)
  // ========================================================
  'knight_water_percival': {
    id: 'knight_water_percival',
    name: 'Percival',
    title: 'Defender of Water',
    attribute: 'water',
    rarity: 'rare',
    image: '/knights/water/knight-percival-profile.webp',
    fullImage: '/knights/water/knight-percival.webp',   // 🎬 시네마틱 연출용 전신 일러스트
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
  // 9. 우리엔 (물의 던전 소환 기사)
  // ========================================================
  'knight_water_urien': {
    id: 'knight_water_urien',
    name: 'Urien',
    title: 'Defender of Water',
    attribute: 'water',
    rarity: 'rare',
    image: '/knights/water/knight-urien-profile.webp',
    fullImage: '/knights/water/knight-urien.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '물의 던전을 수호하던 물의 여제의 딸.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_2', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 5,
      gold: 5000
    },

    baseStats: {
      str: 10,
      agi: 10,
      int: 10,
      vit: 25,
      luk: 15
    },

    statGrowth: {
      str: 1,
      agi: 2,
      int: 1,
      vit: 4,
      luk: 2
    }
  },

  // ========================================================
  // 10. 헬리오나 (물의 던전 소환 기사)
  // ========================================================
  'knight_water_heliona': {
    id: 'knight_water_heliona',
    name: 'Heliona',
    title: 'knight of Water',
    attribute: 'water',
    rarity: 'rare',
    image: '/knights/water/knight-heliona-profile.webp',
    fullImage: '/knights/water/knight-heliona.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '물의 던전에 갇혀버린 물의 여신의 둘째 딸.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_2', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 10,
      gold: 5000
    },

    baseStats: {
      str: 15,
      agi: 10,
      int: 5,
      vit: 20,
      luk: 20
    },

    statGrowth: {
      str: 3,
      agi: 2,
      int: 1,
      vit: 5,
      luk: 4
    }
  },

  // ========================================================
  // 11. 팔라메데스 (물의 던전 소환 기사)
  // ========================================================
  'knight_water_palamedes': {
    id: 'knight_water_palamedes',
    name: 'Palamedes',
    title: 'knight of Water',
    attribute: 'water',
    rarity: 'rare',
    image: '/knights/water/knight-palamedes-profile.webp',
    fullImage: '/knights/water/knight-palamedes.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '물의 던전을 수호하는 포세이돈이 인간계에 남긴 아들.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_2', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 10,
      gold: 5000
    },

    baseStats: {
      str: 15,
      agi: 10,
      int: 5,
      vit: 20,
      luk: 20
    },

    statGrowth: {
      str: 3,
      agi: 2,
      int: 1,
      vit: 5,
      luk: 4
    }
  }, 
  
  // ========================================================
  // 12. 모드레드 (독의 던전 소환 기사)
  // ========================================================
  'knight_poison_mordred': {
    id: 'knight_poison_mordred',
    name: 'Mordred',
    title: 'Assassin of poison',
    attribute: 'poison',
    rarity: 'rare',
    image: '/knights/poison/knight-mordred-profile.webp',
    fullImage: '/knights/poison/knight-mordred.webp',   // 🎬 시네마틱 연출용 전신 일러스트
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
  // 13. 가레스 (독의 던전 소환 기사)
  // ========================================================
  'knight_poison_gareth': {
    id: 'knight_poison_gareth',
    name: 'Gareth',
    title: 'Assassin of Shadow',
    attribute: 'poison',
    rarity: 'rare',
    image: '/knights/poison/knight-gareth-profile.webp',
    fullImage: '/knights/poison/knight-gareth.webp',   // 🎬 시네마틱 연출용 전신 일러스트
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
  // 14. 사피르 (독의 던전 소환 기사)
  // ========================================================
  'knight_poison_safir': {
    id: 'knight_poison_safir',
    name: 'Safir',
    title: 'Assassin of Shadow',
    attribute: 'poison',
    rarity: 'rare',
    image: '/knights/poison/knight-safir-profile.webp',
    fullImage: '/knights/poison/knight-safir.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '그림자 기사단의 마지막 후예.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_3', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 5,
      gold: 5000
    },

    baseStats: {
      str: 15,
      agi: 25,
      int: 10,
      vit: 5,
      luk: 15
    },

    statGrowth: {
      str: 2,
      agi: 4,
      int: 1,
      vit: 1,
      luk: 2
    }
  },

  // ========================================================
  // 15. 보어스 (독의 던전 소환 기사)
  // ========================================================
  'knight_poison_bors': {
    id: 'knight_poison_bors',
    name: 'Bors',
    title: 'knight of poison',
    attribute: 'poison',
    rarity: 'rare',
    image: '/knights/poison/knight-bors-profile.webp',
    fullImage: '/knights/poison/knight-bors.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '독의 던전에 갇혀버린 기사이자, 증오의 여신의 아들.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_3', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 10,
      gold: 5000
    },

    baseStats: {
      str: 20,
      agi: 20,
      int: 10,
      vit: 10,
      luk: 20
    },

    statGrowth: {
      str: 3,
      agi: 5,
      int: 2,
      vit: 2,
      luk: 3
    }
  },

  // ========================================================
  // 16. 칼레그로난트 (독의 던전 소환 기사)
  // ========================================================
  'knight_poison_calogrenant': {
    id: 'knight_poison_calogrenant',
    name: 'Calogrenant',
    title: 'knight of poison',
    attribute: 'poison',
    rarity: 'rare',
    image: '/knights/poison/knight-calogrenant-profile.webp',
    fullImage: '/knights/poison/knight-calogrenant.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '맹독의 던전을 정화하는 증오의 여신의 딸.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_3', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 10,
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
      str: 2,
      agi: 5,
      int: 4,
      vit: 2,
      luk: 2
    }
  },
  
  // ========================================================
  // 17. 트리스탄 (빛의 던전 소환 기사)
  // ========================================================
  'knight_light_tristan': {
    id: 'knight_light_tristan',
    name: 'Tristan',
    title: 'Defender of light',
    attribute: 'light',
    rarity: 'rare',
    image: '/knights/light/knight-tristan-profile.webp',
    fullImage: '/knights/light/knight-tristan.webp',   // 🎬 시네마틱 연출용 전신 일러스트
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
  // 18. 카이 (빛의 던전 소환 기사)
  // ========================================================
  'knight_light_kay': {
    id: 'knight_light_kay',
    name: 'Kay',
    title: 'Light Saver',
    attribute: 'light',
    rarity: 'rare',
    image: '/knights/light/knight-kay-profile.webp',
    fullImage: '/knights/light/knight-kay.webp',   // 🎬 시네마틱 연출용 전신 일러스트
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
  },

  // ========================================================
  // 19. 베다비어 (빛의 던전 소환 기사)
  // ========================================================
  'knight_light_bedivere': {
    id: 'knight_light_bedivere',
    name: 'Bedivere',
    title: 'knight of light',
    attribute: 'light',
    rarity: 'rare',
    image: '/knights/light/knight-bedivere-profile.webp',
    fullImage: '/knights/light/knight-bedivere.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '빛의 성전에서 파견 나온 상급 빛의 성기사.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_4', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 5,
      gold: 5000
    },

    baseStats: {
      str: 20,
      agi: 15,
      int: 15,
      vit: 10,
      luk: 10
    },

    statGrowth: {
      str: 3,
      agi: 2,
      int: 3,
      vit: 1,
      luk: 1
    }
  },

  // ========================================================
  // 20. 디고어 (빛의 던전 소환 기사)
  // ========================================================
  'knight_light_degore': {
    id: 'knight_light_degore',
    name: 'Degore',
    title: 'Son of Jesus',
    attribute: 'light',
    rarity: 'rare',
    image: '/knights/light/knight-degore-profile.webp',
    fullImage: '/knights/light/knight-degore.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '악의 정화를 위해 제우스가 남긴 반신 아들.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_4', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 10,
      gold: 5000
    },

    baseStats: {
      str: 20,
      agi: 15,
      int: 20,
      vit: 15,
      luk: 10
    },

    statGrowth: {
      str: 5,
      agi: 2,
      int: 5,
      vit: 2,
      luk: 1
    }
  },

  // ========================================================
  // 21. 그리플렛 (빛의 던전 소환 기사)
  // ========================================================
  'knight_light_griflet': {
    id: 'knight_light_griflet',
    name: 'Griflet',
    title: 'knight of light',
    attribute: 'light',
    rarity: 'rare',
    image: '/knights/light/knight-griflet-profile.webp',
    fullImage: '/knights/light/knight-griflet.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '빛의 성전 제1기사단의 기사단장.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_4', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 10,
      gold: 5000
    },

    baseStats: {
      str: 20,
      agi: 15,
      int: 20,
      vit: 15,
      luk: 10
    },

    statGrowth: {
      str: 4,
      agi: 3,
      int: 5,
      vit: 2,
      luk: 1
    }
  },
  
  // ========================================================
  // 22. 가헤리스 (혹한의 던전 소환 기사)
  // ========================================================
  'knight_ice_gaheris': {
    id: 'knight_ice_gaheris',
    name: 'Gaheris',
    title: 'Frozen Saver',
    attribute: 'ice',
    rarity: 'rare',
    image: '/knights/ice/knight-gaheris-profile.webp',
    fullImage: '/knights/ice/knight-gaheris.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '혹한의 기운을 다스리는 여제.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_5', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 5,
      gold: 5000
    },

    baseStats: {
      str: 15,
      agi: 10,
      int: 25,
      vit: 10,
      luk: 10
    },

    statGrowth: {
      str: 2,
      agi: 1,
      int: 3,
      vit: 2,
      luk: 2
    }
  },
  
  // ========================================================
  // 23. 토어 (혹한의 던전 소환 기사)
  // ========================================================
  'knight_ice_tor': {
    id: 'knight_ice_tor',
    name: 'Tor',
    title: 'Knight of Frozen',
    attribute: 'ice',
    rarity: 'rare',
    image: '/knights/ice/knight-tor-profile.webp',
    fullImage: '/knights/ice/knight-tor.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '냉기를 수호하는 검.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_5', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 5,
      gold: 5000
    },

    baseStats: {
      str: 15,
      agi: 15,
      int: 20,
      vit: 15,
      luk: 5
    },

    statGrowth: {
      str: 2,
      agi: 2,
      int: 3,
      vit: 2,
      luk: 1
    }
  },

  // ========================================================
  // 24. 라모락 (혹한의 던전 소환 기사)
  // ========================================================
  'knight_ice_lamorak': {
    id: 'knight_ice_lamorak',
    name: 'Lamorak',
    title: 'Knight of Frozen',
    attribute: 'ice',
    rarity: 'rare',
    image: '/knights/ice/knight-lamorak-profile.webp',
    fullImage: '/knights/ice/knight-lamorak.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '혹한의 나라 아이스릴 국왕의 둘쨰 아들.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_5', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 10,
      gold: 5000
    },

    baseStats: {
      str: 20,
      agi: 15,
      int: 20,
      vit: 15,
      luk: 10
    },

    statGrowth: {
      str: 4,
      agi: 3,
      int: 3,
      vit: 4,
      luk: 1
    }
  },

  // ========================================================
  // 25. 리오넬 (혹한의 던전 소환 기사)
  // ========================================================
  'knight_ice_lionel': {
    id: 'knight_ice_lionel',
    name: 'Lionel',
    title: 'Knight of Frozen',
    attribute: 'ice',
    rarity: 'rare',
    image: '/knights/ice/knight-lionel-profile.webp',
    fullImage: '/knights/ice/knight-lionel.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '혹한의 왕국 아이스릴의 황태자.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_5', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 10,
      gold: 5000
    },

    baseStats: {
      str: 15,
      agi: 20,
      int: 20,
      vit: 15,
      luk: 10
    },

    statGrowth: {
      str: 2,
      agi: 4,
      int: 4,
      vit: 2,
      luk: 3
    }
  },

  // ========================================================
  // 26. 다고넷 (혹한의 던전 소환 기사)
  // ========================================================
  'knight_ice_dagonet': {
    id: 'knight_ice_dagonet',
    name: 'Dagonet',
    title: 'Knight of Frozen',
    attribute: 'ice',
    rarity: 'rare',
    image: '/knights/ice/knight-dagonet-profile.webp',
    fullImage: '/knights/ice/knight-dagonet.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '혹한의 왕국 아이스릴의 왕국 기사단장.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_5', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 10,
      gold: 5000
    },

    baseStats: {
      str: 20,
      agi: 20,
      int: 20,
      vit: 15,
      luk: 5
    },

    statGrowth: {
      str: 4,
      agi: 4,
      int: 4,
      vit: 2,
      luk: 1
    }
  },

  // ========================================================
  // 27. 엠마 (역병의 던전 소환 기사)
  // ========================================================
  'knight_cure_amma': {
    id: 'knight_cure_amma',
    name: 'Amma',
    title: 'Priest of Cure',
    attribute: 'cure',
    rarity: 'rare',
    image: '/knights/plague/knight-amma-profile.webp',
    fullImage: '/knights/plague/knight-amma.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '빛의 기운으로 악을 정화하는 여사제.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_6', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 5,
      gold: 5000
    },

    baseStats: {
      str: 10,
      agi: 10,
      int: 30,
      vit: 10,
      luk: 10
    },

    statGrowth: {
      str: 1,
      agi: 1,
      int: 4,
      vit: 2,
      luk: 2
    }
  },

  // ========================================================
  // 28. 티에라 (역병의 던전 소환 기사)
  // ========================================================
  'knight_cure_tierra': {
    id: 'knight_cure_tierra',
    name: 'Tierra',
    title: 'Knight of Cure',
    attribute: 'cure',
    rarity: 'rare',
    image: '/knights/plague/knight-tierra-profile.webp',
    fullImage: '/knights/plague/knight-tierra.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '치유의 기운으로 악을 정화하는 여전.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_6', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 5,
      gold: 5000
    },

    baseStats: {
      str: 20,
      agi: 10,
      int: 20,
      vit: 15,
      luk: 5
    },

    statGrowth: {
      str: 3,
      agi: 2,
      int: 3,
      vit: 1,
      luk: 1
    }
  },
    // ========================================================
  // 29. 도나 (역병의 던전 소환 기사)
  // ========================================================
  'knight_cure_dornar': {
    id: 'knight_cure_dornar',
    name: 'Dornar',
    title: 'Knight of Cure',
    attribute: 'cure',
    rarity: 'rare',
    image: '/knights/plague/knight-dornar-profile.webp',
    fullImage: '/knights/plague/knight-dornar.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '신성제국 함멜의 왕실 기사단 부단장.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_6', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 5,
      gold: 5000
    },

    baseStats: {
      str: 25,
      agi: 5,
      int: 20,
      vit: 15,
      luk: 5
    },

    statGrowth: {
      str: 4,
      agi: 1,
      int: 3,
      vit: 1,
      luk: 1
    }
  },
  // ========================================================
  // 30. 그윈 (역병의 던전 소환 기사)
  // ========================================================
  'knight_cure_gwin': {
    id: 'knight_cure_gwin',
    name: 'Gwin',
    title: 'Knight of Cure',
    attribute: 'cure',
    rarity: 'rare',
    image: '/knights/plague/knight-gwin-profile.webp',
    fullImage: '/knights/plague/knight-gwin.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '함멜의 제2기사단인 큐오브릭의 단장.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_6', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 10,
      gold: 5000
    },

    baseStats: {
      str: 20,
      agi: 20,
      int: 20,
      vit: 15,
      luk: 5
    },

    statGrowth: {
      str: 4,
      agi: 4,
      int: 5,
      vit: 1,
      luk: 1
    }
  },
  // ========================================================
  // 31. 도디넬 (역병의 던전 소환 기사)
  // ========================================================
  'knight_cure_dodinel': {
    id: 'knight_cure_dodinel',
    name: 'Dodinel',
    title: 'Knight of Cure',
    attribute: 'cure',
    rarity: 'rare',
    image: '/knights/plague/knight-dodinel-profile.webp',
    fullImage: '/knights/plague/knight-dodinel.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '신성제국 함멜의 성녀.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_6', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 10,
      gold: 5000
    },

    baseStats: {
      str: 10,
      agi: 20,
      int: 30,
      vit: 15,
      luk: 5
    },

    statGrowth: {
      str: 2,
      agi: 3,
      int: 5,
      vit: 2,
      luk: 3
    }
  },
  // ========================================================
  // 32. 오웨인 (공허의 던전 소환 기사)
  // ========================================================
  'knight_vain_owain': {
    id: 'knight_vain_owain',
    name: 'Owain',
    title: 'Knight of vain',
    attribute: 'vain',
    rarity: 'rare',
    image: '/knights/vain/knight-owain-profile.webp',
    fullImage: '/knights/vain/knight-owain.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '제국 카르마스 국왕의 첫째 아들, 공허의 던전을 정화하는 임무를 맡고있다.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_7', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 5,
      gold: 5000
    },

    baseStats: {
      str: 10,
      agi: 15,
      int: 25,
      vit: 10,
      luk: 10
    },

    statGrowth: {
      str: 1,
      agi: 3,
      int: 3,
      vit: 2,
      luk: 1
    }
  },
  // ========================================================
  // 33. 이웨인 (공허의 던전 소환 기사)
  // ========================================================
  'knight_vain_ywain': {
    id: 'knight_vain_ywain',
    name: 'Ywain',
    title: 'Knight of vain',
    attribute: 'vain',
    rarity: 'rare',
    image: '/knights/vain/knight-ywain-profile.webp',
    fullImage: '/knights/vain/knight-ywain.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '제국 카르마스 국왕의 둘째 아들, 공허의 던전을 정화하는 임무를 맡고있다.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_7', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 5,
      gold: 5000
    },

    baseStats: {
      str: 10,
      agi: 10,
      int: 25,
      vit: 15,
      luk: 10
    },

    statGrowth: {
      str: 1,
      agi: 1,
      int: 3,
      vit: 3,
      luk: 2
    }
  },
  // ========================================================
  // 34. 이베인 (공허의 던전 소환 기사)
  // ========================================================
  'knight_vain_yvain': {
    id: 'knight_vain_yvain',
    name: 'Yvain',
    title: 'Knight of vain',
    attribute: 'vain',
    rarity: 'rare',
    image: '/knights/vain/knight-yvain-profile.webp',
    fullImage: '/knights/vain/knight-yvain.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '제국 카르마스 국왕의 막내 아들, 공허의 던전을 정화하는 임무를 맡고있다.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_7', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 5,
      gold: 5000
    },

    baseStats: {
      str: 15,
      agi: 10,
      int: 20,
      vit: 15,
      luk: 10
    },

    statGrowth: {
      str: 2,
      agi: 1,
      int: 2,
      vit: 3,
      luk: 2
    }
  },
  // ========================================================
  // 35. 멀린 (공허의 던전 소환 기사)
  // ========================================================
  'knight_vain_merlin': {
    id: 'knight_vain_merlin',
    name: 'Merlin',
    title: 'Knight of vain',
    attribute: 'vain',
    rarity: 'rare',
    image: '/knights/vain/knight-merlin-profile.webp',
    fullImage: '/knights/vain/knight-merlin.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '악에 대항하는 비밀 결사단 크롬마스의 대현자.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_7', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 10,
      gold: 5000
    },

    baseStats: {
      str: 10,
      agi: 20,
      int: 30,
      vit: 10,
      luk: 10
    },

    statGrowth: {
      str: 1,
      agi: 4,
      int: 5,
      vit: 3,
      luk: 2
    }
  },
  // ========================================================
  // 36. 아그로베일 (공허의 던전 소환 기사)
  // ========================================================
  'knight_vain_aglovale': {
    id: 'knight_vain_aglovale',
    name: 'Aglovale',
    title: 'Knight of vain',
    attribute: 'vain',
    rarity: 'rare',
    image: '/knights/vain/knight-aglovale-profile.webp',
    fullImage: '/knights/vain/knight-aglovale.webp',   // 🎬 시네마틱 연출용 전신 일러스트
    description: '악에 대항하는 비밀 결사단 크롬마스의 대현자.',
    
    // 💡 Knights.jsx 시네마틱 소환에 연동되는 비용 데이터
    cost: {
      itemId: 'con_soul_7', // 물의 던전 난이도별 확률 드랍템 (포세이돈의 눈물 등)
      count: 10,
      gold: 5000
    },

    baseStats: {
      str: 10,
      agi: 20,
      int: 30,
      vit: 10,
      luk: 10
    },

    statGrowth: {
      str: 1,
      agi: 5,
      int: 6,
      vit: 1,
      luk: 2
    }
  },
};
