import { SKILL_DATABASE } from '../constants/skillData'; // ✨ 올바른 경로로 수정 완료!

// 💡 속성 상성 사슬 정의
// 물 > 불 > 얼음 > 독 > 치유(역병) > 공허 > 빛 > 물
const ADVANTAGE_MAP = {
  'water': 'fire',
  'fire': 'ice',
  'ice': 'poison',
  'poison': 'cure',
  'cure': 'vain',
  'vain': 'light',
  'light': 'water'
};

const DISADVANTAGE_MAP = {
  'fire': 'water',
  'ice': 'fire',
  'poison': 'ice',
  'cure': 'poison',
  'vain': 'cure',
  'light': 'vain',
  'water': 'light'
};

// 1️⃣ 속성 배율 계산 함수
export const getElementMultiplier = (attackerElement, defenderElement) => {
  if (!attackerElement || !defenderElement) return 1.0; 
  if (ADVANTAGE_MAP[attackerElement] === defenderElement) return 1.5; // 유리함: 150% 데미지
  if (DISADVANTAGE_MAP[attackerElement] === defenderElement) return 0.7; // 불리함: 70% 데미지
  return 1.0; 
};

// 2️⃣ 기사 1명의 고유 전투력(CP) 계산 함수
export const calculateKnightCP = (knight) => {
  const str = knight.str || 0;
  const int = knight.int || 0;
  const agi = knight.agi || 0;
  const luk = knight.luk || 0;
  const vit = knight.vit || 0;
  const skillBonus = knight.skillBonus || 0; 
  return Math.floor((str * 1.5) + (int * 1.5) + (agi * 1.2) + (luk * 1.2) + (vit * 0.5) + skillBonus);
};

// 3️⃣ 기사단 6인 파티의 종합 스탯(HP, MP, 방어력 등) + ✨ 패시브 스킬 연산
export const calculatePartyStats = (knights) => {
  let totalStr = 0, totalAgi = 0, totalInt = 0, totalVit = 0, totalLuk = 0;

  // 빈자리(null) 제외하고 기초 스탯 먼저 합산
  knights.forEach(k => {
    if(k) {
      totalStr += k.str || 0;
      totalAgi += k.agi || 0;
      totalInt += k.int || 0;
      totalVit += k.vit || 0;
      totalLuk += k.luk || 0;
    }
  });

  // 기초 스탯을 바탕으로 기본 공식 적용
  let maxHp = totalVit * 10;
  let maxMp = Math.floor(100 + (totalInt * 0.5));
  let mpRegen = Math.floor(20 + (totalInt * 0.1));
  let defense = Math.floor(totalAgi * 0.5);
  let baseAttackPower = Math.floor(totalStr * 1.5);
  
  let evasionRate = (totalAgi / (totalAgi + 1000)) * 100;
  let critRate = Math.min(70, ((totalLuk / (totalLuk + 800)) * 100));
  let critDmg = 1.5; // 기본 크리티컬 데미지 배율 (150%)

  // ✨ 보스에게 걸 디버프 수집기
  let bossDebuffs = { attack: 0, defense: 0, accuracy: 0 }; 

  // ✨ 패시브 스킬 효과 일괄 덧씌우기
  knights.forEach(k => {
    if (k && k.passiveSkill && SKILL_DATABASE[k.passiveSkill]) {
      const passive = SKILL_DATABASE[k.passiveSkill];
      
      if (passive.target === 'ally' && passive.effectType === 'stat_up') {
        const val = passive.value;

        // 💡 1. 특정 속성(targetAttribute) 전용 버프일 경우
        if (passive.targetAttribute) {
          let targetBaseStat = 0;
          
          // 파티원 중 '해당 속성'을 가진 기사들만 찾아서 그들의 기초 스탯만 따로 합산
          knights.forEach(targetKnight => {
            if (targetKnight && targetKnight.attribute === passive.targetAttribute) {
              if (passive.stat === 'attack') targetBaseStat += (targetKnight.str * 1.5);
              if (passive.stat === 'maxHp') targetBaseStat += (targetKnight.vit * 10);
              if (passive.stat === 'defense') targetBaseStat += (targetKnight.agi * 0.5);
            }
          });

          // 그 기사들이 차지하는 지분만큼만 전체 파티 스탯에 더해줌
          if (passive.stat === 'attack') baseAttackPower += Math.floor(targetBaseStat * val);
          if (passive.stat === 'maxHp') maxHp += Math.floor(targetBaseStat * val);
          if (passive.stat === 'defense') defense += Math.floor(targetBaseStat * val);
        } 
        // 💡 2. 타겟 속성이 없는 '파티 전체' 버프일 경우 (기존 로직)
        else {
          switch(passive.stat) {
            case 'attack': baseAttackPower = Math.floor(baseAttackPower * (1 + val)); break; 
            case 'maxHp': maxHp = Math.floor(maxHp * (1 + val)); break; 
            case 'defense': defense = Math.floor(defense * (1 + val)); break; 
            case 'evasion': evasionRate += val; break; 
            case 'critRate': critRate += val; break;   
            case 'critDmg': critDmg += val; break;     
            case 'mpRegen': mpRegen += val; break;     
          }
        }
      } 
      else if (passive.target === 'enemy' && passive.effectType === 'stat_down') {
        if (passive.stat === 'attack') bossDebuffs.attack += passive.value;
        if (passive.stat === 'defense') bossDebuffs.defense += passive.value;
        if (passive.stat === 'accuracy') bossDebuffs.accuracy += passive.value;
      }
    }
  });

  // 최종 수치 캡(상한선) 적용
  evasionRate = Math.min(50, evasionRate).toFixed(1);
  critRate = Math.min(70, critRate).toFixed(1);

  return {
    totalStr, totalAgi, totalInt, totalVit, totalLuk,
    maxHp, maxMp, mpRegen, defense,
    evasionRate: Number(evasionRate), 
    critRate: Number(critRate),
    critDmg, // ✨ 크리 배율 추가됨
    baseAttackPower,
    bossDebuffs // ✨ 배틀 화면에서 보스 스탯을 깎기 위해 전달!
  };
};

