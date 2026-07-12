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
          rareDropsToRoll.push({ id: 'con_soul_1', chance: 0.20 });
          break;
        case 'Normal':
          exp = 50;
          gold = 200;
          droppedItems['mat_fire_1'] = getRandomCount(0, 2); 
          droppedItems['mat_fire_2'] = getRandomCount(1, 2); 
          droppedItems['potion_exp_fire_small'] = getRandomCount(0, 2);
          droppedItems['potion_exp_fire_medium'] = getRandomCount(0, 1);
          break;
        case 'Hard':
          exp = 150;
          gold = 500;
          droppedItems['mat_fire_1'] = getRandomCount(0, 2);
          droppedItems['mat_fire_2'] = getRandomCount(0, 2);
          droppedItems['potion_exp_fire_small'] = getRandomCount(0, 2);
          droppedItems['potion_exp_fire_medium'] = getRandomCount(0, 2);
          droppedItems['mat_fire_3'] = 1;
          break;
        case 'Expert':
          exp = 300;
          gold = 800;
          droppedItems['mat_fire_2'] = getRandomCount(0, 2);
          droppedItems['mat_fire_3'] = getRandomCount(0, 2);
          droppedItems['potion_exp_fire_medium'] = getRandomCount(0, 3);
          droppedItems['potion_exp_fire_large'] = getRandomCount(0, 2);
          droppedItems['mat_fire_4'] = 1;
          break;
        case 'Hell':
          exp = 1000;
          gold = 1500;
          droppedItems['mat_fire_2'] = getRandomCount(0, 2);
          droppedItems['mat_fire_3'] = getRandomCount(0, 2);
          droppedItems['mat_fire_4'] = getRandomCount(1, 2);
          droppedItems['mat_fire_5'] = 1; 
          droppedItems['potion_exp_fire_medium'] = getRandomCount(0, 3);
          droppedItems['potion_exp_fire_large'] = getRandomCount(0, 3);
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
          droppedItems['mat_fire_1'] = getRandomCount(1, 2);
          droppedItems['potion_exp_water_small'] = getRandomCount(0, 2);
          rareDropsToRoll.push({ id: 'con_soul_2', chance: 0.20 });
          break;
        case 'Normal':
          exp = 50;
          gold = 200;
          droppedItems['mat_water_1'] = getRandomCount(0, 2); 
          droppedItems['mat_water_2'] = getRandomCount(1, 2); 
          droppedItems['potion_exp_water_small'] = getRandomCount(0, 2);
          droppedItems['potion_exp_water_medium'] = getRandomCount(0, 1);
          break;
        case 'Hard':
          exp = 150;
          gold = 500;
          droppedItems['mat_water_1'] = getRandomCount(0, 2);
          droppedItems['mat_water_2'] = getRandomCount(0, 2);
          droppedItems['potion_exp_water_small'] = getRandomCount(0, 2);
          droppedItems['potion_exp_water_medium'] = getRandomCount(0, 2);
          droppedItems['mat_water_3'] = 1;
          break;
        case 'Expert':
          exp = 300;
          gold = 800;
          droppedItems['mat_water_2'] = getRandomCount(0, 2);
          droppedItems['mat_water_3'] = getRandomCount(0, 2);
          droppedItems['potion_exp_water_medium'] = getRandomCount(0, 3);
          droppedItems['potion_exp_water_large'] = getRandomCount(0, 2);
          droppedItems['mat_water_4'] = 1;
          break;
        case 'Hell':
          exp = 1000;
          gold = 1500;
          droppedItems['mat_water_2'] = getRandomCount(0, 2);
          droppedItems['mat_water_3'] = getRandomCount(0, 2);
          droppedItems['mat_water_4'] = getRandomCount(1, 2);
          droppedItems['mat_water_5'] = 1; 
          droppedItems['potion_exp_water_medium'] = getRandomCount(0, 3);
          droppedItems['potion_exp_water_large'] = getRandomCount(0, 3);
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

  // ==========================================
  // 🔵 3. 독의 던전 (Hell of poison)
  // ==========================================
  else if (dungeonLower.includes('poison')) {
    
    // ✨ 물의 던전 [승리] 시 보상
    if (isWin) {
      let rareDropsToRoll = []; 

      switch (difficulty) {
        case 'Easy':
          exp = 20;
          gold = 100;
          droppedItems['mat_poison_1'] = getRandomCount(1, 2);
          droppedItems['potion_exp_poison_small'] = getRandomCount(0, 2);
          rareDropsToRoll.push({ id: 'con_soul_3', chance: 0.20 });
          break;
        case 'Normal':
          exp = 50;
          gold = 200;
          droppedItems['mat_poison_1'] = getRandomCount(0, 2); 
          droppedItems['mat_poison_2'] = getRandomCount(1, 2); 
          droppedItems['potion_exp_poison_small'] = getRandomCount(0, 2);
          droppedItems['potion_exp_poison_medium'] = getRandomCount(0, 1);
          break;
        case 'Hard':
          exp = 150;
          gold = 500;
          droppedItems['mat_poison_1'] = getRandomCount(0, 2);
          droppedItems['mat_poison_2'] = getRandomCount(0, 2);
          droppedItems['potion_exp_poison_small'] = getRandomCount(0, 2);
          droppedItems['potion_exp_poison_medium'] = getRandomCount(0, 2);
          droppedItems['mat_poison_3'] = 1;
          break;
        case 'Expert':
          exp = 300;
          gold = 800;
          droppedItems['mat_poison_2'] = getRandomCount(0, 2);
          droppedItems['mat_poison_3'] = getRandomCount(0, 2);
          droppedItems['potion_exp_poison_medium'] = getRandomCount(0, 3);
          droppedItems['potion_exp_poison_large'] = getRandomCount(0, 2);
          droppedItems['mat_poison_4'] = 1;
          break;
        case 'Hell':
          exp = 1000;
          gold = 1500;
          droppedItems['mat_poison_2'] = getRandomCount(0, 2);
          droppedItems['mat_poison_3'] = getRandomCount(0, 2);
          droppedItems['mat_poison_4'] = getRandomCount(1, 2);
          droppedItems['mat_poison_5'] = 1; 
          droppedItems['potion_exp_poison_medium'] = getRandomCount(0, 3);
          droppedItems['potion_exp_poison_large'] = getRandomCount(0, 3);
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
    // 💀 독의 던전 [패배] 시 위로 보상
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
  // ==========================================
  // 🔵 4. 번뇌의 던전 (Hell of agony)
  // ==========================================
  else if (dungeonLower.includes('agony')) {
    
    // ✨ 번뇌의 던전 [승리] 시 보상
    if (isWin) {
      let rareDropsToRoll = []; 

      switch (difficulty) {
        case 'Easy':
          exp = 20;
          gold = 100;
          droppedItems['mat_light_1'] = getRandomCount(1, 2);
          droppedItems['potion_exp_light_small'] = getRandomCount(0, 2);
          rareDropsToRoll.push({ id: 'con_soul_4', chance: 0.20 });
          break;
        case 'Normal':
          exp = 50;
          gold = 200;
          droppedItems['mat_light_1'] = getRandomCount(0, 2); 
          droppedItems['mat_light_2'] = getRandomCount(1, 2); 
          droppedItems['potion_exp_light_small'] = getRandomCount(0, 2);
          droppedItems['potion_exp_light_medium'] = getRandomCount(0, 1);
          break;
        case 'Hard':
          exp = 150;
          gold = 500;
          droppedItems['mat_light_1'] = getRandomCount(0, 2);
          droppedItems['mat_light_2'] = getRandomCount(0, 2);
          droppedItems['potion_exp_light_small'] = getRandomCount(0, 2);
          droppedItems['potion_exp_light_medium'] = getRandomCount(0, 2);
          droppedItems['mat_light_3'] = 1;
          break;
        case 'Expert':
          exp = 300;
          gold = 800;
          droppedItems['mat_light_2'] = getRandomCount(0, 2);
          droppedItems['mat_light_3'] = getRandomCount(0, 2);
          droppedItems['potion_exp_light_medium'] = getRandomCount(0, 3);
          droppedItems['potion_exp_light_large'] = getRandomCount(0, 2);
          droppedItems['mat_light_4'] = 1;
          break;
        case 'Hell':
          exp = 1000;
          gold = 1500;
          droppedItems['mat_light_2'] = getRandomCount(0, 2);
          droppedItems['mat_light_3'] = getRandomCount(0, 2);
          droppedItems['mat_light_4'] = getRandomCount(1, 2);
          droppedItems['mat_light_5'] = 1; 
          droppedItems['potion_exp_light_medium'] = getRandomCount(0, 3);
          droppedItems['potion_exp_light_large'] = getRandomCount(0, 3);
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
    // 💀 번뇌의 던전 [패배] 시 위로 보상
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
    // ==========================================
  // 🔵 4. 혹한의 던전 (Hell of Frozen)
  // ==========================================
  else if (dungeonLower.includes('Frozen')) {
    
    // ✨ 혹한의 던전 [승리] 시 보상
    if (isWin) {
      let rareDropsToRoll = []; 

      switch (difficulty) {
        case 'Easy':
          exp = 20;
          gold = 100;
          droppedItems['mat_ice_1'] = getRandomCount(1, 2);
          droppedItems['potion_exp_ice_small'] = getRandomCount(0, 2);
          rareDropsToRoll.push({ id: 'con_soul_5', chance: 0.30 });
          break;
        case 'Normal':
          exp = 50;
          gold = 200;
          droppedItems['mat_ice_1'] = getRandomCount(0, 2); 
          droppedItems['mat_ice_2'] = getRandomCount(1, 2); 
          droppedItems['potion_exp_ice_small'] = getRandomCount(0, 2);
          droppedItems['potion_exp_ice_medium'] = getRandomCount(0, 1);
          break;
        case 'Hard':
          exp = 150;
          gold = 500;
          droppedItems['mat_ice_1'] = getRandomCount(0, 2);
          droppedItems['mat_ice_2'] = getRandomCount(0, 2);
          droppedItems['potion_exp_ice_small'] = getRandomCount(0, 2);
          droppedItems['potion_exp_ice_medium'] = getRandomCount(0, 2);
          droppedItems['mat_ice_3'] = 1;
          break;
        case 'Expert':
          exp = 300;
          gold = 800;
          droppedItems['mat_ice_2'] = getRandomCount(0, 2);
          droppedItems['mat_ice_3'] = getRandomCount(0, 2);
          droppedItems['potion_exp_ice_medium'] = getRandomCount(0, 3);
          droppedItems['potion_exp_ice_large'] = getRandomCount(0, 2);
          droppedItems['mat_ice_4'] = 1;
          break;
        case 'Hell':
          exp = 1000;
          gold = 1500;
          droppedItems['mat_ice_2'] = getRandomCount(0, 2);
          droppedItems['mat_ice_3'] = getRandomCount(0, 2);
          droppedItems['mat_ice_4'] = getRandomCount(1, 2);
          droppedItems['mat_ice_5'] = 1; 
          droppedItems['potion_exp_ice_medium'] = getRandomCount(0, 3);
          droppedItems['potion_exp_ice_large'] = getRandomCount(0, 3);
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
    // 💀 혹한의 던전 [패배] 시 위로 보상
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
