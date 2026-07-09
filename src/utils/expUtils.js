// src/utils/expUtils.js

export const MAX_LEVEL = 99;

/**
 * 특정 레벨에서 다음 레벨로 가기 위해 필요한 총 경험치량 계산
 * 공식: 100 * (현재레벨 ^ 1.5) -> 레벨이 오를수록 요구량이 기하급수적으로 커짐
 */
export const getRequiredExp = (level) => {
  if (level >= MAX_LEVEL) return 0; // 만렙 달성 시 더 이상 요구치 없음
  return Math.floor(100 * Math.pow(level, 1.5));
};

/**
 * 경험치를 획득했을 때 최종 레벨과 남은 경험치를 계산해주는 함수
 */
export const processExpGain = (currentLevel, currentExp, gainedExp) => {
  let level = currentLevel || 1; // 유저의 레벨 데이터가 없으면 1렙부터 시작
  let exp = currentExp || 0;
  let hasLeveledUp = false;

  // 이미 만렙이면 경험치 획득 무시
  if (level >= MAX_LEVEL) {
    return { newLevel: MAX_LEVEL, newExp: 0, hasLeveledUp: false };
  }

  // 경험치 누적
  exp += gainedExp;
  let requiredExp = getRequiredExp(level);

  // 누적된 경험치가 요구치보다 높으면 레벨업 (한 번에 여러 레벨을 뛰어넘는 폭업도 자동 처리)
  while (exp >= requiredExp && level < MAX_LEVEL) {
    exp -= requiredExp;
    level += 1;
    hasLeveledUp = true;
    requiredExp = getRequiredExp(level);
  }

  // 계산 도중 만렙을 찍었을 경우 남은 경험치 초기화
  if (level >= MAX_LEVEL) {
    level = MAX_LEVEL;
    exp = 0;
  }

  return { newLevel: level, newExp: exp, hasLeveledUp };
};

// ==========================================
// ⚔️ 소환된 기사단 전용 레벨업 시스템 ⚔️
// ==========================================

export const KNIGHT_MAX_LEVEL = 50; // 💡 기사 만렙은 50으로 임시 설정 (기획에 따라 변경 가능)

/**
 * 소환된 기사의 특정 레벨에서 다음 레벨로 가기 위한 필요 경험치량 계산
 * 공식: 120 * (현재레벨 ^ 1.4) -> 주인공보다 살짝 크기 쉽게 설정
 */
export const getKnightRequiredExp = (level) => {
  if (level >= KNIGHT_MAX_LEVEL) return 0;
  return Math.floor(120 * Math.pow(level, 1.4));
};

/**
 * 기사가 속성 경험치 아이템을 먹었을 때 최종 레벨과 남은 경험치를 계산하는 함수
 */
export const processKnightExpGain = (currentLevel, currentExp, gainedExp) => {
  let level = currentLevel || 1; // 기사 기본 1레벨 시작
  let exp = currentExp || 0;
  let hasLeveledUp = false;

  if (level >= KNIGHT_MAX_LEVEL) {
    return { newLevel: KNIGHT_MAX_LEVEL, newExp: 0, hasLeveledUp: false };
  }

  exp += gainedExp;
  let requiredExp = getKnightRequiredExp(level);

  // 경험치 충족 시 레벨업 반복 (물약 여러 개를 먹여 폭업하는 경우 대비)
  while (exp >= requiredExp && level < KNIGHT_MAX_LEVEL) {
    exp -= requiredExp;
    level += 1;
    hasLeveledUp = true;
    requiredExp = getKnightRequiredExp(level);
  }

  if (level >= KNIGHT_MAX_LEVEL) {
    level = KNIGHT_MAX_LEVEL;
    exp = 0;
  }

  return { newLevel: level, newExp: exp, hasLeveledUp };
};