export const calculateEffectiveBP = (knights, bossElement) => {
  let totalEffectiveDamage = 0;
  knights.forEach(knight => {
    if(knight) {
      const knightBaseAtk = (knight.str || 0) * 1.5; 
      const multiplier = getElementMultiplier(knight.attribute, bossElement);
      totalEffectiveDamage += (knightBaseAtk * multiplier);
    }
  });
  return Math.floor(totalEffectiveDamage);
};

export const getAllElementsBP = (knights) => {
  const elements = ['water', 'fire', 'ice', 'poison', 'cure', 'vain', 'light'];
  const bpAnalysis = {};
  elements.forEach(element => {
    bpAnalysis[element] = calculateEffectiveBP(knights, element);
  });
  return bpAnalysis;
};

// ========================================================
// ⚔️ 레이드 전투 연산 (✨ 스킬 데미지 추가됨)
// ========================================================

export const checkHit = (evasionRate) => {
  const roll = Math.random() * 100;
  return roll > evasionRate; 
};

export const checkCritical = (critRate) => {
  const roll = Math.random() * 100;
  return roll <= critRate; 
};

export const getRandomAttackPower = (minAtk, maxAtk) => {
  return Math.floor(Math.random() * (maxAtk - minAtk + 1)) + minAtk;
};

export const calculateDamageMitigation = (attackDamage, defense) => {
  const mitigationRate = defense / (defense + 100); 
  const finalDamage = attackDamage * (1 - mitigationRate);
  const minDamage = attackDamage * 0.1;
  return Math.floor(Math.max(finalDamage, minDamage));
};

// ✨ [수정됨] 스킬(skill) 객체를 받아서 위력을 계산합니다!
export const calculateTurnDamage = (attacker, defender, isAttackerKnight = true, skill = null) => {
  
  // 1. 회피 판정 (보스의 accuracy 감소 디버프가 있을 시 회피율 체감 처리)
  let defenderEvasion = defender.evasionRate || 0;
  if (!isAttackerKnight && attacker.bossDebuffs_accuracy) {
    defenderEvasion += attacker.bossDebuffs_accuracy; // 보스 명중률 하락 = 기사단 회피율 상승
  }

  const isHit = checkHit(defenderEvasion);
  if (!isHit) {
    return { damage: 0, isCrit: false, isMiss: true };
  }

  // 2. 공격력 산출
  let atkPower = 0;
  if (attacker.minAtk !== undefined && attacker.maxAtk !== undefined) {
    atkPower = getRandomAttackPower(attacker.minAtk, attacker.maxAtk);
  } else {
    const baseAtk = attacker.baseAttackPower || 0;
    const min = Math.floor(baseAtk * 0.9);
    const max = Math.floor(baseAtk * 1.1);
    atkPower = getRandomAttackPower(min, max);
  }

  // ✨ [추가] 액티브 스킬 사용 시 배율(power)과 속성(element) 적용
  let skillMultiplier = 1.0;
  let attackElement = 'neutral';

  if (skill && skill.type === 'active' && skill.power) {
    skillMultiplier = skill.power; // 예: 1.5배 타격
    if (skill.element) attackElement = skill.element;
  }
  
  atkPower = Math.floor(atkPower * skillMultiplier);

  // 3. 속성 상성 적용 (스킬에 속성이 달려있을 때 발동)
  if (isAttackerKnight && defender.element && attackElement !== 'neutral') {
    const elemMultiplier = getElementMultiplier(attackElement, defender.element);
    atkPower = Math.floor(atkPower * elemMultiplier);
  }

  // 4. 방어력 계산 적용 
  let finalDamage = calculateDamageMitigation(atkPower, defender.defense || 0);

  // 5. 크리티컬 판정 및 배율 적용
  const isCrit = checkCritical(attacker.critRate || 0);
  if (isCrit) {
    const critMultiplier = attacker.critDmg || 1.5; 
    finalDamage = Math.floor(finalDamage * critMultiplier);
  }

  return { damage: finalDamage, isCrit, isMiss: false };
};
