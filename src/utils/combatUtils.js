import { SKILL_DATABASE } from '../constants/skillData'; 

// 💡 속성 상성 사슬 정의
const ADVANTAGE_MAP = {
  'water': 'fire',
  'fire': 'ice',
  'ice': 'poison',
  'poison': 'cure',
  'cure': 'vain',
  'vain': 'light',
  'void': 'light',
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
  if (ADVANTAGE_MAP[attackerElement] === defenderElement) return 1.5; 
  if (DISADVANTAGE_MAP[attackerElement] === defenderElement) return 0.7; 
  return 1.0; 
};

// 2️⃣ ✨ [위치 이동됨] 속성 상성이 적용된 '찐 타격 데미지' 계산기
export const calculateEffectiveBP = (knights, bossElement) => {
  let totalEffectiveDamage = 0;
  
  knights.forEach(k => {
    if(k) {
      let myAttack = (k.str || 0) * 1.5;
      let myAtkBuffRate = 0;

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

      let finalMyAttack = myAttack * (1 + myAtkBuffRate);
      const myElement = k.attribute || k.element || 'neutral';
      const multiplier = getElementMultiplier(myElement, bossElement);

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
  return bpAnalysis; 
};

// 3️⃣ 기사 1명의 고유 전투력(CP) 계산 함수
export const calculateKnightCP = (knight) => {
  const str = knight.str || 0;
  const int = knight.int || 0;
  const agi = knight.agi || 0;
  const luk = knight.luk || 0;
  const vit = knight.vit || 0;
  const skillBonus = knight.skillBonus || 0; 
  return Math.floor((str * 1.5) + (int * 1.5) + (agi * 1.2) + (luk * 1.2) + (vit * 0.5) + skillBonus);
};

// 4️⃣ 기사단 파티 종합 스탯 (✨ bossElement 파라미터 추가!)
export const calculatePartyStats = (knights, bossElement = null) => {
  let totalVit = 0, totalAgi = 0, totalInt = 0, totalLuk = 0;
  let sumBuffedAttack = 0; 
  let sumBuffedDefense = 0; 
  let activeKnightCount = 0;

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

  // ✨ 상성을 무시한 순수 깡공격력 (스킬 데미지 계산용 원본)
  let rawBaseAttack = Math.floor(sumBuffedAttack);
  
  // ✨ 보스 속성이 주어지면, 상성이 적용된 찐 데미지를 중위값으로 덮어씌움! (모달 및 평타용)
  let baseAttackPower = rawBaseAttack;
  if (bossElement) {
    baseAttackPower = calculateEffectiveBP(knights, bossElement);
  }

  let defense = activeKnightCount > 0 ? Math.floor(sumBuffedDefense / activeKnightCount) : 0;
  let maxHp = totalVit * 10;
  let maxMp = Math.floor(100 + (totalInt * 0.5));
  let mpRegen = Math.floor(20 + (totalInt * 0.1));
  let evasionRate = (totalAgi / (totalAgi + 1000)) * 100;
  let critRate = Math.min(70, ((totalLuk / (totalLuk + 800)) * 100));
  let critDmg = 1.5; 
  let bossDebuffs = { attack: 0, defense: 0, accuracy: 0 }; 

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
      } else if (passive.target === 'enemy' && passive.effectType === 'stat_down') {
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
    critDmg, 
    rawBaseAttack,     // ✨ 추가됨 (스킬 연산용)
    baseAttackPower,   // ✨ 모달창과 평타 연산용 (이제 스탯창 중위값과 완벽 일치!)
    bossDebuffs
  };
};

// ========================================================
// ⚔️ 레이드 전투 연산 (스킬/평타/깡딜 완벽 분리)
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
  let attackElement = 'neutral';

  if (skill && skill.type === 'active') {
    if (skill.element) attackElement = skill.element;

    if (skill.flatDamage) {
      const min = Math.floor(skill.flatDamage * 0.9);
      const max = Math.floor(skill.flatDamage * 1.1);
      atkPower = getRandomAttackPower(min, max);
    } else {
      // ✨ [스킬] 스킬 자체의 속성을 쓰기 때문에, 상성이 안 발라진 '순수 깡공격력(rawBaseAttack)'을 씁니다.
      const baseAtk = attacker.rawBaseAttack || attacker.baseAttackPower || 0;
      const min = Math.floor(baseAtk * 0.9);
      const max = Math.floor(baseAtk * 1.1);
      atkPower = getRandomAttackPower(min, max);
      if (skill.power) atkPower = Math.floor(atkPower * skill.power);
    }
  } else {
    // ✨ [평타] 모달창과 일치하는, 보스 속성이 이미 반영된 공격력(baseAttackPower)을 그대로 씁니다.
    if (attacker.minAtk !== undefined && attacker.maxAtk !== undefined) {
      atkPower = getRandomAttackPower(attacker.minAtk, attacker.maxAtk);
    } else {
      const baseAtk = attacker.baseAttackPower || 0;
      const min = Math.floor(baseAtk * 0.9);
      const max = Math.floor(baseAtk * 1.1);
      atkPower = getRandomAttackPower(min, max);
    }
  }

  // ✨ 속성 상성 적용 (평타는 이미 계산되어 attackElement가 neutral이므로 스킵, 스킬일 때만 발동!)
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
