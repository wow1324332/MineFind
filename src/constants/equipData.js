// src/constants/equipData.js

// 🎲 1. 강화 확률 및 비용 테이블 (1강 ~ 15강)
export const ENHANCE_TABLE = {
  1:  { successRate: 100, soulCost: 1,  goldCost: 500 },
  2:  { successRate: 95,  soulCost: 2,  goldCost: 1000 },
  3:  { successRate: 90,  soulCost: 3,  goldCost: 1500 },
  4:  { successRate: 85,  soulCost: 4,  goldCost: 2000 },
  5:  { successRate: 80,  soulCost: 5,  goldCost: 3000 },
  6:  { successRate: 70,  soulCost: 7,  goldCost: 4500 },
  7:  { successRate: 60,  soulCost: 9,  goldCost: 6000 },
  8:  { successRate: 50,  soulCost: 11, goldCost: 8000 },
  9:  { successRate: 45,  soulCost: 13, goldCost: 10000 },
  10: { successRate: 40,  soulCost: 15, goldCost: 15000 }, // ✨ 진화 가능 구간
  11: { successRate: 30,  soulCost: 20, goldCost: 20000 },
  12: { successRate: 20,  soulCost: 25, goldCost: 25000 },
  13: { successRate: 15,  soulCost: 30, goldCost: 30000 },
  14: { successRate: 10,  soulCost: 40, goldCost: 40000 },
  15: { successRate: 5,   soulCost: 50, goldCost: 50000 }, // 👑 MAX
};

