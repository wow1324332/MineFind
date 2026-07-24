import { SKILL_DATABASE } from '../constants/skillData'; 

// 💡 속성 상성 사슬 정의
// 물 > 불 > 얼음 > 독 > 치유(역병) > 공허 > 빛 > 물
const ADVANTAGE_MAP = {
  'water': 'fire',
  'fire': 'ice',
  'ice': 'poison',
  'poison': 'cure',
  'cure': 'vain',
  'vain': 'light',
  'void': 'light', // (혹시 모를 예전 데이터 호환용)
  'light': 'water'
};

const DISADVANTAGE_MAP = {
  'fire': 'water',
  'ice': 'fire',
  'poison': 'ice',
  'cure': 'poison',
  'vain': 'cure',
  'void': 'cure',
  'light': 'vain',
  'water': 'light'
};

// 1️⃣ 속성 배율 계산 함수
export const getElementMultiplier = (attackerElement, defenderElement) => {
  if (!attackerElement || !defenderElement || attackerElement === 'neutral') return 1.0; 
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

// 3️⃣ 기사단 6인 파티의 종합 스탯 (✨ 공격력은 깡더하기, 방어력은 평균!)
export const calculatePartyStats = (knights) => {
  let totalVit = 0, totalAgi = 0, totalInt = 0, totalLuk = 0;
  let sumBuffedAttack = 0; 
  let sumBuffedDefense = 0; 
  let activeKnightCount = 0;

  // 1. 기초 스탯 합산 및 ✨ 개별 공격/방어 버프 선계산
  knights.forEach(k => {
    if(k) {
      activeKnightCount++;
      totalVit += k.vit || 0;
      totalAgi += k.agi || 0;
      totalInt += k.int || 0;
      totalLuk += k.luk || 0;

      let myAttack = (k.str || 0) * 1.5;
      let myDefense = (k.agi || 0) * 0.5;
      
      let myAtkBuffRate = 0;
      let myDefBuffRate = 0;

      knights.forEach(buffer => {
        if (buffer && buffer.passiveSkill && SKILL_DATABASE[buffer.passiveSkill]) {
          const passive = SKILL_DATABASE[buffer.passiveSkill];
          if (passive.target === 'ally' && passive.effectType === 'stat_up') {
            const myElem = k.attribute || k.element;
            if (!passive.targetAttribute || passive.targetAttribute === myElem) {
              if (passive.stat === 'attack') myAtkBuffRate += passive.value; 
              if (passive.stat === 'defense') myDefBuffRate += passive.value; 
            }
          }
        }
      });

      sumBuffedAttack += (myAttack * (1 + myAtkBuffRate));
      sumBuffedDefense += (myDefense * (1 + myDefBuffRate));
    }
  });

  // 💡 [핵심] 공격력은 깡더하기(합산)! 방어력은 600% 철갑 방지용(평균)!
  let baseAttackPower = Math.floor(sumBuffedAttack);
  let defense = activeKnightCount > 0 ? Math.floor(sumBuffedDefense / activeKnightCount) : 0;

  // 2. 스탯(체력, 마나) 기본 공식 (단순 합산)
  let maxHp = totalVit * 10;
  let maxMp = Math.floor(100 + (totalInt * 0.5));
  let mpRegen = Math.floor(20 + (totalInt * 0.1));
  let evasionRate = (totalAgi / (totalAgi + 1000)) * 100;
  let critRate = Math.min(70, ((totalLuk / (totalLuk + 800)) * 100));
  let critDmg = 1.5; 
  let bossDebuffs = { attack: 0, defense: 0, accuracy: 0 }; 

  // 3. 깡더하기(합산) 방식의 패시브 (체력, 크리 등) 연산
  knights.forEach(k => {
    if (k && k.passiveSkill && SKILL_DATABASE[k.passiveSkill]) {
      const passive = SKILL_DATABASE[k.passiveSkill];
      
      if (passive.target === 'ally' && passive.effectType === 'stat_up') {
        const val = passive.value;
        if (passive.stat !== 'attack' && passive.stat !== 'defense') {
          if (passive.targetAttribute) {
            knights.forEach(targetKnight => {
              if (targetKnight && (targetKnight.attribute === passive.targetAttribute || targetKnight.element === passive.targetAttribute)) {
                if (passive.stat === 'maxHp') maxHp += Math.floor((targetKnight.vit * 10) * val);
              }
            });
          } else {
            switch(passive.stat) {
              case 'maxHp': maxHp = Math.floor(maxHp * (1 + val)); break; 
              case 'evasion': evasionRate += val; break; 
              case 'critRate': critRate += val; break;   
              case 'critDmg': critDmg += val; break;     
              case 'mpRegen': mpRegen += val; break;     
            }
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

  evasionRate = Math.min(50, evasionRate).toFixed(1);
  critRate = Math.min(70, critRate).toFixed(1);

  return {
    totalStr: Math.floor(sumBuffedAttack / (activeKnightCount || 1)), 
    totalAgi, totalInt, totalVit, totalLuk,
    maxHp, maxMp, mpRegen, defense,
    evasionRate: Number(evasionRate), 
    critRate: Number(critRate),
    critDmg, baseAttackPower, bossDebuffs
  };
};

// 4️⃣ ✨ UI 표시용 (속성 상성 1.5배/0.7배 부활 + 패시브 뻥튀기 반영 완벽 연산)
export const calculateEffectiveBP = (knights, bossElement) => {
  let totalEffectiveDamage = 0;
  
  knights.forEach(k => {
    if(k) {
      // 1. 순수 공격력
      let myAttack = (k.str || 0) * 1.5;
      let myAtkBuffRate = 0;

      // 2. 나한테 걸리는 패시브 싹 긁어오기
      knights.forEach(buffer => {
        if (buffer && buffer.passiveSkill && SKILL_DATABASE[buffer.passiveSkill]) {
          const passive = SKILL_DATABASE[buffer.passiveSkill];
          if (passive.target === 'ally' && passive.effectType === 'stat_up' && passive.stat === 'attack') {
            const myElem = k.attribute || k.element;
            if (!passive.targetAttribute || passive.targetAttribute === myElem) {
              myAtkBuffRate += passive.value;
            }
          }
        }
      });

      // 3. 버프 적용된 내 최종 공격력
      let finalMyAttack = myAttack * (1 + myAtkBuffRate);

      // 4. ✨ 잃어버린 속성 상성 부활! (보스 속성과 내 속성 비교)
      const myElement = k.attribute || k.element || 'neutral';
      const multiplier = getElementMultiplier(myElement, bossElement);

      // 5. 총합 데미지 통에 합산(깡더하기)
      totalEffectiveDamage += (finalMyAttack * multiplier);
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
  return bpAnalysis; // ✨ 이제 다시 불보스는 얼음속성이 1.5배 높게 예쁘게 출력됩니다!
};

// ========================================================
// ⚔️ 레이드 전투 연산 (스킬 데미지 적용)
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

export const calculateTurnDamage = (attacker, defender, isAttackerKnight = true, skill = null) => {
  let defenderEvasion = defender.evasionRate || 0;
  if (!isAttackerKnight && attacker.bossDebuffs_accuracy) {
    defenderEvasion += attacker.bossDebuffs_accuracy; 
  }

  const isHit = checkHit(defenderEvasion);
  if (!isHit) return { damage: 0, isCrit: false, isMiss: true };

  let atkPower = 0;
  if (attacker.minAtk !== undefined && attacker.maxAtk !== undefined) {
    atkPower = getRandomAttackPower(attacker.minAtk, attacker.maxAtk);
  } else {
    const baseAtk = attacker.baseAttackPower || 0;
    const min = Math.floor(baseAtk * 0.9);
    const max = Math.floor(baseAtk * 1.1);
    atkPower = getRandomAttackPower(min, max);
  }

  let skillMultiplier = 1.0;
  let attackElement = 'neutral';

  if (skill && skill.type === 'active' && skill.power) {
    skillMultiplier = skill.power; 
    if (skill.element) attackElement = skill.element;
  }
  
  atkPower = Math.floor(atkPower * skillMultiplier);

  if (isAttackerKnight && defender.element && attackElement !== 'neutral') {
    const elemMultiplier = getElementMultiplier(attackElement, defender.element);
    atkPower = Math.floor(atkPower * elemMultiplier);
  }

  let finalDamage = calculateDamageMitigation(atkPower, defender.defense || 0);

  const isCrit = checkCritical(attacker.critRate || 0);
  if (isCrit) {
    const critMultiplier = attacker.critDmg || 1.5; 
    finalDamage = Math.floor(finalDamage * critMultiplier);
  }

  return { damage: finalDamage, isCrit, isMiss: false };
};
