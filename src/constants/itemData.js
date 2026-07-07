// src/constants/itemData.js

export const ITEM_DATABASE = {
  // ==========================================
  // 🔥 불의 던전 (Hell of flame) 전리품
  // ==========================================
  'mat_fire_1': {
    id: 'mat_fire_1',
    type: 'material',
    name: 'flame crystal',
    icon: '/items/flamecrystal.png',
    rarity: 'common',
    desc: '불의 악마들의 피를 굳혀 만든 작은 불꽃의 기운을 담은 수정.',
    sellPrice: 100
  },
  'mat_fire_2': {
    id: 'mat_fire_2',
    type: 'material',
    name: 'high flame crystal',
    icon: '/items/highflamecrystal.png',
    rarity: 'common',
    desc: '중급 불의 악마 피를 굳혀 만든 작은 강력한 불꽃의 기운을 담은 수정.',
    sellPrice: 200
  },
  'mat_fire_3': {
    id: 'mat_fire_3',
    type: 'material',
    name: 'eye of flame devil',
    icon: '/items/eyeofflamedevil.png',
    rarity: 'rare',
    desc: '불의 악마 제3의 눈.',
    sellPrice: 350
  },
  'mat_fire_4': {
    id: 'mat_fire_4',
    type: 'material',
    name: 'core of flame',
    icon: '/items/coreofflame.png',
    rarity: 'rare',
    desc: '중급 불의 악마들의 화염의 기운을 모은 불의 정수.',
    sellPrice: 500
  },
  'mat_fire_5': {
    id: 'mat_fire_5',
    type: 'material',
    name: 'heart of mephisto',
    icon: '/items/heartofmephisto.png',
    rarity: 'rare',
    desc: '불꽃의 대악마 메피스토의 심장 파편.',
    sellPrice: 2000
  },

  // ==========================================
  // 💧 물의 던전 (Hell of aqua) 전리품
  // ==========================================
  'mat_water_1': {
    id: 'mat_water_1',
    type: 'material',
    name: 'aqua crystal',
    icon: '/items/aquacristal.png', 
    rarity: 'common',
    desc: '물의 악마의 기운을 머금고있는 작은 수정.',
    sellPrice: 100
  },
  'mat_water_2': {
    id: 'mat_water_2',
    type: 'material',
    name: 'high aqua crystal',
    icon: '/items/highaquacrystal.png',
    rarity: 'normal',
    desc: '물의 악마의 기운을 가득 머금고 있는 수정.',
    sellPrice: 200
  },
  'mat_water_3': {
    id: 'mat_water_3',
    type: 'material',
    name: 'eye of aqua devil',
    icon: '/items/eyeofaquadevil.png',
    rarity: 'rare',
    desc: '중급 심해의 악마를 처치하고 나온 물의 기운이 담긴 눈.',
    sellPrice: 350
  },
  'mat_water_4': {
    id: 'mat_water_4',
    type: 'material',
    name: 'core of aqua',
    icon: '/items/coreofaqua.png',
    rarity: 'rare',
    desc: '심해 악마들의 물의 기운을 잔뜩모은 강력한 물의 정수.',
    sellPrice: 500
  },
  'mat_water_5': {
    id: 'mat_water_5',
    type: 'material',
    name: 'lung of baal',
    icon: '/items/lungofbaal.png',
    rarity: 'rare',
    desc: '물의 대악마 바알을 처치하고 얻은 바알의 폐.',
    sellPrice: 2000
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
