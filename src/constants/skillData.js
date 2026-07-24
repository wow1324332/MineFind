// src/constants/skillData.js

export const SKILL_DATABASE = {
  // ==========================================
  // 🛡️ [패시브 스킬] 
  // 기사가 파티에 있으면 자동 적용되는 스킬
  // ==========================================
  
  'passive_fire_protect': {
    id: 'passive_fire_protect',
    name: '화염의 가호',
    type: 'passive',
    icon: '/skills/passive_fire_protect.webp',
    description: '기사단 전체의 불속성 방어력을 5% 상승시킵니다.',
    target: 'ally',           // 적용 대상: 아군(ally) 또는 적(enemy)
    effectType: 'element_resist', // 효과 종류: 속성 저항
    element: 'fire',          // 관련 속성
    value: 0.05               // 5% 상승
  },
  
  'passive_water_aura': {
    id: 'passive_water_aura',
    name: '물의 오라',
    type: 'passive',
    icon: '/skills/passive_water_aura.webp',
    description: '기사단 전체의 최대 HP가 10% 증가합니다.',
    target: 'ally',
    effectType: 'stat_up',
    stat: 'maxHp',
    value: 0.10
  },

  'passive_fear': {
    id: 'passive_fear',
    name: '공포의 시선',
    type: 'passive',
    icon: '/skills/passive_fear.webp',
    description: '전투 진입 시 보스의 방어력을 5% 감소시킵니다.',
    target: 'enemy',
    effectType: 'stat_down',
    stat: 'defense',
    value: 0.05
  },

  // ==========================================
  // ⚔️ [액티브 스킬] 
  // 전투 중 유저가 클릭하여 MP를 소모하고 턴을 사용하는 스킬
  // ==========================================

  'active_flame_slash': {
    id: 'active_flame_slash',
    name: '화염 베기',
    type: 'active',
    subType: 'attack',        // 단일 공격기
    icon: '/skills/active_flame_slash.webp',
    description: '적에게 150%의 화염 속성 피해를 입힙니다.',
    mpCost: 30,
    element: 'fire',
    power: 1.5                // 기본 데미지의 1.5배
  },

  'active_poison_cloud': {
    id: 'active_poison_cloud',
    name: '맹독 구름',
    type: 'active',
    subType: 'dot',           // 지속 피해(DoT)
    icon: '/skills/active_poison_cloud.webp',
    description: '적에게 3턴 동안 매 턴 공격력의 30% 독 피해를 입힙니다.',
    mpCost: 40,
    element: 'poison',
    power: 0.3,
    duration: 3               // 지속 턴 수
  },

  'active_holy_shield': {
    id: 'active_holy_shield',
    name: '신성한 방패',
    type: 'active',
    subType: 'buff',          // 버프기
    icon: '/skills/active_holy_shield.webp',
    description: '3턴 동안 아군 전체의 방어력이 30% 상승합니다.',
    mpCost: 50,
    element: 'light',
    stat: 'defense',
    power: 0.3,
    duration: 3
  },

  'active_shadow_step': {
    id: 'active_shadow_step',
    name: '그림자 밟기',
    type: 'active',
    subType: 'evade',         // 회피기
    icon: '/skills/active_shadow_step.webp',
    description: '이번 턴 보스의 공격을 100% 확률로 회피합니다.',
    mpCost: 25,
    element: 'vain',
    duration: 1               // 이번 턴 한정
  }
};
