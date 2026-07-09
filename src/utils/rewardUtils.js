// src/utils/rewardUtils.js

// 💡 보조 함수: 최소(min) ~ 최대(max) 사이에서 랜덤하게 개수를 뽑아주는 함수
const getRandomCount = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 던전 클리어/실패 시 지급할 경험치(exp), 골드와 전리품을 계산하는 함수 (승리/패배 세분화)
 */
export const calculateDungeonRewards = (dungeonName, difficulty, isWin) => {
  let exp = 0; 
  let gold = 0;
  const droppedItems = {};

  const dungeonLower = dungeonName.toLowerCase();

  // ==========================================
  // 🔴 1. 불의 던전 (Hell of flame)
  // ==========================================
  if (dungeonLower.includes('flame')) {
    
    // ✨ 불의 던전 [승리] 시 보상
    if (isWin) {
      // 💡 이 난이도에서 굴릴 희귀 아이템 주사위 목록을 담을 배열
      let rareDropsToRoll = []; 

      switch (difficulty) {
        case 'Easy':
          exp = 20;
          gold = 100;
          droppedItems['mat_fire_1'] = getRandomCount(1, 2);
          droppedItems['potion_exp_fire_small'] = getRandomCount(0, 2);
          // 🔥 Easy 전용 레어 드랍 세팅 (예: 2% 확률)
          rareDropsToRoll.push({ id: 'con_soul_1', chance: 0.10 });
          break;
        case 'Normal':
          exp = 50;
          gold = 200;
          droppedItems['mat_fire_1'] = getRandomCount(0, 2); 
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

      // 💡 설정된 주사위 목록(rareDropsToRoll)을 하나씩 꺼내서 굴립니다.
      rareDropsToRoll.forEach(drop => {
        if (Math.random() < drop.chance) {
          droppedItems[drop.id] = (droppedItems[drop.id] || 0) + 1;
        }
      });

    } 
    // 💀 불의 던전 [패배] 시 위로 보상
    else {
      switch (difficulty) {
        case 'Easy': exp = 10; gold = 50; break;
        case 'Normal': exp = 10; gold = 100; break;
        case 'Hard': exp = 10; gold = 100; break;
        case 'Expert': exp = 10; gold = 200; break;
        case 'Hell': exp = 10; gold = 200; break;
        default: exp = 5; gold = 10;
      }
    }
  } 
  
  // ==========================================
  // 🔵 2. 물의 던전 (Hell of aqua)
  // ==========================================
  else if (dungeonLower.includes('aqua')) {
    
    // ✨ 물의 던전 [승리] 시 보상
    if (isWin) {
      let rareDropsToRoll = []; 

      switch (difficulty) {
        case 'Easy':
          exp = 20;
          gold = 100;
          droppedItems['mat_water_1'] = getRandomCount(1, 2);
          break;
        case 'Normal':
          exp = 50;
          gold = 200;
          droppedItems['mat_water_1'] = getRandomCount(0, 2);
          droppedItems['mat_water_2'] = getRandomCount(1, 2);
          break;
        case 'Hard':
          exp = 150;
          gold = 500;
          droppedItems['mat_water_1'] = getRandomCount(0, 2);
          droppedItems['mat_water_2'] = getRandomCount(0, 2);
          droppedItems['mat_water_3'] = 1;
          break;
        case 'Expert':
          exp = 300;
          gold = 800;
          droppedItems['mat_water_2'] = getRandomCount(0, 2);
          droppedItems['mat_water_3'] = getRandomCount(0, 2);
          droppedItems['mat_water_4'] = 1;
          break;
        case 'Hell':
          exp = 1000;
          gold = 1500;
          droppedItems['mat_water_2'] = getRandomCount(0, 2);
          droppedItems['mat_water_3'] = getRandomCount(0, 2);
          droppedItems['mat_water_4'] = getRandomCount(1, 2); 
          droppedItems['mat_water_5'] = 1;
          break;
        default:
          exp = 30;
          gold = 50;
      }

      // 💡 설정된 주사위 목록(rareDropsToRoll)을 하나씩 꺼내서 굴립니다.
      rareDropsToRoll.forEach(drop => {
        if (Math.random() < drop.chance) {
          droppedItems[drop.id] = (droppedItems[drop.id] || 0) + 1;
        }
      });

    }
    // 💀 물의 던전 [패배] 시 위로 보상
    else {
      switch (difficulty) {
        case 'Easy': exp = 10; gold = 10; break;
        case 'Normal': exp = 10; gold = 50; break;
        case 'Hard': exp = 10; gold = 50; break;
        case 'Expert': exp = 10; gold = 100; break;
        case 'Hell': exp = 10; gold = 100; break;
        default: exp = 5; gold = 10;
      }
    }
  }

  const finalItems = {};
  for (const itemId in droppedItems) {
    if (droppedItems[itemId] > 0) {
      finalItems[itemId] = droppedItems[itemId];
    }
  }

  return { exp, gold, items: finalItems };
};
