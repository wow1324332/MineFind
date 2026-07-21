// 💡 속성 상성 사슬 정의
// 물 > 불 > 얼음 > 독 > 치유(역병) > 공허 > 빛 > 물
const ADVANTAGE_MAP = {
  'water': 'fire',
  'fire': 'ice',
  'ice': 'poison',
  'poison': 'cure',
  'cure': 'vain',
  'void': 'light',
  'light': 'water'
};

const DISADVANTAGE_MAP = {
  'fire': 'water',
  'ice': 'fire',
  'poison': 'ice',
  'cure': 'poison',
  'void': 'cure',
  'light': 'vain',
  'water': 'light'
};

// 1️⃣ 속성 배율 계산 함수
export const getElementMultiplier = (attackerElement, defenderElement) => {
  if (!attackerElement || !defenderElement) return 1.0; // 속성이 없으면 기본 데미지
  
  if (ADVANTAGE_MAP[attackerElement] === defenderElement) return 1.5; // 유리함: 150% 데미지
  if (DISADVANTAGE_MAP[attackerElement] === defenderElement) return 0.7; // 불리함: 70% 데미지
  
  return 1.0; // 그 외 중립: 100% 데미지
};

// 2️⃣ 기사 1명의 고유 전투력(CP) 계산 함수 (랭킹/표시용)
export const calculateKnightCP = (knight) => {
  const str = knight.str || 0;
  const int = knight.int || 0;
  const agi = knight.agi || 0;
  const luk = knight.luk || 0;
  const vit = knight.vit || 0;
  const skillBonus = knight.skillBonus || 0; // 스킬 등급에 따른 고정 추가 점수

  // 💡 기획에 맞춘 가중치 적용: 공격 직결 스탯(힘, 지능) 높게, 체력은 낮게
  return Math.floor((str * 1.5) + (int * 1.5) + (agi * 1.2) + (luk * 1.2) + (vit * 0.5) + skillBonus);
};

// 3️⃣ 기사단 6인 파티의 종합 스탯(HP, MP, 방어력, 회피, 크리) 연산 함수
export const calculatePartyStats = (knights) => {
  let totalStr = 0, totalAgi = 0, totalInt = 0, totalVit = 0, totalLuk = 0;

  knights.forEach(k => {
    totalStr += k.str || 0;
    totalAgi += k.agi || 0;
    totalInt += k.int || 0;
    totalVit += k.vit || 0;
    totalLuk += k.luk || 0;
  });

  // 💡 기획안 공식 완벽 적용
  const maxHp = totalVit * 10; // 체력(VIT) 기반 기사단 총 HP 게이지
  const maxMp = Math.floor(100 + (totalInt * 0.5)); // 지능(INT) 기반 최대 마나통
  const mpRegen = Math.floor(20 + (totalInt * 0.1)); // 턴당 마나 회복량
  
  const defense = Math.floor(totalAgi * 0.5); // 민첩(AGI) 기반 기초 방어력 (향후 장비 수치 추가 가능)
  
  // 💡 인플레이션 방지용 점감 공식 적용 (회피는 최대 50% 근처, 크리는 70% 캡)
  const evasionRate = ((totalAgi / (totalAgi + 1000)) * 100).toFixed(1);
  const critRate = Math.min(70, ((totalLuk / (totalLuk + 800)) * 100)).toFixed(1);

  // 기본 총공격력 (순수 힘 기반)
  const baseAttackPower = Math.floor(totalStr * 1.5);

  return {
    totalStr, totalAgi, totalInt, totalVit, totalLuk,
    maxHp, maxMp, mpRegen, defense,
    evasionRate: Number(evasionRate), 
    critRate: Number(critRate),
    baseAttackPower
  };
};

// 4️⃣ 핵심! 특정 보스 속성을 상대할 때의 '실효 타격력(BP)' 계산 함수
export const calculateEffectiveBP = (knights, bossElement) => {
  let totalEffectiveDamage = 0;

  knights.forEach(knight => {
    const knightBaseAtk = (knight.str || 0) * 1.5; // 기사 1명의 순수 타격력
    const multiplier = getElementMultiplier(knight.element, bossElement);
    totalEffectiveDamage += (knightBaseAtk * multiplier);
  });

  return Math.floor(totalEffectiveDamage);
};

