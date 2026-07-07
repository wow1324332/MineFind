// src/utils/rewardUtils.js

// 💡 보조 함수: 최소(min) ~ 최대(max) 사이에서 랜덤하게 개수를 뽑아주는 함수
const getRandomCount = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 던전 클리어/실패 시 지급할 경험치(exp), 골드와 전리품을 계산하는 함수 (승리/패배 세분화)
 */
export const calculateDungeonRewards = (dungeonName, difficulty, isWin) => {
  let exp = 0; // 💡 경험치 변수 추가!
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
          exp = 20;
          gold = 100;
          droppedItems['mat_fire_1'] = getRandomCount(1, 2); 
          break;
        case 'Normal':
          exp = 50;
          gold = 200;
          droppedItems['mat_fire_1'] = getRandomCount(0, 2); // 💡 (0,1,2) -> (0,2)로 수정됨
          droppedItems['mat_fire_2'] = getRandomCount(1, 2); 
          break;
        case 'Hard':
          exp = 150;
          gold = 500;
          droppedItems['mat_fire_1'] = getRandomCount(0, 2);
          droppedItems['mat_fire_2'] = getRandomCount(0, 2);
          droppedItems['mat_fire_3'] = 1;
          break;
        case 'Expert':
          exp = 300;
          gold = 800;
          droppedItems['mat_fire_2'] = getRandomCount(0, 2);
          droppedItems['mat_fire_3'] = getRandomCount(0, 2);
          droppedItems['mat_fire_4'] = 1;
          break;
        case 'Hell':
          exp = 1000;
          gold = 1500;
          droppedItems['mat_fire_2'] = getRandomCount(0, 2);
          droppedItems['mat_fire_3'] = getRandomCount(0, 2);
          droppedItems['mat_fire_4'] = getRandomCount(1, 2);
          droppedItems['mat_fire_5'] = 1; 
          break;
        default:
          exp = 30;
          gold = 50;
      }
    } 
    // 💀 불의 던전 [패배] 시 위로 보상
    else {
      switch (difficulty) {
        case 'Easy':
          exp = 10;
          gold = 50; // 골드만 지급
          break;
        case 'Normal':
          exp = 10;
          gold = 80;
          break;
        case 'Hard':
          exp = 10;
          gold = 100;
          break;
        case 'Expert':
          exp = 10;
          gold = 200;
          break;
        case 'Hell':
          exp = 10;
          gold = 200;
          break;
        default:
          exp = 5;
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
          exp = 50;
          gold = 100;
          droppedItems['mat_water_1'] = getRandomCount(1, 2);
          break;
        case 'Normal':
          exp = 150;
          gold = 200;
          droppedItems['mat_water_1'] = getRandomCount(1, 2);
          droppedItems['mat_water_2'] = 1;
          break;
        case 'Hard':
          exp = 400;
          gold = 400;
          droppedItems['mat_water_2'] = getRandomCount(2, 3);
          droppedItems['mat_water_3'] = 1;
          break;
        case 'Expert':
          exp = 1000;
          gold = 800;
          droppedItems['mat_water_3'] = getRandomCount(1, 2);
          droppedItems['mat_water_4'] = 1;
          droppedItems['con_key_1'] = 1;
          break;
        case 'Hell':
          exp = 3000;
          gold = 2000;
          droppedItems['mat_water_4'] = getRandomCount(2, 3);
          droppedItems['mat_water_5'] = 1;
          droppedItems['con_key_1'] = getRandomCount(1, 2);
          break;
        default:
          exp = 30;
          gold = 50;
      }
    }
    // 💀 물의 던전 [패배] 시 위로 보상
    else {
      switch (difficulty) {
        case 'Easy':
          exp = 10;
          gold = 10;
          break;
        case 'Normal':
          exp = 30;
          gold = 30;
          droppedItems['mat_water_1'] = 1;
          break;
        case 'Hard':
          exp = 80;
          gold = 50;
          droppedItems['mat_water_1'] = 1;
          droppedItems['con_potion_1'] = 1;
          break;
        case 'Expert':
          exp = 200;
          gold = 100;
          droppedItems['mat_water_2'] = 1;
          droppedItems['con_potion_1'] = getRandomCount(1, 2);
          break;
        case 'Hell':
          exp = 500;
          gold = 300;
          droppedItems['mat_water_3'] = 1;
          break;
        default:
          exp = 5;
          gold = 10;
      }
    }
  }

  const finalItems = {};
  for (const itemId in droppedItems) {
    if (droppedItems[itemId] > 0) {
      finalItems[itemId] = droppedItems[itemId];
    }
  }

  // 💡 리턴 객체에 exp 추가!
  return { exp, gold, items: finalItems };
};
