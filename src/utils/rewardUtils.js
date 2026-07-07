// src/utils/rewardUtils.js

// 💡 보조 함수: 최소(min) ~ 최대(max) 사이에서 랜덤하게 개수를 뽑아주는 함수
const getRandomCount = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 던전 클리어/실패 시 지급할 골드와 전리품을 계산하는 함수 (승리/패배 세분화)
 */
export const calculateDungeonRewards = (dungeonName, difficulty, isWin) => {
  let gold = 0;
  const droppedItems = {};

  const dungeonLower = dungeonName.toLowerCase();

  // ==========================================
  // 🔴 1. 불의 던전 (Hell of flame)
  // ==========================================
  if (dungeonLower.includes('flame')) {
    
    // ✨ 불의 던전 [승리] 시 보상
    if (isWin) {
      switch (difficulty) {
        case 'Easy':
          gold = 100;
          droppedItems['mat_fire_1'] = getRandomCount(1, 2); 
          break;
        case 'Normal':
          gold = 200;
          droppedItems['mat_fire_1'] = getRandomCount(1, 2);
          droppedItems['mat_fire_2'] = 1; 
          break;
        case 'Hard':
          gold = 500;
          droppedItems['mat_fire_2'] = getRandomCount(2, 3);
          droppedItems['mat_fire_3'] = 1;
          break;
        case 'Expert':
          gold = 800;
          droppedItems['mat_fire_3'] = getRandomCount(1, 2);
          droppedItems['mat_fire_4'] = 1;
          droppedItems['con_key_1'] = 1; 
          break;
        case 'Hell':
          gold = 1500;
          droppedItems['mat_fire_4'] = getRandomCount(2, 3);
          droppedItems['mat_fire_5'] = 1; 
          droppedItems['con_key_1'] = getRandomCount(1, 2);
          break;
        default:
          gold = 50;
      }
    } 
    // 💀 불의 던전 [패배] 시 위로 보상
    else {
      switch (difficulty) {
        case 'Easy':
          gold = 50; // 골드만 지급
          break;
        case 'Normal':
          gold = 80;
          droppedItems['mat_fire_1'] = 1; // 실패해도 기본 재료 1개 지급
          break;
        case 'Hard':
          gold = 100;
          droppedItems['mat_fire_1'] = 1;
          droppedItems['con_potion_1'] = 1; // 포션 지급
          break;
        case 'Expert':
          gold = 200;
          droppedItems['mat_fire_2'] = 1; // 실패해도 레어 재료 지급
          droppedItems['con_potion_1'] = getRandomCount(1, 2);
          break;
        case 'Hell':
          gold = 200;
          droppedItems['mat_fire_3'] = 1; // 헬 난이도는 실패해도 에픽 재료 지급!
          break;
        default:
          gold = 10;
      }
    }
  } 
  
  // ==========================================
  // 🔵 2. 물의 던전 (Hell of aqua)
  // ==========================================
  else if (dungeonLower.includes('aqua')) {
    
    // ✨ 물의 던전 [승리] 시 보상
    if (isWin) {
      switch (difficulty) {
        case 'Easy':
          gold = 100;
          droppedItems['mat_water_1'] = getRandomCount(1, 2);
          break;
        case 'Normal':
          gold = 200;
          droppedItems['mat_water_1'] = getRandomCount(1, 2);
          droppedItems['mat_water_2'] = 1;
          break;
        case 'Hard':
          gold = 400;
          droppedItems['mat_water_2'] = getRandomCount(2, 3);
          droppedItems['mat_water_3'] = 1;
          break;
        case 'Expert':
          gold = 800;
          droppedItems['mat_water_3'] = getRandomCount(1, 2);
          droppedItems['mat_water_4'] = 1;
          droppedItems['con_key_1'] = 1;
          break;
        case 'Hell':
          gold = 2000;
          droppedItems['mat_water_4'] = getRandomCount(2, 3);
          droppedItems['mat_water_5'] = 1;
          droppedItems['con_key_1'] = getRandomCount(1, 2);
          break;
        default:
          gold = 50;
      }
    }
    // 💀 물의 던전 [패배] 시 위로 보상
    else {
      switch (difficulty) {
        case 'Easy':
          gold = 10;
          break;
        case 'Normal':
          gold = 30;
          droppedItems['mat_water_1'] = 1;
          break;
        case 'Hard':
          gold = 50;
          droppedItems['mat_water_1'] = 1;
          droppedItems['con_potion_1'] = 1;
          break;
        case 'Expert':
          gold = 100;
          droppedItems['mat_water_2'] = 1;
          droppedItems['con_potion_1'] = getRandomCount(1, 2);
          break;
        case 'Hell':
          gold = 300;
          droppedItems['mat_water_3'] = 1;
          break;
        default:
          gold = 10;
      }
    }
  }

  return { gold, items: droppedItems };
};
