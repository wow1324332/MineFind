export const EQUIP_DATABASE = {
  // =========================================
  // ⚔️ 1. 무기 (WEAPON) - 힘(STR), 민첩(AGI) 위주
  // =========================================
  'WEAPON': {
    // 💡 1강화 당 상승하는 스탯
    enhanceGrowth: { str: 2, agi: 1, int: 0, vit: 0, luk: 0 }, 
    
    evolutions: {
      // [티어 0] 무속성 (디폴트)
      'tier_0_neutral': {
        name: '녹슨 훈련용 검',
        image: '/equip-default-weapon.png',
        baseStat: { str: 5, agi: 2, int: 0, vit: 0, luk: 0 },
      },
      // [티어 1] 불 속성
      'tier_1_flame': {
        name: '타오르는 잉걸불 검',
        image: '/equip-weapon-flame-1.png', // 추후 이미지 파일명에 맞게 변경
        baseStat: { str: 25, agi: 5, int: 0, vit: 0, luk: 0 },
      },
      // [티어 2] 불 속성
      'tier_2_flame': {
        name: '업화의 대검',
        image: '/equip-weapon-flame-2.png',
        baseStat: { str: 55, agi: 10, int: 0, vit: 0, luk: 0 },
      },
      // [티어 1] 어둠 속성 (예시: 극단적인 공격력)
      'tier_1_dark': {
        name: '핏빛 처형인의 낫',
        image: '/equip-weapon-dark-1.png',
        baseStat: { str: 40, agi: 0, int: 0, vit: 0, luk: 0 },
      }
    }
  },

  // =========================================
  // 🪖 2. 투구 (HELMET) - 지력(INT), 체력(VIT) 위주
  // =========================================
  'HELMET': {
    enhanceGrowth: { str: 0, agi: 0, int: 2, vit: 1, luk: 0 },
    
    evolutions: {
      'tier_0_neutral': {
        name: '낡은 가죽 투구',
        image: '/equip-default-helmet.png',
        baseStat: { str: 0, agi: 0, int: 2, vit: 5, luk: 0 },
      },
      'tier_1_flame': {
        name: '광신도의 두건',
        image: '/equip-helmet-flame-1.png',
        baseStat: { str: 0, agi: 0, int: 15, vit: 15, luk: 0 },
      },
      'tier_1_freeze': {
        name: '서리매듭 관',
        image: '/equip-helmet-freeze-1.png',
        baseStat: { str: 0, agi: 0, int: 25, vit: 5, luk: 0 },
      }
    }
  },

  // =========================================
  // 🛡️ 3. 방패 (SHIELD) - 체력(VIT), 운(LUK) 위주
  // =========================================
  'SHIELD': {
    enhanceGrowth: { str: 0, agi: 0, int: 0, vit: 3, luk: 1 },
    
    evolutions: {
      'tier_0_neutral': {
        name: '금이 간 나무 방패',
        image: '/equip-default-shield.png',
        baseStat: { str: 0, agi: 0, int: 0, vit: 10, luk: 2 },
      },
      'tier_1_aqua': {
        name: '심연의 수호벽',
        image: '/equip-shield-aqua-1.png',
        baseStat: { str: 0, agi: 0, int: 0, vit: 35, luk: 5 },
      },
      'tier_1_poison': {
        name: '부패한 뼈 방패',
        image: '/equip-shield-poison-1.png',
        baseStat: { str: 0, agi: 0, int: 0, vit: 25, luk: 15 },
      }
    }
  },

  // =========================================
  // 👕 4. 갑옷 (ARMOR) - 체력(VIT), 힘(STR) 위주
  // =========================================
  'ARMOR': {
    enhanceGrowth: { str: 1, agi: 0, int: 0, vit: 4, luk: 0 },
    
    evolutions: {
      'tier_0_neutral': {
        name: '빛바랜 사슬 갑옷',
        image: '/equip-default-armor.png',
        baseStat: { str: 2, agi: 0, int: 0, vit: 15, luk: 0 },
      },
      'tier_1_dark': {
        name: '저주받은 판금 갑옷',
        image: '/equip-armor-dark-1.png',
        baseStat: { str: 15, agi: 0, int: 0, vit: 40, luk: 0 },
      },
      'tier_2_dark': {
        name: '마왕의 껍질',
        image: '/equip-armor-dark-2.png',
        baseStat: { str: 30, agi: 0, int: 0, vit: 80, luk: 0 },
      }
    }
  }
};
