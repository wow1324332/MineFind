// src/constants/knightData.js

export const KNIGHT_DATABASE = {
  'knight_main': {
    id: 'knight_main',
    name: '주인공', 
    title: '견습 기사',
    attribute: 'neutral', 
    rarity: 'player', 
    image: '/knights/mainknight-profile.png',
    bgImage: '/knights/mainknight.jpg', // 🔥 이 줄을 새로 추가해 주세요! (상세 화면 전체 배경용)
    description: '기사단의 단장인 당신 자신입니다. 끝없는 잠재력을 지니고 있습니다.',
    
    baseStats: {
      str: 10,
      agi: 10,
      int: 10,
      vit: 15,
      luk: 10
    },

    // 💡 레벨업 당 스탯 상승치
    // (이 수치에 유저의 현재 레벨을 곱해서 최종 스탯을 계산합니다)
    statGrowth: {
      str: 2,
      agi: 2,
      int: 2,
      vit: 2,
      luk: 2
    },

    // 💡 10레벨 도달 시 유저가 선택하게 될 3가지 스킬 트랙
    selectableSkills: {
      'skill_main_str': {
        id: 'skill_main_str',
        name: '단장의 긍지',
        type: 'buff',
        mpCost: 20,
        description: '3턴 동안 파티 전체 기사들의 공격력을 15% 상승시킵니다.'
      },
      'skill_main_vit': {
        id: 'skill_main_vit',
        name: '불굴의 방진',
        type: 'defense',
        mpCost: 30,
        description: '보스의 다음 공격 데미지를 50% 감소시키고, 파티 체력을 소량 회복합니다.'
      },
      'skill_main_agi': {
        id: 'skill_main_agi',
        name: '치명적인 지휘',
        type: 'debuff',
        mpCost: 25,
        description: '보스의 회피율을 0으로 만들고, 이번 턴 아군의 모든 공격이 치명타로 적중합니다.'
      }
    }
  }
};
