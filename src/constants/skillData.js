// src/constants/skillData.js

export const SKILL_DATABASE = {
  // ==========================================
  // 👑 주인공 스킬
  // ==========================================
  'passive_main_str': { 
    id: 'passive_main_str', name: '단장의 완력', type: 'passive', 
    icon: '/skills/passive_main_str.webp', description: '기사단 전체의 공격력이 10% 증가합니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'attack', value: 0.10 
  },
  'passive_main_vit': { 
    id: 'passive_main_vit', name: '단장의 끈기', type: 'passive', 
    icon: '/skills/passive_main_vit.webp', description: '기사단 전체의 최대 체력이 15% 증가합니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'maxHp', value: 0.15 
  },
  'passive_main_agi': { 
    id: 'passive_main_agi', name: '단장의 기민함', type: 'passive', 
    icon: '/skills/passive_main_agi.webp', description: '기사단 전체의 회피율이 5% 증가합니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'evasion', value: 5 
  },
  'active_main_strike': { 
    id: 'active_main_strike', name: '단장의 강타', type: 'active', subType: 'attack', 
    icon: '/skills/active_main_strike.webp', description: '적에게 130%의 강력한 피해를 입힙니다.', 
    mpCost: 20, element: 'neutral', power: 1.3 
  },

  // ==========================================
  // 🌋 불 속성 스킬 (Fire)
  // ==========================================
  'passive_fire_atk_1': { 
    id: 'passive_fire_atk_1', name: '피닉스의 심장', type: 'passive', 
    icon: '/skill/pheonixheart-fire-skill.webp', description: '불속성 기사의 공격력을 10% 증가시킵니다.', 
    target: 'ally', targetAttribute: 'fire', effectType: 'stat_up', stat: 'attack', value: 0.10 
  },
  'active_fire_atk_1': { 
    id: 'active_fire_atk_1', name: '불의 검편', type: 'active', subType: 'attack', 
    icon: '/skill/firesword-fire-skill.webp', description: '적에게 150%의 화염 속성 피해를 입힙니다.', 
    mpCost: 60, element: 'fire', flatDamage: 360
  },
  
  'passive_fire_crit': { 
    id: 'passive_fire_crit', name: '불타는 약점', type: 'passive', 
    icon: '/skills/passive_fire_crit.webp', description: '파티 전체의 치명타 확률을 5% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'critRate', value: 5 
  },
  'active_fire_burst': { 
    id: 'active_fire_burst', name: '화염 폭발', type: 'active', subType: 'attack', 
    icon: '/skills/active_fire_burst.webp', description: '적에게 180%의 강력한 화염 속성 피해를 입힙니다.', 
    mpCost: 40, element: 'fire', power: 1.8 
  },
  
  'passive_fire_hp': { 
    id: 'passive_fire_hp', name: '생명의 불꽃', type: 'passive', 
    icon: '/skills/passive_fire_hp.webp', description: '파티 전체의 최대 체력을 10% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'maxHp', value: 0.10 
  },
  'active_fire_storm': { 
    id: 'active_fire_storm', name: '화염 폭풍', type: 'active', subType: 'dot', 
    icon: '/skills/active_fire_storm.webp', description: '적에게 3턴 동안 매 턴 30%의 화염 지속 피해를 입힙니다.', 
    mpCost: 45, element: 'fire', power: 0.3, duration: 3 
  },
  
  'passive_fire_def': { 
    id: 'passive_fire_def', name: '화염의 가호', type: 'passive', 
    icon: '/skills/passive_fire_def.webp', description: '파티 전체의 방어력을 10% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'defense', value: 0.10 
  },
  'active_fire_shield': { 
    id: 'active_fire_shield', name: '화염 방패', type: 'active', subType: 'buff', 
    icon: '/skills/active_fire_shield.webp', description: '3턴 동안 파티 방어력이 30% 상승하는 화염 방패를 생성합니다.', 
    mpCost: 35, stat: 'defense', power: 0.3, duration: 3 
  },

  'passive_fire_resist': { 
    id: 'passive_fire_resist', name: '위압감', type: 'passive', 
    icon: '/skills/passive_fire_resist.webp', description: '전투 진입 시 보스의 공격력을 5% 감소시킵니다.', 
    target: 'enemy', effectType: 'stat_down', stat: 'attack', value: 0.05 
  },
  'active_fire_pierce': { 
    id: 'active_fire_pierce', name: '화염 찌르기', type: 'active', subType: 'attack', 
    icon: '/skills/active_fire_pierce.webp', description: '적의 장갑을 뚫고 140%의 화염 속성 피해를 입힙니다.', 
    mpCost: 35, element: 'fire', power: 1.4 
  },

  // ==========================================
  // 💧 물 속성 스킬 (Water)
  // ==========================================
  'passive_water_def': { 
    id: 'passive_water_def', name: '물의 장막', type: 'passive', 
    icon: '/skills/passive_water_def.webp', description: '파티 전체의 방어력을 10% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'defense', value: 0.10 
  },
  'active_water_shield': { 
    id: 'active_water_shield', name: '물의 방패', type: 'active', subType: 'buff', 
    icon: '/skills/active_water_shield.webp', description: '2턴 동안 파티의 회피율을 대폭(10%) 증가시킵니다.', 
    mpCost: 30, stat: 'evasion', power: 10, duration: 2 
  },

  'passive_water_hp_1': { 
    id: 'passive_water_hp_1', name: '대양의 방패', type: 'passive', 
    icon: '/skill/sheildofocean-water-skill.webp', description: '파티 전체의 최대 체력을 15% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'maxHp', value: 0.15 
  },
  'active_water_heal': { 
    id: 'active_water_heal', name: '치유의 물결', type: 'active', subType: 'heal', 
    icon: '/skills/active_water_heal.webp', description: '파티 전체의 체력을 공격력의 30%만큼 회복시킵니다.', 
    mpCost: 40, power: 0.3 
  },

  'passive_water_atk': { 
    id: 'passive_water_atk', name: '거센 물결', type: 'passive', 
    icon: '/skills/passive_water_atk.webp', description: '파티 전체의 공격력을 10% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'attack', value: 0.10 
  },
  'active_water_slash_1': { 
    id: 'active_water_slash_1', name: '대양의 창', type: 'active', subType: 'attack', 
    icon: '/skill/lanceofocean-water-skill.webp', description: '적에게 140%의 물 속성 피해를 입힙니다.', 
    mpCost: 60, element: 'water', flatDamage: 400
  },

  'passive_water_evade': { 
    id: 'passive_water_evade', name: '흐르는 물', type: 'passive', 
    icon: '/skills/passive_water_evade.webp', description: '파티 전체의 회피율을 5% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'evasion', value: 5 
  },
  'active_water_wave': { 
    id: 'active_water_wave', name: '해일', type: 'active', subType: 'debuff', 
    icon: '/skills/active_water_wave.webp', description: '거대한 해일로 2턴 동안 보스의 공격력을 20% 감소시킵니다.', 
    mpCost: 45, element: 'water', stat: 'attack', power: 0.2, duration: 2 
  },

  'passive_water_crit': { 
    id: 'passive_water_crit', name: '매서운 파도', type: 'passive', 
    icon: '/skills/passive_water_crit.webp', description: '파티 전체의 치명타 확률을 5% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'critRate', value: 5 
  },
  'active_water_spear': { 
    id: 'active_water_spear', name: '삼지창 찌르기', type: 'active', subType: 'attack', 
    icon: '/skills/active_water_spear.webp', description: '적에게 200%의 강력한 물 속성 피해를 입힙니다.', 
    mpCost: 50, element: 'water', power: 2.0 
  },

  // ==========================================
  // ☠️ 독 속성 스킬 (Poison)
  // ==========================================
  'passive_poison_atk': { 
    id: 'passive_poison_atk', name: '치명적인 독', type: 'passive', 
    icon: '/skills/passive_poison_atk.webp', description: '파티 전체의 공격력을 15% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'attack', value: 0.15 
  },
  'active_poison_stab': { 
    id: 'active_poison_stab', name: '맹독 찌르기', type: 'active', subType: 'attack', 
    icon: '/skills/active_poison_stab.webp', description: '적에게 150%의 독 속성 피해를 입힙니다.', 
    mpCost: 25, element: 'poison', power: 1.5 
  },

  'passive_poison_evade': { 
    id: 'passive_poison_evade', name: '그림자 숨기', type: 'passive', 
    icon: '/skills/passive_poison_evade.webp', description: '파티 전체의 회피율을 8% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'evasion', value: 8 
  },
  'active_poison_cloud': { 
    id: 'active_poison_cloud', name: '맹독 구름', type: 'active', subType: 'dot', 
    icon: '/skills/active_poison_cloud.webp', description: '적에게 3턴 동안 매 턴 30%의 독 지속 피해를 입힙니다.', 
    mpCost: 40, element: 'poison', power: 0.3, duration: 3 
  },

  'passive_poison_crit': { 
    id: 'passive_poison_crit', name: '암살자의 눈', type: 'passive', 
    icon: '/skills/passive_poison_crit.webp', description: '파티 전체의 치명타 데미지를 20% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'critDmg', value: 0.2 
  },
  'active_poison_assassinate': { 
    id: 'active_poison_assassinate', name: '암살', type: 'active', subType: 'attack', 
    icon: '/skills/active_poison_assassinate.webp', description: '적에게 250%의 치명적인 독 속성 피해를 입힙니다.', 
    mpCost: 55, element: 'poison', power: 2.5 
  },

  'passive_poison_hp': { 
    id: 'passive_poison_hp', name: '부패한 기운', type: 'passive', 
    icon: '/skills/passive_poison_hp.webp', description: '전투 진입 시 보스의 공격력을 10% 감소시킵니다.', 
    target: 'enemy', effectType: 'stat_down', stat: 'attack', value: 0.10 
  },
  'active_poison_strike': { 
    id: 'active_poison_strike', name: '독기 방출', type: 'active', subType: 'attack', 
    icon: '/skills/active_poison_strike.webp', description: '적에게 160%의 독 속성 피해를 입힙니다.', 
    mpCost: 45, element: 'poison', power: 1.6 
  },

  'passive_poison_def': { 
    id: 'passive_poison_def', name: '갑옷 부식', type: 'passive', 
    icon: '/skills/passive_poison_def.webp', description: '전투 진입 시 보스의 방어력을 15% 감소시킵니다.', 
    target: 'enemy', effectType: 'stat_down', stat: 'defense', value: 0.15 
  },
  'active_poison_trap': { 
    id: 'active_poison_trap', name: '맹독 덫', type: 'active', subType: 'debuff', 
    icon: '/skills/active_poison_trap.webp', description: '맹독 덫을 설치하여 1턴 동안 보스의 공격력을 30% 감소시킵니다.', 
    mpCost: 35, stat: 'attack', power: 0.3, duration: 1 
  },

  // ==========================================
  // ☀️ 빛 속성 스킬 (Light)
  // ==========================================
  'passive_light_def': { 
    id: 'passive_light_def', name: '빛의 가호', type: 'passive', 
    icon: '/skills/passive_light_def.webp', description: '파티 전체의 방어력을 15% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'defense', value: 0.15 
  },
  'active_light_shield': { 
    id: 'active_light_shield', name: '신성한 방패', type: 'active', subType: 'buff', 
    icon: '/skills/active_light_shield.webp', description: '3턴 동안 파티 방어력이 40% 상승하는 신성한 방패를 생성합니다.', 
    mpCost: 50, stat: 'defense', power: 0.4, duration: 3 
  },

  'passive_light_atk': { 
    id: 'passive_light_atk', name: '눈부신 빛', type: 'passive', 
    icon: '/skills/passive_light_atk.webp', description: '파티 전체의 공격력을 10% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'attack', value: 0.10 
  },
  'active_light_slash': { 
    id: 'active_light_slash', name: '섬광 베기', type: 'active', subType: 'attack', 
    icon: '/skills/active_light_slash.webp', description: '적에게 160%의 빛 속성 피해를 입힙니다.', 
    mpCost: 30, element: 'light', power: 1.6 
  },

  'passive_light_hp': { 
    id: 'passive_light_hp', name: '성스러운 오라', type: 'passive', 
    icon: '/skills/passive_light_hp.webp', description: '파티 전체의 최대 체력을 20% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'maxHp', value: 0.20 
  },
  'active_light_heal': { 
    id: 'active_light_heal', name: '성스러운 빛', type: 'active', subType: 'heal', 
    icon: '/skills/active_light_heal.webp', description: '파티 전체의 체력을 공격력의 50%만큼 회복시킵니다.', 
    mpCost: 60, power: 0.5 
  },

  'passive_light_crit': { 
    id: 'passive_light_crit', name: '심판의 눈', type: 'passive', 
    icon: '/skills/passive_light_crit.webp', description: '파티 전체의 치명타 확률을 10% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'critRate', value: 10 
  },
  'active_light_smite': { 
    id: 'active_light_smite', name: '신의 심판', type: 'active', subType: 'attack', 
    icon: '/skills/active_light_smite.webp', description: '적에게 300%의 강력한 빛 속성 피해를 입힙니다.', 
    mpCost: 70, element: 'light', power: 3.0 
  },

  'passive_light_evade': { 
    id: 'passive_light_evade', name: '눈부심', type: 'passive', 
    icon: '/skills/passive_light_evade.webp', description: '전투 진입 시 보스의 명중률을 10% 감소시킵니다.', 
    target: 'enemy', effectType: 'stat_down', stat: 'accuracy', value: 10 
  },
  'active_light_pierce': { 
    id: 'active_light_pierce', name: '빛의 창', type: 'active', subType: 'attack', 
    icon: '/skills/active_light_pierce.webp', description: '적에게 150%의 빛 속성 피해를 입힙니다.', 
    mpCost: 40, element: 'light', power: 1.5 
  },

  // ==========================================
  // ❄️ 혹한 속성 스킬 (Ice)
  // ==========================================
  'passive_ice_atk': { 
    id: 'passive_ice_atk', name: '서리 칼날', type: 'passive', 
    icon: '/skills/passive_ice_atk.webp', description: '파티 전체의 공격력을 10% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'attack', value: 0.10 
  },
  'active_ice_spear': { 
    id: 'active_ice_spear', name: '얼음 창', type: 'active', subType: 'attack', 
    icon: '/skills/active_ice_spear.webp', description: '적에게 140%의 얼음 속성 피해를 입힙니다.', 
    mpCost: 30, element: 'ice', power: 1.4 
  },

  'passive_ice_def': { 
    id: 'passive_ice_def', name: '빙갑', type: 'passive', 
    icon: '/skills/passive_ice_def.webp', description: '파티 전체의 방어력을 15% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'defense', value: 0.15 
  },
  'active_ice_shield': { 
    id: 'active_ice_shield', name: '얼음 방패', type: 'active', subType: 'buff', 
    icon: '/skills/active_ice_shield.webp', description: '2턴 동안 파티 방어력이 30% 상승하는 얼음 방패를 생성합니다.', 
    mpCost: 35, stat: 'defense', power: 0.3, duration: 2 
  },

  'passive_ice_hp': { 
    id: 'passive_ice_hp', name: '얼어붙은 심장', type: 'passive', 
    icon: '/skills/passive_ice_hp.webp', description: '파티 전체의 최대 체력을 10% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'maxHp', value: 0.10 
  },
  'active_ice_blizzard': { 
    id: 'active_ice_blizzard', name: '눈보라', type: 'active', subType: 'dot', 
    icon: '/skills/active_ice_blizzard.webp', description: '적에게 3턴 동안 매 턴 20%의 얼음 지속 피해를 입힙니다.', 
    mpCost: 50, element: 'ice', power: 0.2, duration: 3 
  },

  'passive_ice_crit': { 
    id: 'passive_ice_crit', name: '급소 노리기', type: 'passive', 
    icon: '/skills/passive_ice_crit.webp', description: '파티 전체의 치명타 데미지를 25% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'critDmg', value: 0.25 
  },
  'active_ice_slash': { 
    id: 'active_ice_slash', name: '빙결 베기', type: 'active', subType: 'attack', 
    icon: '/skills/active_ice_slash.webp', description: '적에게 160%의 얼음 속성 피해를 입힙니다.', 
    mpCost: 35, element: 'ice', power: 1.6 
  },

  'passive_ice_evade': { 
    id: 'passive_ice_evade', name: '신기루', type: 'passive', 
    icon: '/skills/passive_ice_evade.webp', description: '파티 전체의 회피율을 5% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'evasion', value: 5 
  },
  'active_ice_freeze': { 
    id: 'active_ice_freeze', name: '빙결', type: 'active', subType: 'debuff', 
    icon: '/skills/active_ice_freeze.webp', description: '1턴 동안 적의 공격력을 50% 대폭 감소시킵니다.', 
    mpCost: 60, stat: 'attack', power: 0.5, duration: 1 
  },

  // ==========================================
  // 🌿 역병(치유) 속성 스킬 (Cure)
  // ==========================================
  'passive_cure_hp': { 
    id: 'passive_cure_hp', name: '재생의 기운', type: 'passive', 
    icon: '/skills/passive_cure_hp.webp', description: '파티의 턴당 마나 회복량을 10 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'mpRegen', value: 10 
  },
  'active_cure_heal': { 
    id: 'active_cure_heal', name: '대천사의 축복', type: 'active', subType: 'heal', 
    icon: '/skills/active_cure_heal.webp', description: '파티 전체의 체력을 40% 회복시킵니다.', 
    mpCost: 50, power: 0.4 
  },

  'passive_cure_def': { 
    id: 'passive_cure_def', name: '자연의 가호', type: 'passive', 
    icon: '/skills/passive_cure_def.webp', description: '파티 전체의 방어력을 10% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'defense', value: 0.10 
  },
  'active_cure_shield': { 
    id: 'active_cure_shield', name: '자연의 방패', type: 'active', subType: 'buff', 
    icon: '/skills/active_cure_shield.webp', description: '3턴 동안 파티 방어력이 20% 상승하는 자연의 방패를 생성합니다.', 
    mpCost: 40, stat: 'defense', power: 0.2, duration: 3 
  },

  'passive_cure_atk': { 
    id: 'passive_cure_atk', name: '정화의 힘', type: 'passive', 
    icon: '/skills/passive_cure_atk.webp', description: '파티 전체의 공격력을 10% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'attack', value: 0.10 
  },
  'active_cure_smite': { 
    id: 'active_cure_smite', name: '정화의 일격', type: 'active', subType: 'attack', 
    icon: '/skills/active_cure_smite.webp', description: '적에게 150%의 치유 속성 피해를 입힙니다.', 
    mpCost: 30, element: 'cure', power: 1.5 
  },

  'passive_cure_crit': { 
    id: 'passive_cure_crit', name: '신성한 약점', type: 'passive', 
    icon: '/skills/passive_cure_crit.webp', description: '파티 전체의 치명타 확률을 5% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'critRate', value: 5 
  },
  'active_cure_slash': { 
    id: 'active_cure_slash', name: '생명력 흡수 베기', type: 'active', subType: 'attack', 
    icon: '/skills/active_cure_slash.webp', description: '적에게 140%의 치유 속성 피해를 입히고 체력을 소량 회복합니다.', 
    mpCost: 45, element: 'cure', power: 1.4 
  },

  'passive_cure_evade': { 
    id: 'passive_cure_evade', name: '바람의 인도', type: 'passive', 
    icon: '/skills/passive_cure_evade.webp', description: '파티 전체의 회피율을 5% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'evasion', value: 5 
  },
  'active_cure_purify': { 
    id: 'active_cure_purify', name: '정화', type: 'active', subType: 'debuff', 
    icon: '/skills/active_cure_purify.webp', description: '2턴 동안 보스의 방어력을 20% 감소시킵니다.', 
    mpCost: 55, stat: 'defense', power: 0.2, duration: 2 
  },

  // ==========================================
  // 🌌 공허 속성 스킬 (Vain)
  // ==========================================
  'passive_vain_atk': { 
    id: 'passive_vain_atk', name: '심연의 힘', type: 'passive', 
    icon: '/skills/passive_vain_atk.webp', description: '파티 전체의 공격력을 20% 대폭 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'attack', value: 0.20 
  },
  'active_vain_slash': { 
    id: 'active_vain_slash', name: '공허 가르기', type: 'active', subType: 'attack', 
    icon: '/skills/active_vain_slash.webp', description: '적에게 170%의 공허 속성 피해를 입힙니다.', 
    mpCost: 35, element: 'vain', power: 1.7 
  },

  'passive_vain_def': { 
    id: 'passive_vain_def', name: '칠흑의 갑옷', type: 'passive', 
    icon: '/skills/passive_vain_def.webp', description: '파티 전체의 방어력을 15% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'defense', value: 0.15 
  },
  'active_vain_shield': { 
    id: 'active_vain_shield', name: '칠흑의 장막', type: 'active', subType: 'evade', 
    icon: '/skills/active_vain_shield.webp', description: '1턴 동안 보스의 다음 공격을 완벽하게 회피합니다.', 
    mpCost: 50, duration: 1 
  },

  'passive_vain_hp': { 
    id: 'passive_vain_hp', name: '어둠의 장막', type: 'passive', 
    icon: '/skills/passive_vain_hp.webp', description: '전투 진입 시 보스의 명중률을 5% 감소시킵니다.', 
    target: 'enemy', effectType: 'stat_down', stat: 'accuracy', value: 5 
  },
  'active_vain_drain': { 
    id: 'active_vain_drain', name: '영혼 흡수', type: 'active', subType: 'dot', 
    icon: '/skills/active_vain_drain.webp', description: '적에게 3턴 동안 매 턴 25%의 공허 지속 피해를 입힙니다.', 
    mpCost: 45, element: 'vain', power: 0.25, duration: 3 
  },

  'passive_vain_evade': { 
    id: 'passive_vain_evade', name: '절망의 기운', type: 'passive', 
    icon: '/skills/passive_vain_evade.webp', description: '전투 진입 시 보스의 공격력을 10% 감소시킵니다.', 
    target: 'enemy', effectType: 'stat_down', stat: 'attack', value: 0.10 
  },
  'active_vain_meteor': { 
    id: 'active_vain_meteor', name: '공허의 운석', type: 'active', subType: 'attack', 
    icon: '/skills/active_vain_meteor.webp', description: '적에게 350%의 파괴적인 공허 속성 피해를 입힙니다.', 
    mpCost: 80, element: 'vain', power: 3.5 
  },

  'passive_vain_crit': { 
    id: 'passive_vain_crit', name: '파멸의 징조', type: 'passive', 
    icon: '/skills/passive_vain_crit.webp', description: '파티 전체의 치명타 데미지를 30% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'critDmg', value: 0.3 
  },
  'active_vain_pierce': { 
    id: 'active_vain_pierce', name: '어둠의 창', type: 'active', subType: 'attack', 
    icon: '/skills/active_vain_pierce.webp', description: '적에게 160%의 공허 속성 피해를 입힙니다.', 
    mpCost: 40, element: 'vain', power: 1.6 
  }
};
