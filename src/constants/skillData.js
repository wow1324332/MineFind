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
    'active_fire_atk_2': { 
    id: 'active_fire_atk_2', name: '염화참', type: 'active', subType: 'attack', 
    icon: '/skill/flameslash-fire-skill.webp', description: '적에게 400의 강력한 화염 피해를 입힙니다.', 
    mpCost: 60, element: 'fire', flatDamage: 400
  },
  
  'passive_fire_crit_1': { 
    id: 'passive_fire_crit_1', name: '업화의 눈', type: 'passive', 
    icon: '/skill/hellfiregaze_fire_skill.webp', description: '파티 전체의 치명타 확률을 10% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'critRate', value: 10 
  },
  'active_fire_burst_1': { 
    id: 'active_fire_burst_1', name: '화염 폭발', type: 'active', subType: 'attack', 
    icon: '/skill/infernoboom_fire_skill.webp', description: '적에게 1000%의 강력한 화염 속성 피해를 입힙니다.', 
    mpCost: 100, element: 'fire', power: 10 
  },
  
  'passive_fire_hp_1': { 
    id: 'passive_fire_hp_1', name: '불꽃의 심장', type: 'passive', 
    icon: '/skill/heartoffire_fire_skill.webp', description: '불 속성 기사들의 체력을 10% 증가시킵니다.', 
    target: 'ally', targetAttribute: 'fire', effectType: 'stat_up', stat: 'maxHp', value: 0.15 
  },
  'active_fire_storm_1': { 
    id: 'active_fire_storm_1', name: '화상 작열', type: 'active', subType: 'dot', 
    icon: '/skill/ignitedwound_fire_skill.webp', description: '적에게 3턴 동안 매 턴 50%의 화염 지속 피해를 입힙니다.', 
    mpCost: 80, element: 'fire', power: 0.5, duration: 3 
  },
  
  'passive_fire_def_1': { 
    id: 'passive_fire_def_1', name: '초열 피부', type: 'passive', 
    icon: '/skill/magmaskin_fire_skill.webp', description: '불 속성 기사들의 방어력을 20% 증가시킵니다.', 
    target: 'ally', targetAttribute: 'fire', effectType: 'stat_up', stat: 'defense', value: 0.20 
  },
  'active_fire_shield_1': { 
    id: 'active_fire_shield_1', name: '연옥 방어막', type: 'active', subType: 'buff', 
    icon: '/skill/infernobarrier_fire_skill.webp', description: '2턴 동안 파티 방어력이 30% 상승하는 화염 방패를 생성합니다.', 
    mpCost: 50, stat: 'defense', power: 0.3, duration: 2 
  },

  'passive_fire_resist_1': { 
    id: 'passive_fire_resist_1', name: '화룡의 가호', type: 'passive', 
    icon: '/skill/firedragonfavor_fire_skill.webp', description: '전투 진입 시 보스의 공격력을 5% 감소시킵니다.', 
    target: 'enemy', effectType: 'stat_down', stat: 'attack', value: 0.05 
  },

  // ==========================================
  // 💧 물 속성 스킬 (Water)
  // ==========================================
  'passive_water_def_1': { 
    id: 'passive_water_def_1', name: '수룡의 가호', type: 'passive', 
    icon: '/skill/tidalward_water_skill.webp', description: '수속성 기사들의 방어력을 20% 증가시킵니다.', 
    target: 'ally', targetAttribute: 'water', effectType: 'stat_up', stat: 'defense', value: 0.20 
  },
  'active_water_eva_1': { 
    id: 'active_water_eva_1', name: '수상비', type: 'active', subType: 'buff', 
    icon: '/skill/aquaglide-water-skill.webp', description: '2턴 동안 파티의 회피율을 대폭(30%) 증가시킵니다.', 
    mpCost: 90, stat: 'evasion', power: 30, duration: 2 
  },

  'passive_water_hp_1': { 
    id: 'passive_water_hp_1', name: '대양의 방패', type: 'passive', 
    icon: '/skill/shieldofocean-water-skill.webp', description: '파티 전체의 최대 체력을 15% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'maxHp', value: 0.15 
  },
  'active_water_heal_1': { 
    id: 'active_water_heal_1', name: '여신의 물결', type: 'active', subType: 'heal', 
    icon: '/skill/divinewave-water-skill.webp', description: '파티 전체의 체력을 공격력의 200%만큼 회복시킵니다.', 
    mpCost: 50, power: 2.0 
  },

  'passive_water_atk_1': { 
    id: 'passive_water_atk_1', name: '물의 여신의 격노', type: 'passive', 
    icon: '/skill/celestialtsunami-water-skill.webp', description: '수속성 기사들의 공격력을 20% 증가시킵니다.', 
    target: 'ally', targetAttribute: 'water', effectType: 'stat_up', stat: 'attack', value: 0.20 
  },
  'active_water_slash_1': { 
    id: 'active_water_slash_1', name: '대양의 창', type: 'active', subType: 'attack', 
    icon: '/skill/lanceofocean-water-skill.webp', description: '적에게 140%의 물 속성 피해를 입힙니다.', 
    mpCost: 60, element: 'water', flatDamage: 400
  },

  'passive_water_evade_1': { 
    id: 'passive_water_evade_1', name: '등평도수', type: 'passive', 
    icon: '/skill/weightlessripple-water-skill.webp', description: '파티 전체의 회피율을 5% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'evasion', value: 5 
  },
  'active_water_wave_1': { 
    id: 'active_water_wave_1', name: '해일 장벽', type: 'active', subType: 'debuff', 
    icon: '/skill/tidalwall-water-skill.webp', description: '거대한 해일로 2턴 동안 보스의 공격력을 30% 감소시킵니다.', 
    mpCost: 60, element: 'water', stat: 'attack', power: 0.3, duration: 2 
  },

  'passive_water_crit_1': { 
    id: 'passive_water_crit_1', name: '심해의 눈', type: 'passive', 
    icon: '/skill/abyssaleye-water-skill.webp', description: '파티 전체의 치명타 확률을 5% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'critRate', value: 5 
  },
  'active_water_spear_1': { 
    id: 'active_water_spear_1', name: '포세이돈의 삼지창', type: 'active', subType: 'attack', 
    icon: '/skill/poseidonstrident-water-skill.webp', description: '적에게 400%의 강력한 물 속성 피해를 입힙니다.', 
    mpCost: 100, element: 'water', power: 4.0 
  },

  // ==========================================
  // ☠️ 독 속성 스킬 (Poison)
  // ==========================================
  'passive_poison_atk_1': { 
    id: 'passive_poison_atk_1', name: '치명적인 독', type: 'passive', 
    icon: '/skill/fatalvenom-poison-skill.webp', description: '독 속성의 기사들 공격력을 15% 증가시킵니다.', 
    target: 'ally', targetattribute: 'poison', effectType: 'stat_up', stat: 'attack', value: 0.15 
  },
  'active_poison_atk_1': { 
    id: 'active_poison_atk_1', name: '맹독 찌르기', type: 'active', subType: 'attack', 
    icon: '/skill/venomthrust-poison-skill.webp', description: '적에게 350%의 독 속성 피해를 입힙니다.', 
    mpCost: 70, element: 'poison', power: 3.0 
  },

  'passive_poison_eva_1': { 
    id: 'passive_poison_eva_1', name: '그림자 숨기', type: 'passive', 
    icon: '/skill/shadowmeld-poison-skill.webp', description: '파티 전체의 회피율을 8% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'evasion', value: 8 
  },
  'active_poison_dot_1': { 
    id: 'active_poison_dot_1', name: '맹독 구름', type: 'active', subType: 'dot', 
    icon: '/skill/venomousmist-poison-skill.webp', description: '적에게 3턴 동안 매 턴 50%의 독 지속 피해를 입힙니다.', 
    mpCost: 90, element: 'poison', power: 0.5, duration: 3 
  },

  'passive_poison_crit_1': { 
    id: 'passive_poison_crit_1', name: '암살자의 눈', type: 'passive', 
    icon: '/skill/assassinseye-poison-skill.webp', description: '파티 전체의 치명타 데미지를 20% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'critDmg', value: 0.2 
  },
  'active_poison_atk_2': { 
    id: 'active_poison_atk_2', name: '암살', type: 'active', subType: 'attack', 
    icon: '/skill/assassinate-poison-skill.webp', description: '적에게 380의 치명적인 독 속성 피해를 입힙니다.', 
    mpCost: 70, element: 'poison', flatDamage: 380
  },

  'passive_poison_hp_1': { 
    id: 'passive_poison_hp_1', name: '부패한 기운', type: 'passive', 
    icon: '/skill/decayingpresence-poison-skill.webp', description: '전투 진입 시 보스의 공격력을 15% 감소시킵니다.', 
    target: 'enemy', effectType: 'stat_down', stat: 'attack', value: 0.15 
  },
  'active_poison_splash_1': { 
    id: 'active_poison_splash_1', name: '독기 방출', type: 'active', subType: 'attack', 
    icon: '/skill/venomdischarge-poison-skill.webp', description: '적에게 300%의 독 속성 피해를 입힙니다.', 
    mpCost: 80, element: 'poison', power: 3.0
  },

  'passive_poison_def_1': { 
    id: 'passive_poison_def_1', name: '갑옷 부식', type: 'passive', 
    icon: '/skill/armorcorrosion-poison-skill.webp', description: '전투 진입 시 보스의 방어력을 15% 감소시킵니다.', 
    target: 'enemy', effectType: 'stat_down', stat: 'defense', value: 0.15 
  },
  'active_poison_trap_1': { 
    id: 'active_poison_trap_1', name: '맹독 덫', type: 'active', subType: 'debuff', 
    icon: '/skill /poisonmine-poison-skill.webp', description: '맹독 덫을 설치하여 2턴 동안 보스의 공격력을 50% 감소시킵니다.', 
    mpCost: 70, stat: 'attack', power: 0.5, duration: 2 
  },

  // ==========================================
  // ☀️ 빛 속성 스킬 (Light)
  // ==========================================
  'passive_light_def_1': { 
    id: 'passive_light_def_1', name: '빛의 가호', type: 'passive', 
    icon: '/skill/divineprotection-light-skill.webp', description: '파티 전체의 방어력을 10% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'defense', value: 0.10 
  },
  'active_light_def_1': { 
    id: 'active_light_def_1', name: '신성한 방패', type: 'active', subType: 'buff', 
    icon: '/skill/holyshield-light-skill.webp', description: '3턴 동안 파티 방어력이 30% 상승하는 신성한 방패를 생성합니다.', 
    mpCost: 80, stat: 'defense', power: 0.3, duration: 3 
  },

  'passive_light_atk_1': { 
    id: 'passive_light_atk_1', name: '광휘의 빛', type: 'passive', 
    icon: '/skills/radiantlight-light-skill.webp', description: '파티 전체의 공격력을 5% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'attack', value: 0.5 
  },
  'active_light_dmg_1': { 
    id: 'active_light_dmg_1', name: '섬광 베기', type: 'active', subType: 'attack', 
    icon: '/skill/flashstrike-light-skill.webp', description: '적에게 300%의 빛 속성 피해를 입힙니다.', 
    mpCost: 60, element: 'light', power: 3.0 
  },

  'passive_light_hp_1': { 
    id: 'passive_light_hp_1', name: '빛의 여신의 보호', type: 'passive', 
    icon: '/skill/goddessoflightward-light-skill.webp', description: '파티 전체의 최대 체력을 10% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'maxHp', value: 0.10 
  },
  'active_light_heal_1': { 
    id: 'active_light_heal_1', name: '성스러운 빛', type: 'active', subType: 'heal', 
    icon: '/skill/holylight-light-skill.webp', description: '파티 전체의 체력을 공격력의 100%만큼 회복시킵니다.', 
    mpCost: 90, power: 1.0 
  },

  'passive_light_crit_1': { 
    id: 'passive_light_crit_1', name: '심판의 눈', type: 'passive', 
    icon: '/skill/eyeofjudgment-light-skill.webp', description: '파티 전체의 치명타 확률을 10% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'critRate', value: 10 
  },
  'active_light_dmg_2': { 
    id: 'active_light_dmg_2', name: '제우스의 분노', type: 'active', subType: 'attack', 
    icon: '/skill/wrathofzeus-light-skill.webp', description: '적에게 400의 강력한 빛 속성 고정 피해를 입힙니다.', 
    mpCost: 70, element: 'light', flatDamage: 400 
  },

  'passive_light_eva_1': { 
    id: 'passive_light_eva_1', name: '태양 응시', type: 'passive', 
    icon: '/skill/solargaze-light-skill.webp', description: '전투 진입 시 보스의 명중률을 10% 감소시킵니다.', 
    target: 'enemy', effectType: 'stat_down', stat: 'accuracy', value: 10 
  },
  'active_light_dmg_3': { 
    id: 'active_light_dmg_3', name: '광휘어검', type: 'active', subType: 'attack', 
    icon: '/skill/luminousbladecontrol-light-skill.webp', description: '적에게 350%의 빛 속성 피해를 입힙니다.', 
    mpCost: 90, element: 'light', power: 3.5 
  },

  // ==========================================
  // ❄️ 혹한 속성 스킬 (Ice)
  // ==========================================
  'passive_ice_atk_1': { 
    id: 'passive_ice_atk_1', name: '서리 칼날', type: 'passive', 
    icon: '/skill/icesword-ice-skill.webp', description: '얼음 속성 기사들의 공격력을 15% 증가시킵니다.', 
    target: 'ally', targetattribute: 'ice', effectType: 'stat_up', stat: 'attack', value: 0.15 
  },
  'active_ice_atk_1': { 
    id: 'active_ice_atk_1', name: '빙검 폭격', type: 'active', subType: 'attack', 
    icon: '/skill/iceswordwind-ice-skill.webp', description: '적에게 400의 고정 얼음 속성 피해를 입힙니다.', 
    mpCost: 70, element: 'ice', flatDamage: 400
  },

  'passive_ice_def_1': { 
    id: 'passive_ice_def_1', name: '빙설 방패', type: 'passive', 
    icon: '/skill/iceshield-ice-skill.webp', description: '얼음 기사의 방어력을 20% 증가시킵니다.', 
    target: 'ally', targetattribute: 'ice', effectType: 'stat_up', stat: 'defense', value: 0.15 
  },
  'active_ice_def_1': { 
    id: 'active_ice_def_1', name: '얼어붙은 피부', type: 'active', subType: 'buff', 
    icon: '/skill/frozenskin-ice-skill.webp', description: '2턴 동안 파티 방어력이 30% 상승하는 얼음 방패를 생성합니다.', 
    mpCost: 70, stat: 'defense', power: 0.3, duration: 2 
  },

  'passive_ice_hp_1': { 
    id: 'passive_ice_hp_1', name: '얼어붙은 심장', type: 'passive', 
    icon: '/skill/frozenheart-ice-skill.webp', description: '얼음 기사들의 최대 체력을 10% 증가시킵니다.', 
    target: 'ally', targetattribute: 'ice', effectType: 'stat_up', stat: 'maxHp', value: 0.10 
  },
  'active_ice_dot_1': { 
    id: 'active_ice_dot_1', name: '눈보라', type: 'active', subType: 'dot', 
    icon: '/skill/blizzard-ice-skill.webp', description: '적에게 3턴 동안 매 턴 40%의 얼음 지속 피해를 입힙니다.', 
    mpCost: 90, element: 'ice', power: 0.4, duration: 3 
  },

  'passive_ice_crit_1': { 
    id: 'passive_ice_crit_1', name: '빙결안', type: 'passive', 
    icon: '/skill/eyeofice-ice-skill.webp', description: '파티 전체의 치명타 데미지를 25% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'critDmg', value: 0.25 
  },
  'active_ice_atk_2': { 
    id: 'active_ice_atk_2', name: '빙결 일섬', type: 'active', subType: 'attack', 
    icon: '/skill/frozenslash-ice-skill.webp', description: '적에게 350%의 얼음 속성 피해를 입힙니다.', 
    mpCost: 70, element: 'ice', power: 3.5 
  },

  'passive_ice_eva_1': { 
    id: 'passive_ice_eva_1', name: '얼음 오로라', type: 'passive', 
    icon: '/skill/auroraofice-ice-skill.webp', description: '파티 전체의 회피율을 5% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'evasion', value: 5 
  },
  'active_ice_freeze_1': { 
    id: 'active_ice_freeze_1', name: '빙결', type: 'active', subType: 'debuff', 
    icon: '/skill/freeze-ice-skill.webp', description: '1턴 동안 적의 공격력을 75% 대폭 감소시킵니다.', 
    mpCost: 60, stat: 'attack', power: 0.75, duration: 1 
  },

  // ==========================================
  // 🌿 역병(치유) 속성 스킬 (Cure)
  // ==========================================
  'passive_cure_mp_1': { 
    id: 'passive_cure_mp_1', name: '재생의 기운', type: 'passive', 
    icon: '/skill/재생의기운.webp', description: '파티의 턴당 마나 회복량을 10 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'mpRegen', value: 10 
  },
  'active_cure_heal_1': { 
    id: 'active_cure_heal_1', name: '대천사의 축복', type: 'active', subType: 'heal', 
    icon: '/skill/대천사의축복.webp', description: '파티 전체의 체력을 40% 회복시킵니다.', 
    mpCost: 150, power: 0.4 
  },

  'passive_cure_def_1': { 
    id: 'passive_cure_def_1', name: '자연의 가호', type: 'passive', 
    icon: '/skill/자연의가호.webp', description: '치유의 기사 전체의 방어력을 15% 증가시킵니다.', 
    target: 'ally', targetattribute: 'cure', effectType: 'stat_up', stat: 'defense', value: 0.15 
  },
  'active_cure_def_1': { 
    id: 'active_cure_def_1', name: '대자연의 방패', type: 'active', subType: 'buff', 
    icon: '/skill/대자연의방패.webp', description: '3턴 동안 파티 방어력이 20% 상승하는 자연의 방패를 생성합니다.', 
    mpCost: 90, stat: 'defense', power: 0.2, duration: 3 
  },

  'passive_cure_atk_1': { 
    id: 'passive_cure_atk_1', name: '정화의 힘', type: 'passive', 
    icon: '/skill/정화의힘.webp', description: '치유의 기사 전체의 공격력을 15% 증가시킵니다.', 
    target: 'ally', targetattribute: 'cure', effectType: 'stat_up', stat: 'attack', value: 0.15 
  },
  'active_cure_atk_1': { 
    id: 'active_cure_atk_1', name: '정화의 일격', type: 'active', subType: 'attack', 
    icon: '/skill/정화의일격.webp', description: '적에게 350%의 치유 속성 피해를 입힙니다.', 
    mpCost: 60, element: 'cure', power: 3.5 
  },

  'passive_cure_crit_1': { 
    id: 'passive_cure_crit_1', name: '해부학의 눈', type: 'passive', 
    icon: '/skill/해부학의눈.webp', description: '파티 전체의 치명타 확률을 5% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'critRate', value: 5 
  },
  'active_cure_atk_2': { 
    id: 'active_cure_atk_2', name: '회복의 일격', type: 'active', subType: 'attack', 
    icon: '/skill/회복의일격.webp', description: '적에게 250%의 치유 속성 피해를 입히고 체력을 소량 회복합니다.', 
    mpCost: 60, element: 'cure', power: 2.5 
  },

  'passive_cure_eva_1': { 
    id: 'passive_cure_eva_1', name: '바람의 인도', type: 'passive', 
    icon: '/skill/바람의인도.webp', description: '파티 전체의 회피율을 5% 증가시킵니다.', 
    target: 'ally', effectType: 'stat_up', stat: 'evasion', value: 5 
  },
  'active_cure_debuff_1': { 
    id: 'active_cure_debuff_1', name: '정화', type: 'active', subType: 'debuff', 
    icon: '/skill/정화.webp', description: '3턴 동안 보스의 방어력을 20% 감소시킵니다.', 
    mpCost: 80, stat: 'defense', power: 0.2, duration: 3 
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