export const EQUIP_DATABASE = {
  // =========================================
  // ⚔️ 1. 무기 (WEAPON) - 힘(STR), 민첩(AGI) 위주
  // =========================================
  'WEAPON': {
    enhanceGrowth: { 
      tier_0: { str: 2, agi: 1, int: 0, vit: 0, luk: 0 },
      tier_1: { str: 5, agi: 2, int: 0, vit: 0, luk: 0 },
      tier_2: { str: 12, agi: 4, int: 0, vit: 0, luk: 0 },
      tier_3: { str: 25, agi: 8, int: 0, vit: 0, luk: 0 }
    },
    
    evolutions: {
      // 🪵 [티어 0] 무속성 기본
      'tier_0_neutral': {
        name: '초심자의 목검',
        image: '/equips/woodensword.webp',
        element: 'neutral',
        baseStat: { str: 3, agi: 0, int: 0, vit: 0, luk: 0 },
        desc: '볼품 없는 초보 수련 기사의 목검'
        evolutionRecipes: [
          { target: 'tier_1_fire', material: 'mat_fire_1', count: 10 },
          { target: 'tier_1_water', material: 'mat_water_1', count: 10 },
          { target: 'tier_1_poison', material: 'mat_poison_1', count: 10 },
          { target: 'tier_1_light', material: 'mat_light_1', count: 10 },
          { target: 'tier_1_ice', material: 'mat_ice_1', count: 10 },
          { target: 'tier_1_cure', material: 'mat_cure_1', count: 10 },
          { target: 'tier_1_vain', material: 'mat_vain_1', count: 10 }
        ]
      },

      // 🔥 불 속성 트리 (Fire) - 공격력 위주
      'tier_1_fire': {
        name: '타오르는 불꽃의 검',
        image: '/equips/weapon_fire_1.webp',
        element: 'fire',
        baseStat: { str: 25, agi: 5, int: 0, vit: 0, luk: 0 },
        evolutionRecipes: [{ target: 'tier_2_fire', material: 'mat_fire_2', count: 20 }]
      },
      'tier_2_fire': {
        name: '업화의 대검',
        image: '/equips/weapon_fire_2.webp',
        element: 'fire',
        baseStat: { str: 55, agi: 10, int: 0, vit: 0, luk: 0 },
        evolutionRecipes: [{ target: 'tier_3_fire', material: 'mat_fire_3', count: 5 }]
      },
      'tier_3_fire': {
        name: '단탈리온의 심장 베기',
        image: '/equips/weapon_fire_3.webp',
        element: 'fire',
        baseStat: { str: 150, agi: 30, int: 0, vit: 0, luk: 0 },
        evolutionRecipes: null
      },

      // 💧 물 속성 트리 (Water) - 민첩 밸런스
      'tier_1_water': {
        name: '푸른 해일의 검',
        image: '/equips/weapon_water_1.webp',
        element: 'water',
        baseStat: { str: 22, agi: 8, int: 0, vit: 0, luk: 0 },
        evolutionRecipes: [{ target: 'tier_2_water', material: 'mat_water_2', count: 20 }]
      },
      'tier_2_water': {
        name: '심연의 절단기',
        image: '/equips/weapon_water_2.webp',
        element: 'water',
        baseStat: { str: 50, agi: 15, int: 0, vit: 0, luk: 0 },
        evolutionRecipes: [{ target: 'tier_3_water', material: 'mat_water_3', count: 5 }]
      },
      'tier_3_water': {
        name: '바알의 대해일',
        image: '/equips/weapon_water_3.webp',
        element: 'water',
        baseStat: { str: 140, agi: 40, int: 0, vit: 0, luk: 0 },
        evolutionRecipes: null
      },

      // ☠️ 독 속성 트리 (Poison) - 운(LUK), 민첩(AGI) 암살자형
      'tier_1_poison': {
        name: '맹독의 단검',
        image: '/equips/weapon_poison_1.webp',
        element: 'poison',
        baseStat: { str: 15, agi: 15, int: 0, vit: 0, luk: 5 },
        evolutionRecipes: [{ target: 'tier_2_poison', material: 'mat_poison_2', count: 20 }]
      },
      'tier_2_poison': {
        name: '암살자의 독니',
        image: '/equips/weapon_poison_2.webp',
        element: 'poison',
        baseStat: { str: 35, agi: 35, int: 0, vit: 0, luk: 15 },
        evolutionRecipes: [{ target: 'tier_3_poison', material: 'mat_poison_3', count: 5 }]
      },
      'tier_3_poison': {
        name: '벨리알의 맹독 쐐기',
        image: '/equips/weapon_poison_3.webp',
        element: 'poison',
        baseStat: { str: 80, agi: 90, int: 0, vit: 0, luk: 40 },
        evolutionRecipes: null
      },

      // ☀️ 빛 속성 트리 (Light) - 방어/공격 밸런스
      'tier_1_light': {
        name: '성기사의 장검',
        image: '/equips/weapon_light_1.webp',
        element: 'light',
        baseStat: { str: 20, agi: 5, int: 10, vit: 0, luk: 0 },
        evolutionRecipes: [{ target: 'tier_2_light', material: 'mat_light_2', count: 20 }]
      },
      'tier_2_light': {
        name: '빛의 심판자',
        image: '/equips/weapon_light_2.webp',
        element: 'light',
        baseStat: { str: 45, agi: 10, int: 25, vit: 0, luk: 0 },
        evolutionRecipes: [{ target: 'tier_3_light', material: 'mat_light_3', count: 5 }]
      },
      'tier_3_light': {
        name: '루시퍼의 광휘',
        image: '/equips/weapon_light_3.webp',
        element: 'light',
        baseStat: { str: 120, agi: 20, int: 60, vit: 0, luk: 0 },
        evolutionRecipes: null
      },

      // ❄️ 얼음 속성 트리 (Ice) - 치명, 밸런스
      'tier_1_ice': {
        name: '서리내린 한빙검',
        image: '/equips/weapon_ice_1.webp',
        element: 'ice',
        baseStat: { str: 22, agi: 10, int: 0, vit: 0, luk: 5 },
        evolutionRecipes: [{ target: 'tier_2_ice', material: 'mat_ice_2', count: 20 }]
      },
      'tier_2_ice': {
        name: '절대영도의 칼날',
        image: '/equips/weapon_ice_2.webp',
        element: 'ice',
        baseStat: { str: 48, agi: 20, int: 0, vit: 0, luk: 15 },
        evolutionRecipes: [{ target: 'tier_3_ice', material: 'mat_ice_3', count: 5 }]
      },
      'tier_3_ice': {
        name: '아몬의 빙결검',
        image: '/equips/weapon_ice_3.webp',
        element: 'ice',
        baseStat: { str: 130, agi: 50, int: 0, vit: 0, luk: 40 },
        evolutionRecipes: null
      },

      // 🌿 치유 속성 트리 (Cure) - 지능(INT) 무기
      'tier_1_cure': {
        name: '숲의 정령 검',
        image: '/equips/weapon_cure_1.webp',
        element: 'cure',
        baseStat: { str: 10, agi: 0, int: 25, vit: 0, luk: 0 },
        evolutionRecipes: [{ target: 'tier_2_cure', material: 'mat_cure_2', count: 20 }]
      },
      'tier_2_cure': {
        name: '생명의 잎날',
        image: '/equips/weapon_cure_2.webp',
        element: 'cure',
        baseStat: { str: 20, agi: 0, int: 60, vit: 0, luk: 0 },
        evolutionRecipes: [{ target: 'tier_3_cure', material: 'mat_cure_3', count: 5 }]
      },
      'tier_3_cure': {
        name: '마르바스의 치유검',
        image: '/equips/weapon_cure_3.webp',
        element: 'cure',
        baseStat: { str: 50, agi: 0, int: 160, vit: 0, luk: 0 },
        evolutionRecipes: null
      },

      // 🌌 공허 속성 트리 (Vain) - 극 공격력
      'tier_1_vain': {
        name: '핏빛 처형인의 낫',
        image: '/equips/weapon_vain_1.webp',
        element: 'vain',
        baseStat: { str: 35, agi: 0, int: 0, vit: 0, luk: 0 },
        evolutionRecipes: [{ target: 'tier_2_vain', material: 'mat_vain_2', count: 20 }]
      },
      'tier_2_vain': {
        name: '허무의 대낫',
        image: '/equips/weapon_vain_2.webp',
        element: 'vain',
        baseStat: { str: 75, agi: 0, int: 0, vit: 0, luk: 0 },
        evolutionRecipes: [{ target: 'tier_3_vain', material: 'mat_vain_3', count: 5 }]
      },
      'tier_3_vain': {
        name: '디아블로의 절망',
        image: '/equips/weapon_vain_3.webp',
        element: 'vain',
        baseStat: { str: 200, agi: 0, int: 0, vit: 0, luk: 0 },
        evolutionRecipes: null
      }
    }
  },

  // =========================================
  // 🪖 2. 투구 (HELMET) - 지력(INT), 체력(VIT) 위주
  // =========================================
  'HELMET': {
    enhanceGrowth: { 
      tier_0: { str: 0, agi: 0, int: 2, vit: 1, luk: 0 },
      tier_1: { str: 0, agi: 0, int: 5, vit: 3, luk: 0 },
      tier_2: { str: 0, agi: 0, int: 12, vit: 6, luk: 0 },
      tier_3: { str: 0, agi: 0, int: 25, vit: 12, luk: 0 }
    },
    
    evolutions: {
      'tier_0_neutral': {
        name: '초심자의 가죽 투구',
        image: '/equips/leatherhelmet.webp',
        element: 'neutral',
        baseStat: { str: 0, agi: 0, int: 0, vit: 5, luk: 0 },
        evolutionRecipes: [
          { target: 'tier_1_fire', material: 'mat_fire_1', count: 10 },
          { target: 'tier_1_water', material: 'mat_water_1', count: 10 },
          { target: 'tier_1_poison', material: 'mat_poison_1', count: 10 },
          { target: 'tier_1_light', material: 'mat_light_1', count: 10 },
          { target: 'tier_1_ice', material: 'mat_ice_1', count: 10 },
          { target: 'tier_1_cure', material: 'mat_cure_1', count: 10 },
          { target: 'tier_1_vain', material: 'mat_vain_1', count: 10 }
        ]
      },

      'tier_1_fire': {
        name: '광신도의 두건',
        image: '/equips/helmet_fire_1.webp',
        element: 'fire',
        baseStat: { str: 0, agi: 0, int: 15, vit: 15, luk: 0 },
        evolutionRecipes: [{ target: 'tier_2_fire', material: 'mat_fire_2', count: 20 }]
      },
      'tier_2_fire': {
        name: '지옥불 왕관',
        image: '/equips/helmet_fire_2.webp',
        element: 'fire',
        baseStat: { str: 0, agi: 0, int: 35, vit: 30, luk: 0 },
        evolutionRecipes: [{ target: 'tier_3_fire', material: 'mat_fire_3', count: 5 }]
      },
      'tier_3_fire': {
        name: '메피스토의 뿔',
        image: '/equips/helmet_fire_3.webp',
        element: 'fire',
        baseStat: { str: 0, agi: 0, int: 90, vit: 75, luk: 0 },
        evolutionRecipes: null
      },

      'tier_1_water': {
        name: '해적의 반다나',
        image: '/equips/helmet_water_1.webp',
        element: 'water',
        baseStat: { str: 0, agi: 0, int: 10, vit: 20, luk: 0 },
        evolutionRecipes: [{ target: 'tier_2_water', material: 'mat_water_2', count: 20 }]
      },
      'tier_2_water': {
        name: '해신의 투구',
        image: '/equips/helmet_water_2.webp',
        element: 'water',
        baseStat: { str: 0, agi: 0, int: 25, vit: 45, luk: 0 },
        evolutionRecipes: [{ target: 'tier_3_water', material: 'mat_water_3', count: 5 }]
      },
      'tier_3_water': {
        name: '레비아탄의 응시',
        image: '/equips/helmet_water_3.webp',
        element: 'water',
        baseStat: { str: 0, agi: 0, int: 60, vit: 110, luk: 0 },
        evolutionRecipes: null
      },

      'tier_1_poison': {
        name: '도적의 마스크',
        image: '/equips/helmet_poison_1.webp',
        element: 'poison',
        baseStat: { str: 0, agi: 10, int: 10, vit: 10, luk: 5 },
        evolutionRecipes: [{ target: 'tier_2_poison', material: 'mat_poison_2', count: 20 }]
      },
      'tier_2_poison': {
        name: '맹독 숨결 복면',
        image: '/equips/helmet_poison_2.webp',
        element: 'poison',
        baseStat: { str: 0, agi: 25, int: 25, vit: 20, luk: 15 },
        evolutionRecipes: [{ target: 'tier_3_poison', material: 'mat_poison_3', count: 5 }]
      },
      'tier_3_poison': {
        name: '벨리알의 장막',
        image: '/equips/helmet_poison_3.webp',
        element: 'poison',
        baseStat: { str: 0, agi: 60, int: 60, vit: 50, luk: 35 },
        evolutionRecipes: null
      },

      'tier_1_light': {
        name: '순례자의 후드',
        image: '/equips/helmet_light_1.webp',
        element: 'light',
        baseStat: { str: 0, agi: 0, int: 20, vit: 15, luk: 0 },
        evolutionRecipes: [{ target: 'tier_2_light', material: 'mat_light_2', count: 20 }]
      },
      'tier_2_light': {
        name: '성스러운 후광',
        image: '/equips/helmet_light_2.webp',
        element: 'light',
        baseStat: { str: 0, agi: 0, int: 45, vit: 35, luk: 0 },
        evolutionRecipes: [{ target: 'tier_3_light', material: 'mat_light_3', count: 5 }]
      },
      'tier_3_light': {
        name: '루시퍼의 후광',
        image: '/equips/helmet_light_3.webp',
        element: 'light',
        baseStat: { str: 0, agi: 0, int: 110, vit: 90, luk: 0 },
        evolutionRecipes: null
      },

      'tier_1_ice': {
        name: '서리매듭 관',
        image: '/equips/helmet_ice_1.webp',
        element: 'ice',
        baseStat: { str: 0, agi: 0, int: 25, vit: 5, luk: 0 },
        evolutionRecipes: [{ target: 'tier_2_ice', material: 'mat_ice_2', count: 20 }]
      },
      'tier_2_ice': {
        name: '영구동토의 관',
        image: '/equips/helmet_ice_2.webp',
        element: 'ice',
        baseStat: { str: 0, agi: 0, int: 55, vit: 15, luk: 0 },
        evolutionRecipes: [{ target: 'tier_3_ice', material: 'mat_ice_3', count: 5 }]
      },
      'tier_3_ice': {
        name: '아몬의 서리관',
        image: '/equips/helmet_ice_3.webp',
        element: 'ice',
        baseStat: { str: 0, agi: 0, int: 130, vit: 40, luk: 0 },
        evolutionRecipes: null
      },

      'tier_1_cure': {
        name: '약초꾼의 모자',
        image: '/equips/helmet_cure_1.webp',
        element: 'cure',
        baseStat: { str: 0, agi: 0, int: 15, vit: 20, luk: 0 },
        evolutionRecipes: [{ target: 'tier_2_cure', material: 'mat_cure_2', count: 20 }]
      },
      'tier_2_cure': {
        name: '세계수의 화관',
        image: '/equips/helmet_cure_2.webp',
        element: 'cure',
        baseStat: { str: 0, agi: 0, int: 35, vit: 45, luk: 0 },
        evolutionRecipes: [{ target: 'tier_3_cure', material: 'mat_cure_3', count: 5 }]
      },
      'tier_3_cure': {
        name: '마르바스의 잎장식',
        image: '/equips/helmet_cure_3.webp',
        element: 'cure',
        baseStat: { str: 0, agi: 0, int: 90, vit: 120, luk: 0 },
        evolutionRecipes: null
      },

      'tier_1_vain': {
        name: '어둠의 가면',
        image: '/equips/helmet_vain_1.webp',
        element: 'vain',
        baseStat: { str: 0, agi: 0, int: 25, vit: 5, luk: 0 },
        evolutionRecipes: [{ target: 'tier_2_vain', material: 'mat_vain_2', count: 20 }]
      },
      'tier_2_vain': {
        name: '공허의 후드',
        image: '/equips/helmet_vain_2.webp',
        element: 'vain',
        baseStat: { str: 0, agi: 0, int: 55, vit: 10, luk: 0 },
        evolutionRecipes: [{ target: 'tier_3_vain', material: 'mat_vain_3', count: 5 }]
      },
      'tier_3_vain': {
        name: '파멸자의 얼굴',
        image: '/equips/helmet_vain_3.webp',
        element: 'vain',
        baseStat: { str: 0, agi: 0, int: 140, vit: 20, luk: 0 },
        evolutionRecipes: null
      }
    }
  },

  // =========================================
  // 🛡️ 3. 방패 (SHIELD) - 체력(VIT), 운(LUK) 위주
  // =========================================
  'SHIELD': {
    enhanceGrowth: { 
      tier_0: { str: 0, agi: 0, int: 0, vit: 3, luk: 1 },
      tier_1: { str: 0, agi: 0, int: 0, vit: 7, luk: 3 },
      tier_2: { str: 0, agi: 0, int: 0, vit: 15, luk: 6 },
      tier_3: { str: 0, agi: 0, int: 0, vit: 35, luk: 12 }
    },
    
    evolutions: {
      'tier_0_neutral': {
        name: '초심자의 나무 방패',
        image: '/equips/leathershield.webp',
        element: 'neutral',
        baseStat: { str: 0, agi: 0, int: 0, vit: 4, luk: 1 },
        evolutionRecipes: [
          { target: 'tier_1_fire', material: 'mat_fire_1', count: 10 },
          { target: 'tier_1_water', material: 'mat_water_1', count: 10 },
          { target: 'tier_1_poison', material: 'mat_poison_1', count: 10 },
          { target: 'tier_1_light', material: 'mat_light_1', count: 10 },
          { target: 'tier_1_ice', material: 'mat_ice_1', count: 10 },
          { target: 'tier_1_cure', material: 'mat_cure_1', count: 10 },
          { target: 'tier_1_vain', material: 'mat_vain_1', count: 10 }
        ]
      },

      'tier_1_fire': {
        name: '잿빛 화염 방패',
        image: '/equips/shield_fire_1.webp',
        element: 'fire',
        baseStat: { str: 0, agi: 0, int: 0, vit: 20, luk: 10 },
        evolutionRecipes: [{ target: 'tier_2_fire', material: 'mat_fire_2', count: 20 }]
      },
      'tier_2_fire': {
        name: '용암 거북의 등껍질',
        image: '/equips/shield_fire_2.webp',
        element: 'fire',
        baseStat: { str: 0, agi: 0, int: 0, vit: 45, luk: 20 },
        evolutionRecipes: [{ target: 'tier_3_fire', material: 'mat_fire_3', count: 5 }]
      },
      'tier_3_fire': {
        name: '이프리트의 비늘',
        image: '/equips/shield_fire_3.webp',
        element: 'fire',
        baseStat: { str: 0, agi: 0, int: 0, vit: 110, luk: 45 },
        evolutionRecipes: null
      },

      'tier_1_water': {
        name: '해류의 방패',
        image: '/equips/shield_water_1.webp',
        element: 'water',
        baseStat: { str: 0, agi: 0, int: 0, vit: 35, luk: 5 },
        evolutionRecipes: [{ target: 'tier_2_water', material: 'mat_water_2', count: 20 }]
      },
      'tier_2_water': {
        name: '빙하의 방벽',
        image: '/equips/shield_water_2.webp',
        element: 'water',
        baseStat: { str: 0, agi: 0, int: 0, vit: 80, luk: 10 },
        evolutionRecipes: [{ target: 'tier_3_water', material: 'mat_water_3', count: 5 }]
      },
      'tier_3_water': {
        name: '크라켄의 안식처',
        image: '/equips/shield_water_3.webp',
        element: 'water',
        baseStat: { str: 0, agi: 0, int: 0, vit: 190, luk: 25 },
        evolutionRecipes: null
      },

      'tier_1_poison': {
        name: '덩굴 가시 방패',
        image: '/equips/shield_poison_1.webp',
        element: 'poison',
        baseStat: { str: 0, agi: 0, int: 0, vit: 25, luk: 15 },
        evolutionRecipes: [{ target: 'tier_2_poison', material: 'mat_poison_2', count: 20 }]
      },
      'tier_2_poison': {
        name: '맹독 포자 방패',
        image: '/equips/shield_poison_2.webp',
        element: 'poison',
        baseStat: { str: 0, agi: 0, int: 0, vit: 55, luk: 35 },
        evolutionRecipes: [{ target: 'tier_3_poison', material: 'mat_poison_3', count: 5 }]
      },
      'tier_3_poison': {
        name: '벨리알의 독안개 방패',
        image: '/equips/shield_poison_3.webp',
        element: 'poison',
        baseStat: { str: 0, agi: 0, int: 0, vit: 130, luk: 85 },
        evolutionRecipes: null
      },

      'tier_1_light': {
        name: '태양의 방패',
        image: '/equips/shield_light_1.webp',
        element: 'light',
        baseStat: { str: 0, agi: 0, int: 0, vit: 30, luk: 10 },
        evolutionRecipes: [{ target: 'tier_2_light', material: 'mat_light_2', count: 20 }]
      },
      'tier_2_light': {
        name: '아이기스의 수호',
        image: '/equips/shield_light_2.webp',
        element: 'light',
        baseStat: { str: 0, agi: 0, int: 0, vit: 70, luk: 25 },
        evolutionRecipes: [{ target: 'tier_3_light', material: 'mat_light_3', count: 5 }]
      },
      'tier_3_light': {
        name: '루시퍼의 거울',
        image: '/equips/shield_light_3.webp',
        element: 'light',
        baseStat: { str: 0, agi: 0, int: 0, vit: 170, luk: 60 },
        evolutionRecipes: null
      },

      'tier_1_ice': {
        name: '얼음조각 방패',
        image: '/equips/shield_ice_1.webp',
        element: 'ice',
        baseStat: { str: 0, agi: 0, int: 0, vit: 40, luk: 5 },
        evolutionRecipes: [{ target: 'tier_2_ice', material: 'mat_ice_2', count: 20 }]
      },
      'tier_2_ice': {
        name: '눈보라의 수호벽',
        image: '/equips/shield_ice_2.webp',
        element: 'ice',
        baseStat: { str: 0, agi: 0, int: 0, vit: 90, luk: 10 },
        evolutionRecipes: [{ target: 'tier_3_ice', material: 'mat_ice_3', count: 5 }]
      },
      'tier_3_ice': {
        name: '아몬의 빙벽',
        image: '/equips/shield_ice_3.webp',
        element: 'ice',
        baseStat: { str: 0, agi: 0, int: 0, vit: 210, luk: 25 },
        evolutionRecipes: null
      },

      'tier_1_cure': {
        name: '자연의 방패',
        image: '/equips/shield_cure_1.webp',
        element: 'cure',
        baseStat: { str: 0, agi: 0, int: 0, vit: 35, luk: 10 },
        evolutionRecipes: [{ target: 'tier_2_cure', material: 'mat_cure_2', count: 20 }]
      },
      'tier_2_cure': {
        name: '생명의 수호목',
        image: '/equips/shield_cure_2.webp',
        element: 'cure',
        baseStat: { str: 0, agi: 0, int: 0, vit: 80, luk: 25 },
        evolutionRecipes: [{ target: 'tier_3_cure', material: 'mat_cure_3', count: 5 }]
      },
      'tier_3_cure': {
        name: '마르바스의 껍질',
        image: '/equips/shield_cure_3.webp',
        element: 'cure',
        baseStat: { str: 0, agi: 0, int: 0, vit: 190, luk: 60 },
        evolutionRecipes: null
      },

      'tier_1_vain': {
        name: '부서진 영혼의 방패',
        image: '/equips/shield_vain_1.webp',
        element: 'vain',
        baseStat: { str: 0, agi: 0, int: 0, vit: 15, luk: 20 },
        evolutionRecipes: [{ target: 'tier_2_vain', material: 'mat_vain_2', count: 20 }]
      },
      'tier_2_vain': {
        name: '허무의 결계',
        image: '/equips/shield_vain_2.webp',
        element: 'vain',
        baseStat: { str: 0, agi: 0, int: 0, vit: 35, luk: 45 },
        evolutionRecipes: [{ target: 'tier_3_vain', material: 'mat_vain_3', count: 5 }]
      },
      'tier_3_vain': {
        name: '영원의 감옥',
        image: '/equips/shield_vain_3.webp',
        element: 'vain',
        baseStat: { str: 0, agi: 0, int: 0, vit: 80, luk: 100 },
        evolutionRecipes: null
      }
    }
  },

  // =========================================
  // 👕 4. 갑옷 (ARMOR) - 체력(VIT), 힘(STR) 위주
  // =========================================
  'ARMOR': {
    enhanceGrowth: { 
      tier_0: { str: 1, agi: 0, int: 0, vit: 4, luk: 0 },
      tier_1: { str: 3, agi: 0, int: 0, vit: 9, luk: 0 },
      tier_2: { str: 7, agi: 0, int: 0, vit: 20, luk: 0 },
      tier_3: { str: 15, agi: 0, int: 0, vit: 45, luk: 0 }
    },
    
    evolutions: {
      'tier_0_neutral': {
        name: '초심자의 가죽 갑옷',
        image: '/equips/leatherarmor.webp',
        element: 'neutral',
        baseStat: { str: 0, agi: 2, int: 0, vit: 10, luk: 2 },
        evolutionRecipes: [
          { target: 'tier_1_fire', material: 'mat_fire_1', count: 10 },
          { target: 'tier_1_water', material: 'mat_water_1', count: 10 },
          { target: 'tier_1_poison', material: 'mat_poison_1', count: 10 },
          { target: 'tier_1_light', material: 'mat_light_1', count: 10 },
          { target: 'tier_1_ice', material: 'mat_ice_1', count: 10 },
          { target: 'tier_1_cure', material: 'mat_cure_1', count: 10 },
          { target: 'tier_1_vain', material: 'mat_vain_1', count: 10 }
        ]
      },

      'tier_1_fire': {
        name: '잿빛 사슬 갑옷',
        image: '/equips/armor_fire_1.webp',
        element: 'fire',
        baseStat: { str: 10, agi: 0, int: 0, vit: 30, luk: 0 },
        evolutionRecipes: [{ target: 'tier_2_fire', material: 'mat_fire_2', count: 20 }]
      },
      'tier_2_fire': {
        name: '화산암 흉갑',
        image: '/equips/armor_fire_2.webp',
        element: 'fire',
        baseStat: { str: 25, agi: 0, int: 0, vit: 70, luk: 0 },
        evolutionRecipes: [{ target: 'tier_3_fire', material: 'mat_fire_3', count: 5 }]
      },
      'tier_3_fire': {
        name: '수르트의 용암 갑주',
        image: '/equips/armor_fire_3.webp',
        element: 'fire',
        baseStat: { str: 60, agi: 0, int: 0, vit: 170, luk: 0 },
        evolutionRecipes: null
      },

      'tier_1_water': {
        name: '물안개 로브',
        image: '/equips/armor_water_1.webp',
        element: 'water',
        baseStat: { str: 5, agi: 5, int: 0, vit: 25, luk: 0 },
        evolutionRecipes: [{ target: 'tier_2_water', material: 'mat_water_2', count: 20 }]
      },
      'tier_2_water': {
        name: '산호초 비늘 갑옷',
        image: '/equips/armor_water_2.webp',
        element: 'water',
        baseStat: { str: 15, agi: 10, int: 0, vit: 60, luk: 0 },
        evolutionRecipes: [{ target: 'tier_3_water', material: 'mat_water_3', count: 5 }]
      },
      'tier_3_water': {
        name: '포세이돈의 가호',
        image: '/equips/armor_water_3.webp',
        element: 'water',
        baseStat: { str: 40, agi: 25, int: 0, vit: 140, luk: 0 },
        evolutionRecipes: null
      },

      'tier_1_poison': {
        name: '그림자 가죽 옷',
        image: '/equips/armor_poison_1.webp',
        element: 'poison',
        baseStat: { str: 5, agi: 15, int: 0, vit: 20, luk: 5 },
        evolutionRecipes: [{ target: 'tier_2_poison', material: 'mat_poison_2', count: 20 }]
      },
      'tier_2_poison': {
        name: '치명적인 독의 껍질',
        image: '/equips/armor_poison_2.webp',
        element: 'poison',
        baseStat: { str: 10, agi: 35, int: 0, vit: 45, luk: 15 },
        evolutionRecipes: [{ target: 'tier_3_poison', material: 'mat_poison_3', count: 5 }]
      },
      'tier_3_poison': {
        name: '벨리알의 맹독 수트',
        image: '/equips/armor_poison_3.webp',
        element: 'poison',
        baseStat: { str: 25, agi: 80, int: 0, vit: 100, luk: 40 },
        evolutionRecipes: null
      },

      'tier_1_light': {
        name: '백기사의 판금',
        image: '/equips/armor_light_1.webp',
        element: 'light',
        baseStat: { str: 15, agi: 0, int: 0, vit: 35, luk: 0 },
        evolutionRecipes: [{ target: 'tier_2_light', material: 'mat_light_2', count: 20 }]
      },
      'tier_2_light': {
        name: '성기사의 흉갑',
        image: '/equips/armor_light_2.webp',
        element: 'light',
        baseStat: { str: 35, agi: 0, int: 0, vit: 80, luk: 0 },
        evolutionRecipes: [{ target: 'tier_3_light', material: 'mat_light_3', count: 5 }]
      },
      'tier_3_light': {
        name: '루시퍼의 신성 갑옷',
        image: '/equips/armor_light_3.webp',
        element: 'light',
        baseStat: { str: 80, agi: 0, int: 0, vit: 180, luk: 0 },
        evolutionRecipes: null
      },

      'tier_1_ice': {
        name: '서리 맺힌 망토',
        image: '/equips/armor_ice_1.webp',
        element: 'ice',
        baseStat: { str: 5, agi: 10, int: 0, vit: 30, luk: 0 },
        evolutionRecipes: [{ target: 'tier_2_ice', material: 'mat_ice_2', count: 20 }]
      },
      'tier_2_ice': {
        name: '눈꽃의 은신처',
        image: '/equips/armor_ice_2.webp',
        element: 'ice',
        baseStat: { str: 10, agi: 25, int: 0, vit: 70, luk: 0 },
        evolutionRecipes: [{ target: 'tier_3_ice', material: 'mat_ice_3', count: 5 }]
      },
      'tier_3_ice': {
        name: '아몬의 빙설 로브',
        image: '/equips/armor_ice_3.webp',
        element: 'ice',
        baseStat: { str: 25, agi: 60, int: 0, vit: 160, luk: 0 },
        evolutionRecipes: null
      },

      'tier_1_cure': {
        name: '숲의 튜닉',
        image: '/equips/armor_cure_1.webp',
        element: 'cure',
        baseStat: { str: 0, agi: 5, int: 10, vit: 35, luk: 0 },
        evolutionRecipes: [{ target: 'tier_2_cure', material: 'mat_cure_2', count: 20 }]
      },
      'tier_2_cure': {
        name: '세계수의 로브',
        image: '/equips/armor_cure_2.webp',
        element: 'cure',
        baseStat: { str: 0, agi: 10, int: 25, vit: 80, luk: 0 },
        evolutionRecipes: [{ target: 'tier_3_cure', material: 'mat_cure_3', count: 5 }]
      },
      'tier_3_cure': {
        name: '마르바스의 치유복',
        image: '/equips/armor_cure_3.webp',
        element: 'cure',
        baseStat: { str: 0, agi: 25, int: 60, vit: 190, luk: 0 },
        evolutionRecipes: null
      },

      'tier_1_vain': {
        name: '저주받은 판금 갑옷',
        image: '/equips/armor_vain_1.webp',
        element: 'vain',
        baseStat: { str: 15, agi: 0, int: 0, vit: 40, luk: 0 },
        evolutionRecipes: [{ target: 'tier_2_vain', material: 'mat_vain_2', count: 20 }]
      },
      'tier_2_vain': {
        name: '마왕의 껍질',
        image: '/equips/armor_vain_2.webp',
        element: 'vain',
        baseStat: { str: 30, agi: 0, int: 0, vit: 80, luk: 0 },
        evolutionRecipes: [{ target: 'tier_3_vain', material: 'mat_vain_3', count: 5 }]
      },
      'tier_3_vain': {
        name: '어둠이 깃든 장속',
        image: '/equips/armor_vain_3.webp',
        element: 'vain',
        baseStat: { str: 80, agi: 0, int: 0, vit: 190, luk: 0 },
        evolutionRecipes: null
      }
    }
  }
};
