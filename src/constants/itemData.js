// src/constants/itemData.js

export const ITEM_DATABASE = {
  // ==========================================
  // 🔥 불의 던전 (Hell of flame) 전리품
  // ==========================================
  'mat_fire_1': {
    id: 'mat_fire_1',
    type: 'material',
    name: '작은 불씨',
    icon: '🔥', // 추후 '/items/mat_fire_1.png' 등으로 변경
    rarity: 'common',
    desc: '아주 희미하게 타오르는 작은 불씨. 기본적인 제작 재료로 쓰인다.',
    sellPrice: 10
  },
  'mat_fire_2': {
    id: 'mat_fire_2',
    type: 'material',
    name: '꺼지지 않는 불꽃',
    icon: '☄️',
    rarity: 'rare',
    desc: '바람이 불어도 절대 꺼지지 않는 신비한 불꽃.',
    sellPrice: 50
  },
  'mat_fire_3': {
    id: 'mat_fire_3',
    type: 'material',
    name: '지옥불 파편',
    icon: '🌋',
    rarity: 'epic',
    desc: '지옥의 뜨거운 열기를 그대로 품고 있는 암석 파편.',
    sellPrice: 200
  },
  'mat_fire_4': {
    id: 'mat_fire_4',
    type: 'material',
    name: '악마의 코어',
    icon: '👁️‍🗨️',
    rarity: 'epic',
    desc: '상급 악마의 심장부에서 추출한 불길한 기운의 결정체.',
    sellPrice: 800
  },
  'mat_fire_5': {
    id: 'mat_fire_5',
    type: 'material',
    name: '화룡의 심장',
    icon: '❤️‍🔥',
    rarity: 'legendary',
    desc: '전설 속 화룡의 심장. 만지면 화상을 입을 정도로 뜨겁다.',
    sellPrice: 5000
  },

  // ==========================================
  // 💧 물의 던전 (Hell of aqua) 전리품
  // ==========================================
  'mat_water_1': {
    id: 'mat_water_1',
    type: 'material',
    name: '맑은 물방울',
    icon: '💧', 
    rarity: 'common',
    desc: '마력을 머금고 있는 투명한 물방울. 차가운 기운이 감돈다.',
    sellPrice: 10
  },
  'mat_water_2': {
    id: 'mat_water_2',
    type: 'material',
    name: '심해의 결정',
    icon: '💎',
    rarity: 'rare',
    desc: '빛이 닿지 않는 깊은 바다 밑바닥에서 굳어진 아름다운 보석.',
    sellPrice: 50
  },
  'mat_water_3': {
    id: 'mat_water_3',
    type: 'material',
    name: '얼어붙은 눈물',
    icon: '❄️',
    rarity: 'epic',
    desc: '슬픔을 간직한 인어의 눈물이 극한의 추위에 얼어붙은 조각.',
    sellPrice: 200
  },
  'mat_water_4': {
    id: 'mat_water_4',
    type: 'material',
    name: '해신의 삼지창 조각',
    icon: '🔱',
    rarity: 'epic',
    desc: '바다를 지배하던 해신의 무기 파편. 강력한 수속성 마력을 뿜어낸다.',
    sellPrice: 800
  },
  'mat_water_5': {
    id: 'mat_water_5',
    type: 'material',
    name: '리바이어던의 비늘',
    icon: '🐉',
    rarity: 'legendary',
    desc: '전설의 해양 마수 리바이어던의 껍질. 절대 부서지지 않는다고 전해진다.',
    sellPrice: 5000
  },

  // ==========================================
  // 🧪 소비품 (Consumables) 및 기타 아이템
  // ==========================================
  'con_potion_1': {
    id: 'con_potion_1',
    type: 'consumable',
    name: '초보자의 포션',
    icon: '🧪',
    rarity: 'common',
    desc: '전투의 상처를 가볍게 치료해주는 빨간색 물약.',
    sellPrice: 5
  },
  'con_key_1': {
    id: 'con_key_1',
    type: 'consumable',
    name: '신비한 열쇠',
    icon: '🗝️',
    rarity: 'rare',
    desc: '숨겨진 던전의 문이나 굳게 닫힌 보물상자를 열 수 있는 황금 열쇠.',
    sellPrice: 100
  }
};

// 💡 보조 함수: 이름으로 아이템 ID 찾기 
// (기존 던전 데이터나 로직에서 '작은 불씨'라는 이름으로 ID를 찾아야 할 때 유용하게 쓰입니다)
export const getItemIdByName = (itemName) => {
  const item = Object.values(ITEM_DATABASE).find(i => i.name === itemName);
  return item ? item.id : null;
};
