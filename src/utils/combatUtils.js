// 💡 속성 상성 사슬 정의
// 물 > 불 > 얼음 > 독 > 치유(역병) > 공허 > 빛 > 물
const ADVANTAGE_MAP = {
  'water': 'fire',
  'fire': 'ice',
  'ice': 'poison',
  'poison': 'cure',
  'cure': 'void',
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
