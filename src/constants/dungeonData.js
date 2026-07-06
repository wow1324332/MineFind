// src/constants/dungeonData.js

export const DUNGEON_INFO = {
  fire: {
    id: 'fire',
    name: 'Hell of flame',
    buttonImg: '/hellofflame-bt.png',
    titleImg: '/hellofflame-title.jpg',
    loadingBg: '/hellofflameloading-bg.jpg',
    winBg: '/hellofflamewin.jpeg',
    loseBg: '/hellofflamelose-bg.jpg',
    // 💡 불 던전 난이도별 자원 보상 (골드, 경험치, 드랍 아이템)
    rewards: {
      Easy: { gold: 10, exp: 5, materials: { '작은 불씨': 1 } },
      Normal: { gold: 30, exp: 15, materials: { '작은 불씨': 3, '꺼지지 않는 불꽃': 1 } },
      Hard: { gold: 100, exp: 50, materials: { '꺼지지 않는 불꽃': 3, '지옥불 파편': 1 } },
      Expert: { gold: 300, exp: 150, materials: { '지옥불 파편': 3, '악마의 코어': 1 } },
      Hell: { gold: 1000, exp: 500, materials: { '악마의 코어': 3, '화룡의 심장': 1 } }
    }
  },
  water: {
    id: 'water',
    name: 'Hell of aqua',
    buttonImg: '/hellofaqua-bt.png',
    titleImg: '/hellofaqua-title.jpg',
    loadingBg: '/devilmineloading-bg.jpg', // 물 던전 전용 로딩이 없다면 기본 로딩 사용
    winBg: '/hellofaquawin.jpeg',
    loseBg: '/hellofaqualose-bg.jpg',
    // 💡 물 던전 난이도별 자원 보상
    rewards: {
      Easy: { gold: 10, exp: 5, materials: { '맑은 물방울': 1 } },
      Normal: { gold: 30, exp: 15, materials: { '맑은 물방울': 3, '심해의 결정': 1 } },
      Hard: { gold: 100, exp: 50, materials: { '심해의 결정': 3, '얼어붙은 눈물': 1 } },
      Expert: { gold: 300, exp: 150, materials: { '얼어붙은 눈물': 3, '해신의 삼지창 조각': 1 } },
      Hell: { gold: 1000, exp: 500, materials: { '해신의 삼지창 조각': 3, '리바이어던의 비늘': 1 } }
    }
  }
};

// 💡 난이도 목록도 여기서 한 번에 관리하면 편합니다.
export const DIFFICULTIES = ['Easy', 'Normal', 'Hard', 'Expert', 'Hell'];