// 5️⃣ UI 표시용: 7가지 모든 속성 보스에 대한 기사단의 BP 리스트 반환
export const getAllElementsBP = (knights) => {
  const elements = ['water', 'fire', 'ice', 'poison', 'cure', 'void', 'light'];
  const bpAnalysis = {};

  elements.forEach(element => {
    bpAnalysis[element] = calculateEffectiveBP(knights, element);
  });

  // 예: { water: 5000, fire: 6500, light: 4200 ... } 형태로 반환됩니다.
  return bpAnalysis;
};

// ========================================================
// ⚔️ 레이드 전투 (턴제 데미지 교환) 핵심 연산 공식
// ========================================================

// 6️⃣ 명중/회피 판정 (주사위를 굴려 회피율보다 높아야 명중)
export const checkHit = (evasionRate) => {
  const roll = Math.random() * 100;
  return roll > evasionRate; 
};

// 7️⃣ 크리티컬 판정 (주사위를 굴려 크리율 이하여야 발동)
export const checkCritical = (critRate) => {
  const roll = Math.random() * 100;
  return roll <= critRate; 
};

// 8️⃣ 최소/최대 공격력 사이의 랜덤 타격력 생성
export const getRandomAttackPower = (minAtk, maxAtk) => {
  return Math.floor(Math.random() * (maxAtk - minAtk + 1)) + minAtk;
};

// 9️⃣ 방어력 % 감소 공식 (LoL, 워크래프트 등에서 쓰이는 점감 공식)
// 방어력이 높아질수록 깎아내는 %가 늘어나지만, 절대 100% 방어는 불가능하게 만듦
export const calculateDamageMitigation = (attackDamage, defense) => {
  // 방어력 100일 때 데미지 50% 감소, 방어력 300일 때 75% 감소
  const mitigationRate = defense / (defense + 100); 
  const finalDamage = attackDamage * (1 - mitigationRate);
  
  // 방어력이 아무리 높아도 최소 10%의 데미지는 무조건 들어가게 (관통 데미지)
  const minDamage = attackDamage * 0.1;
  return Math.floor(Math.max(finalDamage, minDamage));
};

// 🔟 최종 전투 턴 데미지 연산 (기사단이 때릴 때 & 보스가 때릴 때 완벽 공용)
export const calculateTurnDamage = (attacker, defender, isAttackerKnight = true) => {
  
  // 1. 회피 판정
  const isHit = checkHit(defender.evasionRate || 0);
  if (!isHit) {
    return { damage: 0, isCrit: false, isMiss: true };
  }

  // 2. 공격력 산출
  let atkPower = 0;
  if (attacker.minAtk !== undefined && attacker.maxAtk !== undefined) {
    // 보스의 경우 (minAtk ~ maxAtk 사이 랜덤)
    atkPower = getRandomAttackPower(attacker.minAtk, attacker.maxAtk);
  } else {
    // 기사단의 경우 (총공격력 baseAttackPower 기준 ±10% 변동폭 부여)
    const baseAtk = attacker.baseAttackPower || 0;
    const min = Math.floor(baseAtk * 0.9);
    const max = Math.floor(baseAtk * 1.1);
    atkPower = getRandomAttackPower(min, max);
  }

  // 3. 속성 상성 적용 (기사단이 때릴 때만 적용하거나, 원한다면 쌍방 적용)
  if (isAttackerKnight && defender.element) {
    // 기사단은 여러 명이라 속성이 섞여있으므로, combatUtils에 있던 calculateEffectiveBP를 활용해
    // 아예 처음부터 속성이 반영된 총공격력을 넘겨받는 것이 효율적입니다.
    // 여기서는 1.0(기본값)으로 처리하고 컴포넌트단에서 적용하는 것을 권장합니다.
  }

  // 4. 방어력 계산 적용 (단순 빼기가 아닌 % 방어 공식)
  let finalDamage = calculateDamageMitigation(atkPower, defender.defense || 0);

  // 5. 크리티컬 판정 및 배율 적용
  const isCrit = checkCritical(attacker.critRate || 0);
  if (isCrit) {
    const critMultiplier = attacker.critDmg || 1.5; // 보스 크리배율이 없으면 기본 1.5배
    finalDamage = Math.floor(finalDamage * critMultiplier);
  }

  return { damage: finalDamage, isCrit, isMiss: false };
};
