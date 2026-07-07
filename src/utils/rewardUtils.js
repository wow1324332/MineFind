import { ITEM_DATABASE } from '../constants/itemData';

/**
 * 던전 클리어/실패 시 지급할 골드와 전리품을 계산하는 함수
 * @param {string} dungeonType - 'Hell of flame' 또는 'Hell of aqua'
 * @param {string} difficulty - 'Easy', 'Normal', 'Hard', 'Expert', 'Hell'
 * @param {boolean} isWin - 승리 여부
 * @returns {object} { gold: 획득골드, items: { 아이템ID: 수량 } }
 */
export const calculateDungeonRewards = (dungeonType, difficulty, isWin) => {
  let gold = 0;
  const droppedItems = {};

  // 1. 해당 던전 속성에 맞는 재料 아이템 필터링
  // dungeonType에 'flame'이 포함되면 불속성 아이템, 그 외엔 물속성 아이템
  const isFire = dungeonType.toLowerCase().includes('flame');
  const prefix = isFire ? 'mat_fire_' : 'mat_water_';

  if (!isWin) {
    // ==========================================
    // 💀 패배(실패) 시 보상: 아주 적은 골드 + 20% 확률로 커먼 재료 1개
    // ==========================================
    gold = Math.floor(Math.random() * 11) + 5; // 5 ~ 15 골드
    if (Math.random() < 0.20) {
      droppedItems[`${prefix}1`] = 1; // 작은 불씨 또는 맑은 물방울 1개
    }
    // 참가상 개념이므로 소비품 포션 1개 확정 지급
    droppedItems['con_potion_1'] = 1;
  } else {
    // ==========================================
    // ✨ 승리 시 보상: 난이도별 차등 지급
    // ==========================================
    const randomRoll = Math.random(); // 0.0 ~ 1.0 확률 주사위

    switch (difficulty) {
      case 'Easy':
        gold = Math.floor(Math.random() * 21) + 20; // 20 ~ 40 골드
        if (randomRoll < 0.50) droppedItems[`${prefix}1`] = 1; // 50% 확률 커먼
        break;

      case 'Normal':
        gold = Math.floor(Math.random() * 31) + 50; // 50 * 80 골드
        if (randomRoll < 0.70) {
          droppedItems[`${prefix}1`] = Math.floor(Math.random() * 2) + 1; // 70% 확률 커먼 1~2개
        } else if (randomRoll < 0.90) {
          droppedItems[`${prefix}2`] = 1; // 20% 확률 레어 (꺼지지 않는 불꽃 등)
        }
        break;

      case 'Hard':
        gold = Math.floor(Math.random() * 51) + 100; // 100 ~ 150 골드
        droppedItems[`${prefix}2`] = 1; // 레어 1개 확정
        if (randomRoll < 0.15) droppedItems[`${prefix}3`] = 1; // 15% 확률 에픽
        break;

      case 'Expert':
        gold = Math.floor(Math.random() * 101) + 200; // 200 ~ 300 골드
        droppedItems[`${prefix}3`] = 1; // 에픽 1개 확정
        if (randomRoll < 0.05) droppedItems[`${prefix}5`] = 1; // 5% 극악 확률 전설 (화룡의 심장 등)
        if (Math.random() < 0.30) droppedItems['con_key_1'] = 1; // 30% 확률 신비한 열쇠
        break;

      case 'Hell':
        gold = Math.floor(Math.random() * 201) + 50; // 500 ~ 700 골드 (수정됨)
        droppedItems[`${prefix}3`] = Math.floor(Math.random() * 2) + 1; // 에픽 1~2개 확정
        droppedItems[`${prefix}4`] = 1; // 악마의 코어류 에픽 확정
        if (randomRoll < 0.20) droppedItems[`${prefix}5`] = 1; // 20% 높은 확률로 전설!
        droppedItems['con_key_1'] = 1; // 신비한 열쇠 1개 확정
        break;

      default:
        gold = 30;
    }
  }

  return { gold, items: droppedItems };
};
