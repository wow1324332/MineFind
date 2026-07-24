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
    
    baseStats: { str: 10, agi: 10, int: 10, vit: 15, luk: 10 },
    statGrowth: { str: 2, agi: 2, int: 2, vit: 2, luk: 2 },

    // ✨ 액티브 스킬은 고정
    activeSkill: 'active_main_strike',

    // ✨ 기본 장착 패시브 (파이어베이스 데이터가 없을 때의 기본값)
    passiveSkill: 'passive_main_str', 

    // 💡 주인공 전용: 언제든 교체 가능한 패시브 스킬 3종 풀(Pool)
    selectablePassives: [
      'passive_main_str', // 공격력 특화
      'passive_main_vit', // 생존력 특화
      'passive_main_agi'  // 속도/크리티컬 특화
    ]
  },

  // ========================================================
  // 🌋 불의 기사단 (Fire)
  // ========================================================
  'knight_fire_lancelot': {
    id: 'knight_fire_lancelot',
    name: 'Lancelot',
    title: 'Knight of Flame',
    attribute: 'fire',
    rarity: 'rare',
    image: '/knights/fire/knight-lencelot-profile.webp',    
    fullImage: '/knights/fire/knight-lancelot.webp',   
    description: '지옥불 던전 깊은 곳에서 계약을 맺은 화염의 기사입니다.',
    cost: { itemId: 'con_soul_1', count: 5, gold: 5000 },
    baseStats: { str: 20, agi: 10, int: 5, vit: 20, luk: 15 },
    statGrowth: { str: 3, agi: 1, int: 1, vit: 3, luk: 2 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_fire_atk',  // 불속성 아군 공격력 상승
    activeSkill: 'active_fire_slash'   // 화염 베기 (단일 타격)
  },

  'knight_fire_gawain': {
    id: 'knight_fire_gawain',
    name: 'Gawain',
    title: 'Knight of Fire',
    attribute: 'fire',
    rarity: 'rare',
    image: '/knights/fire/knight-gawain-profile.webp',
    fullImage: '/knights/fire/knight-gawain.webp',   
    description: '불의 던전에서 구출된 후 당신에게 충성을 맹세한 기사입니다.',
    cost: { itemId: 'con_soul_1', count: 5, gold: 5000 },
    baseStats: { str: 25, agi: 5, int: 10, vit: 20, luk: 10 },
    statGrowth: { str: 5, agi: 2, int: 1, vit: 1, luk: 1 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_fire_crit', // 치명타 확률 상승
    activeSkill: 'active_fire_burst'   // 화염 폭발 (큰 데미지)
  },

  'knight_fire_laris': {
    id: 'knight_fire_laris',
    name: 'Laris',
    title: 'Sister of Flame King',
    attribute: 'fire',
    rarity: 'rare',
    image: '/knights/fire/knight-laris-profile.webp',
    fullImage: '/knights/fire/knight-laris.webp',   
    description: '불의 여제의 첫째 딸.',
    cost: { itemId: 'con_soul_1', count: 5, gold: 5000 },
    baseStats: { str: 20, agi: 10, int: 10, vit: 15, luk: 15 },
    statGrowth: { str: 3, agi: 1, int: 1, vit: 3, luk: 2 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_fire_hp',   // 파티 체력 상승
    activeSkill: 'active_fire_storm'   // 화염 폭풍 (지속 데미지)
  },

  'knight_fire_ignite': {
    id: 'knight_fire_ignite',
    name: 'Ignite',
    title: 'Knight of Flame',
    attribute: 'fire',
    rarity: 'rare',
    image: '/knights/fire/knight-ignite-profile.webp',    
    fullImage: '/knights/fire/knight-ignite.webp',   
    description: '어려서 부터 화염의 기운을 갖고 태어난 화염의 성기사.',
    cost: { itemId: 'con_soul_1', count: 10, gold: 5000 },
    baseStats: { str: 15, agi: 15, int: 10, vit: 15, luk: 15 },
    statGrowth: { str: 5, agi: 4, int: 1, vit: 3, luk: 2 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_fire_def',  // 불속성 방어력 상승
    activeSkill: 'active_fire_shield'  // 화염 방패 (버프)
  },

  'knight_fire_paramir': {
    id: 'knight_fire_paramir',
    name: 'Paramir',
    title: 'Knight of Flame',
    attribute: 'fire',
    rarity: 'rare',
    image: '/knights/fire/knight-paramir-profile.webp',    
    fullImage: '/knights/fire/knight-paramir.webp',   
    description: '화염의 정령의 선택을 받은 불의 성기사.',
    cost: { itemId: 'con_soul_1', count: 10, gold: 5000 },
    baseStats: { str: 20, agi: 15, int: 5, vit: 20, luk: 10 },
    statGrowth: { str: 5, agi: 2, int: 1, vit: 4, luk: 3 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_fire_resist', // 보스 공격력 감소 (디버프)
    activeSkill: 'active_fire_pierce'    // 화염 찌르기 (방관)
  },
  
  // ========================================================
  // 💧 물의 기사단 (Water)
  // ========================================================
  'knight_water_galahad': {
    id: 'knight_water_galahad',
    name: 'Galahad',
    title: 'Defender of Water',
    attribute: 'water',
    rarity: 'rare',
    image: '/knights/water/knight-galahad-profile.webp',
    fullImage: '/knights/water/knight-galahad.webp',   
    description: '물의 던전을 수호하던 고대 기사의 영령.',
    cost: { itemId: 'con_soul_2', count: 5, gold: 5000 },
    baseStats: { str: 15, agi: 5, int: 10, vit: 25, luk: 15 },
    statGrowth: { str: 2, agi: 1, int: 1, vit: 4, luk: 2 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_water_def', // 물속성 아군 방어력 상승
    activeSkill: 'active_water_shield' // 물의 방패 (회피율 증가)
  },

  'knight_water_percival': {
    id: 'knight_water_percival',
    name: 'Percival',
    title: 'Defender of Water',
    attribute: 'water',
    rarity: 'rare',
    image: '/knights/water/knight-percival-profile.webp',
    fullImage: '/knights/water/knight-percival.webp',   
    description: '물의 던전을 수호하던 고대 기사의 영령.',
    cost: { itemId: 'con_soul_2', count: 5, gold: 5000 },
    baseStats: { str: 10, agi: 5, int: 10, vit: 30, luk: 15 },
    statGrowth: { str: 1, agi: 1, int: 1, vit: 5, luk: 2 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_water_hp',  // 파티 체력 상승
    activeSkill: 'active_water_heal'   // 치유의 물결 (회복)
  },

  'knight_water_urien': {
    id: 'knight_water_urien',
    name: 'Urien',
    title: 'Defender of Water',
    attribute: 'water',
    rarity: 'rare',
    image: '/knights/water/knight-urien-profile.webp',
    fullImage: '/knights/water/knight-urien.webp',   
    description: '물의 던전을 수호하던 물의 여제의 딸.',
    cost: { itemId: 'con_soul_2', count: 5, gold: 5000 },
    baseStats: { str: 10, agi: 10, int: 10, vit: 25, luk: 15 },
    statGrowth: { str: 1, agi: 2, int: 1, vit: 4, luk: 2 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_water_atk', // 공격력 상승
    activeSkill: 'active_water_slash'  // 파도 베기 (공격)
  },

  'knight_water_heliona': {
    id: 'knight_water_heliona',
    name: 'Heliona',
    title: 'knight of Water',
    attribute: 'water',
    rarity: 'rare',
    image: '/knights/water/knight-heliona-profile.webp',
    fullImage: '/knights/water/knight-heliona.webp',   
    description: '물의 던전에 갇혀버린 물의 여신의 둘째 딸.',
    cost: { itemId: 'con_soul_2', count: 10, gold: 5000 },
    baseStats: { str: 15, agi: 10, int: 5, vit: 20, luk: 20 },
    statGrowth: { str: 3, agi: 2, int: 1, vit: 5, luk: 4 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_water_evade', // 회피율 증가
    activeSkill: 'active_water_wave'     // 해일 (디버프 공격)
  },

  'knight_water_palamedes': {
    id: 'knight_water_palamedes',
    name: 'Palamedes',
    title: 'knight of Water',
    attribute: 'water',
    rarity: 'rare',
    image: '/knights/water/knight-palamedes-profile.webp',
    fullImage: '/knights/water/knight-palamedes.webp',   
    description: '물의 던전을 수호하는 포세이돈이 인간계에 남긴 아들.',
    cost: { itemId: 'con_soul_2', count: 10, gold: 5000 },
    baseStats: { str: 15, agi: 10, int: 5, vit: 20, luk: 20 },
    statGrowth: { str: 3, agi: 2, int: 1, vit: 5, luk: 4 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_water_crit', // 치명타 확률 증가
    activeSkill: 'active_water_spear'   // 삼지창 찌르기 (강타)
  }, 
  
  // ========================================================
  // ☠️ 독의 기사단 (Poison)
  // ========================================================
  'knight_poison_mordred': {
    id: 'knight_poison_mordred',
    name: 'Mordred',
    title: 'Assassin of poison',
    attribute: 'poison',
    rarity: 'rare',
    image: '/knights/poison/knight-mordred-profile.webp',
    fullImage: '/knights/poison/knight-mordred.webp',   
    description: '독의 던전을 수호하던 고대 기사의 영령.',
    cost: { itemId: 'con_soul_3', count: 5, gold: 5000 },
    baseStats: { str: 10, agi: 25, int: 10, vit: 15, luk: 10 },
    statGrowth: { str: 2, agi: 3, int: 1, vit: 1, luk: 2 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_poison_atk', // 독속성 공격력 증가
    activeSkill: 'active_poison_stab'   // 맹독 찌르기
  },
  
  'knight_poison_gareth': {
    id: 'knight_poison_gareth',
    name: 'Gareth',
    title: 'Assassin of Shadow',
    attribute: 'poison',
    rarity: 'rare',
    image: '/knights/poison/knight-gareth-profile.webp',
    fullImage: '/knights/poison/knight-gareth.webp',   
    description: '독의 던전을 수호하던 고대 기사의 그림자.',
    cost: { itemId: 'con_soul_3', count: 5, gold: 5000 },
    baseStats: { str: 15, agi: 20, int: 10, vit: 10, luk: 15 },
    statGrowth: { str: 2, agi: 3, int: 1, vit: 1, luk: 3 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_poison_evade', // 파티 회피율 상승
    activeSkill: 'active_poison_cloud'    // 맹독 구름 (도트 데미지)
  },

  'knight_poison_safir': {
    id: 'knight_poison_safir',
    name: 'Safir',
    title: 'Assassin of Shadow',
    attribute: 'poison',
    rarity: 'rare',
    image: '/knights/poison/knight-safir-profile.webp',
    fullImage: '/knights/poison/knight-safir.webp',   
    description: '그림자 기사단의 마지막 후예.',
    cost: { itemId: 'con_soul_3', count: 5, gold: 5000 },
    baseStats: { str: 15, agi: 25, int: 10, vit: 5, luk: 15 },
    statGrowth: { str: 2, agi: 4, int: 1, vit: 1, luk: 2 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_poison_crit', // 치명타 대미지 증가
    activeSkill: 'active_poison_assassinate' // 암살 (회피 무시 타격)
  },

  'knight_poison_bors': {
    id: 'knight_poison_bors',
    name: 'Bors',
    title: 'knight of poison',
    attribute: 'poison',
    rarity: 'rare',
    image: '/knights/poison/knight-bors-profile.webp',
    fullImage: '/knights/poison/knight-bors.webp',   
    description: '독의 던전에 갇혀버린 기사이자, 증오의 여신의 아들.',
    cost: { itemId: 'con_soul_3', count: 10, gold: 5000 },
    baseStats: { str: 20, agi: 20, int: 10, vit: 10, luk: 20 },
    statGrowth: { str: 3, agi: 5, int: 2, vit: 2, luk: 3 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_poison_hp',   // 보스 공격력 디버프
    activeSkill: 'active_poison_strike'  // 독기 방출 (광역기 느낌의 강타)
  },

  'knight_poison_calogrenant': {
    id: 'knight_poison_calogrenant',
    name: 'Calogrenant',
    title: 'knight of poison',
    attribute: 'poison',
    rarity: 'rare',
    image: '/knights/poison/knight-calogrenant-profile.webp',
    fullImage: '/knights/poison/knight-calogrenant.webp',   
    description: '맹독의 던전을 정화하는 증오의 여신의 딸.',
    cost: { itemId: 'con_soul_3', count: 10, gold: 5000 },
    baseStats: { str: 10, agi: 25, int: 20, vit: 10, luk: 15 },
    statGrowth: { str: 2, agi: 5, int: 4, vit: 2, luk: 2 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_poison_def', // 보스 방어력 감소
    activeSkill: 'active_poison_trap'   // 맹독 덫 (다음 턴 보스 데미지 약화)
  },
  
  // ========================================================
  // ☀️ 빛의 기사단 (Light)
  // ========================================================
  'knight_light_tristan': {
    id: 'knight_light_tristan',
    name: 'Tristan',
    title: 'Defender of light',
    attribute: 'light',
    rarity: 'rare',
    image: '/knights/light/knight-tristan-profile.webp',
    fullImage: '/knights/light/knight-tristan.webp',   
    description: '빛을 수호하는 아서왕의 수호 기사.',
    cost: { itemId: 'con_soul_4', count: 5, gold: 5000 },
    baseStats: { str: 20, agi: 10, int: 10, vit: 15, luk: 15 },
    statGrowth: { str: 3, agi: 1, int: 2, vit: 2, luk: 2 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_light_def', // 방어력 대폭 상승
    activeSkill: 'active_light_shield' // 신성한 방패 (피해 감소 버프)
  },
  
  'knight_light_kay': {
    id: 'knight_light_kay',
    name: 'Kay',
    title: 'Light Saver',
    attribute: 'light',
    rarity: 'rare',
    image: '/knights/light/knight-kay-profile.webp',
    fullImage: '/knights/light/knight-kay.webp',   
    description: '빛을 수호하는 검.',
    cost: { itemId: 'con_soul_4', count: 5, gold: 5000 },
    baseStats: { str: 15, agi: 10, int: 15, vit: 15, luk: 15 },
    statGrowth: { str: 2, agi: 1, int: 2, vit: 2, luk: 3 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_light_atk', // 빛속성 공격력 증가
    activeSkill: 'active_light_slash'  // 섬광 베기
  },

  'knight_light_bedivere': {
    id: 'knight_light_bedivere',
    name: 'Bedivere',
    title: 'knight of light',
    attribute: 'light',
    rarity: 'rare',
    image: '/knights/light/knight-bedivere-profile.webp',
    fullImage: '/knights/light/knight-bedivere.webp',   
    description: '빛의 성전에서 파견 나온 상급 빛의 성기사.',
    cost: { itemId: 'con_soul_4', count: 5, gold: 5000 },
    baseStats: { str: 20, agi: 15, int: 15, vit: 10, luk: 10 },
    statGrowth: { str: 3, agi: 2, int: 3, vit: 1, luk: 1 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_light_hp', // 최대 HP 증가
    activeSkill: 'active_light_heal'  // 성스러운 빛 (치유)
  },

  'knight_light_degore': {
    id: 'knight_light_degore',
    name: 'Degore',
    title: 'Son of Jesus',
    attribute: 'light',
    rarity: 'rare',
    image: '/knights/light/knight-degore-profile.webp',
    fullImage: '/knights/light/knight-degore.webp',   
    description: '악의 정화를 위해 제우스가 남긴 반신 아들.',
    cost: { itemId: 'con_soul_4', count: 10, gold: 5000 },
    baseStats: { str: 20, agi: 15, int: 20, vit: 15, luk: 10 },
    statGrowth: { str: 5, agi: 2, int: 5, vit: 2, luk: 1 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_light_crit', // 치명타 확률 대폭 상승
    activeSkill: 'active_light_smite'   // 신의 심판 (강력한 단일기)
  },

  'knight_light_griflet': {
    id: 'knight_light_griflet',
    name: 'Griflet',
    title: 'knight of light',
    attribute: 'light',
    rarity: 'rare',
    image: '/knights/light/knight-griflet-profile.webp',
    fullImage: '/knights/light/knight-griflet.webp',   
    description: '빛의 성전 제1기사단의 기사단장.',
    cost: { itemId: 'con_soul_4', count: 10, gold: 5000 },
    baseStats: { str: 20, agi: 15, int: 20, vit: 15, luk: 10 },
    statGrowth: { str: 4, agi: 3, int: 5, vit: 2, luk: 1 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_light_evade', // 보스 명중률 하락
    activeSkill: 'active_light_pierce'   // 빛의 창 (방어력 무시)
  },
  
  // ========================================================
  // ❄️ 혹한의 기사단 (Ice)
  // ========================================================
  'knight_ice_gaheris': {
    id: 'knight_ice_gaheris',
    name: 'Gaheris',
    title: 'Frozen Saver',
    attribute: 'ice',
    rarity: 'rare',
    image: '/knights/ice/knight-gaheris-profile.webp',
    fullImage: '/knights/ice/knight-gaheris.webp',   
    description: '혹한의 기운을 다스리는 여제.',
    cost: { itemId: 'con_soul_5', count: 5, gold: 5000 },
    baseStats: { str: 15, agi: 10, int: 25, vit: 10, luk: 10 },
    statGrowth: { str: 2, agi: 1, int: 3, vit: 2, luk: 2 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_ice_atk',  // 빙속성 공격력 증가
    activeSkill: 'active_ice_spear'   // 얼음 창
  },
  
  'knight_ice_tor': {
    id: 'knight_ice_tor',
    name: 'Tor',
    title: 'Knight of Frozen',
    attribute: 'ice',
    rarity: 'rare',
    image: '/knights/ice/knight-tor-profile.webp',
    fullImage: '/knights/ice/knight-tor.webp',   
    description: '냉기를 수호하는 검.',
    cost: { itemId: 'con_soul_5', count: 5, gold: 5000 },
    baseStats: { str: 15, agi: 15, int: 20, vit: 15, luk: 5 },
    statGrowth: { str: 2, agi: 2, int: 3, vit: 2, luk: 1 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_ice_def',  // 아군 방어력 증가
    activeSkill: 'active_ice_shield'  // 얼음 방패 (반사 데미지)
  },

  'knight_ice_lamorak': {
    id: 'knight_ice_lamorak',
    name: 'Lamorak',
    title: 'Knight of Frozen',
    attribute: 'ice',
    rarity: 'rare',
    image: '/knights/ice/knight-lamorak-profile.webp',
    fullImage: '/knights/ice/knight-lamorak.webp',   
    description: '혹한의 나라 아이스릴 국왕의 둘쨰 아들.',
    cost: { itemId: 'con_soul_5', count: 10, gold: 5000 },
    baseStats: { str: 20, agi: 15, int: 20, vit: 15, luk: 10 },
    statGrowth: { str: 4, agi: 3, int: 3, vit: 4, luk: 1 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_ice_hp',   // 체력 및 마나 재생 증가
    activeSkill: 'active_ice_blizzard' // 눈보라 (도트 + 적 공속 하락)
  },

  'knight_ice_lionel': {
    id: 'knight_ice_lionel',
    name: 'Lionel',
    title: 'Knight of Frozen',
    attribute: 'ice',
    rarity: 'rare',
    image: '/knights/ice/knight-lionel-profile.webp',
    fullImage: '/knights/ice/knight-lionel.webp',   
    description: '혹한의 왕국 아이스릴의 황태자.',
    cost: { itemId: 'con_soul_5', count: 10, gold: 5000 },
    baseStats: { str: 15, agi: 20, int: 20, vit: 15, luk: 10 },
    statGrowth: { str: 2, agi: 4, int: 4, vit: 2, luk: 3 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_ice_crit', // 치명타 대미지 증가
    activeSkill: 'active_ice_slash'   // 빙결 베기
  },

  'knight_ice_dagonet': {
    id: 'knight_ice_dagonet',
    name: 'Dagonet',
    title: 'Knight of Frozen',
    attribute: 'ice',
    rarity: 'rare',
    image: '/knights/ice/knight-dagonet-profile.webp',
    fullImage: '/knights/ice/knight-dagonet.webp',   
    description: '혹한의 왕국 아이스릴의 왕국 기사단장.',
    cost: { itemId: 'con_soul_5', count: 10, gold: 5000 },
    baseStats: { str: 20, agi: 20, int: 20, vit: 15, luk: 5 },
    statGrowth: { str: 4, agi: 4, int: 4, vit: 2, luk: 1 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_ice_evade', // 파티 전체 회피율 상승
    activeSkill: 'active_ice_freeze'   // 빙결 (1턴간 적 공격력 50% 감소)
  },

  // ========================================================
  // 🌿 역병(치유)의 기사단 (Cure)
  // ========================================================
  'knight_cure_amma': {
    id: 'knight_cure_amma',
    name: 'Amma',
    title: 'Priest of Cure',
    attribute: 'cure',
    rarity: 'rare',
    image: '/knights/plague/knight-amma-profile.webp',
    fullImage: '/knights/plague/knight-amma.webp',   
    description: '빛의 기운으로 악을 정화하는 여사제.',
    cost: { itemId: 'con_soul_6', count: 5, gold: 5000 },
    baseStats: { str: 10, agi: 10, int: 30, vit: 10, luk: 10 },
    statGrowth: { str: 1, agi: 1, int: 4, vit: 2, luk: 2 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_cure_hp', // 턴당 HP 회복 (도트 힐)
    activeSkill: 'active_cure_heal'  // 대천사의 축복 (대형 힐)
  },

  'knight_cure_tierra': {
    id: 'knight_cure_tierra',
    name: 'Tierra',
    title: 'Knight of Cure',
    attribute: 'cure',
    rarity: 'rare',
    image: '/knights/plague/knight-tierra-profile.webp',
    fullImage: '/knights/plague/knight-tierra.webp',   
    description: '치유의 기운으로 악을 정화하는 여전사.',
    cost: { itemId: 'con_soul_6', count: 5, gold: 5000 },
    baseStats: { str: 20, agi: 10, int: 20, vit: 15, luk: 5 },
    statGrowth: { str: 3, agi: 2, int: 3, vit: 1, luk: 1 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_cure_def', // 마법 방어(INT 기반 데미지 감소)
    activeSkill: 'active_cure_shield' // 자연의 방패
  },
  
  'knight_cure_dornar': {
    id: 'knight_cure_dornar',
    name: 'Dornar',
    title: 'Knight of Cure',
    attribute: 'cure',
    rarity: 'rare',
    image: '/knights/plague/knight-dornar-profile.webp',
    fullImage: '/knights/plague/knight-dornar.webp',   
    description: '신성제국 함멜의 왕실 기사단 부단장.',
    cost: { itemId: 'con_soul_6', count: 5, gold: 5000 },
    baseStats: { str: 25, agi: 5, int: 20, vit: 15, luk: 5 },
    statGrowth: { str: 4, agi: 1, int: 3, vit: 1, luk: 1 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_cure_atk', // 치유 속성 공격력 증가
    activeSkill: 'active_cure_smite'  // 정화의 일격
  },
  
  'knight_cure_gwin': {
    id: 'knight_cure_gwin',
    name: 'Gwin',
    title: 'Knight of Cure',
    attribute: 'cure',
    rarity: 'rare',
    image: '/knights/plague/knight-gwin-profile.webp',
    fullImage: '/knights/plague/knight-gwin.webp',   
    description: '함멜의 제2기사단인 큐오브릭의 단장.',
    cost: { itemId: 'con_soul_6', count: 10, gold: 5000 },
    baseStats: { str: 20, agi: 20, int: 20, vit: 15, luk: 5 },
    statGrowth: { str: 4, agi: 4, int: 5, vit: 1, luk: 1 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_cure_crit', // 치명타 타격 시 아군 회복
    activeSkill: 'active_cure_slash'   // 생명력 흡수 베기
  },
  
  'knight_cure_dodinel': {
    id: 'knight_cure_dodinel',
    name: 'Dodinel',
    title: 'Knight of Cure',
    attribute: 'cure',
    rarity: 'rare',
    image: '/knights/plague/knight-dodinel-profile.webp',
    fullImage: '/knights/plague/knight-dodinel.webp',   
    description: '신성제국 함멜의 성녀.',
    cost: { itemId: 'con_soul_6', count: 10, gold: 5000 },
    baseStats: { str: 10, agi: 20, int: 30, vit: 15, luk: 5 },
    statGrowth: { str: 2, agi: 3, int: 5, vit: 2, luk: 3 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_cure_evade', // 회피 시 마나 회복
    activeSkill: 'active_cure_purify'   // 정화 (보스 버프 제거 & 피해)
  },
  
  // ========================================================
  // 🌌 공허의 기사단 (Vain)
  // ========================================================
  'knight_vain_owain': {
    id: 'knight_vain_owain',
    name: 'Owain',
    title: 'Knight of vain',
    attribute: 'vain',
    rarity: 'rare',
    image: '/knights/vain/knight-owain-profile.webp',
    fullImage: '/knights/vain/knight-owain.webp',   
    description: '제국 카르마스 국왕의 첫째 아들, 공허의 던전을 정화하는 임무를 맡고있다.',
    cost: { itemId: 'con_soul_7', count: 5, gold: 5000 },
    baseStats: { str: 10, agi: 15, int: 25, vit: 10, luk: 10 },
    statGrowth: { str: 1, agi: 3, int: 3, vit: 2, luk: 1 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_vain_atk', // 공허 속성 공격력 대폭 증가
    activeSkill: 'active_vain_slash'  // 공허 가르기
  },
  
  'knight_vain_ywain': {
    id: 'knight_vain_ywain',
    name: 'Ywain',
    title: 'Knight of vain',
    attribute: 'vain',
    rarity: 'rare',
    image: '/knights/vain/knight-ywain-profile.webp',
    fullImage: '/knights/vain/knight-ywain.webp',   
    description: '제국 카르마스 국왕의 둘째 아들, 공허의 던전을 정화하는 임무를 맡고있다.',
    cost: { itemId: 'con_soul_7', count: 5, gold: 5000 },
    baseStats: { str: 10, agi: 10, int: 25, vit: 15, luk: 10 },
    statGrowth: { str: 1, agi: 1, int: 3, vit: 3, luk: 2 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_vain_def', // 피격 시 일정 확률로 데미지 무시
    activeSkill: 'active_vain_shield' // 칠흑의 장막
  },
  
  'knight_vain_yvain': {
    id: 'knight_vain_yvain',
    name: 'Yvain',
    title: 'Knight of vain',
    attribute: 'vain',
    rarity: 'rare',
    image: '/knights/vain/knight-yvain-profile.webp',
    fullImage: '/knights/vain/knight-yvain.webp',   
    description: '제국 카르마스 국왕의 막내 아들, 공허의 던전을 정화하는 임무를 맡고있다.',
    cost: { itemId: 'con_soul_7', count: 5, gold: 5000 },
    baseStats: { str: 15, agi: 10, int: 20, vit: 15, luk: 10 },
    statGrowth: { str: 2, agi: 1, int: 2, vit: 3, luk: 2 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_vain_hp', // 적 타격 시 마나 스틸
    activeSkill: 'active_vain_drain' // 영혼 흡수
  },
  
  'knight_vain_merlin': {
    id: 'knight_vain_merlin',
    name: 'Merlin',
    title: 'Knight of vain',
    attribute: 'vain',
    rarity: 'rare',
    image: '/knights/vain/knight-merlin-profile.webp',
    fullImage: '/knights/vain/knight-merlin.webp',   
    description: '악에 대항하는 비밀 결사단 크롬마스의 대현자.',
    cost: { itemId: 'con_soul_7', count: 10, gold: 5000 },
    baseStats: { str: 10, agi: 20, int: 30, vit: 10, luk: 10 },
    statGrowth: { str: 1, agi: 4, int: 5, vit: 3, luk: 2 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_vain_evade', // 보스 회피율 0으로 고정 (강력 디버프)
    activeSkill: 'active_vain_meteor'   // 공허의 운석 (초대형 마법)
  },
  
  'knight_vain_aglovale': {
    id: 'knight_vain_aglovale',
    name: 'Aglovale',
    title: 'Knight of vain',
    attribute: 'vain',
    rarity: 'rare',
    image: '/knights/vain/knight-aglovale-profile.webp',
    fullImage: '/knights/vain/knight-aglovale.webp',   
    description: '악에 대항하는 비밀 결사단 크롬마스의 대현자.',
    cost: { itemId: 'con_soul_7', count: 10, gold: 5000 },
    baseStats: { str: 10, agi: 20, int: 30, vit: 10, luk: 10 },
    statGrowth: { str: 1, agi: 5, int: 6, vit: 1, luk: 2 },
    // ✨ 스킬 세팅
    passiveSkill: 'passive_vain_crit', // 크리티컬 배율 증가
    activeSkill: 'active_vain_pierce'  // 어둠의 창 (방어 관통)
  }
};
