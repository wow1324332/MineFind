// src/constants/dungeonData.js

export const DUNGEON_INFO = {
  fire: {
    id: 'fire',
    name: 'Hell of flame',
    buttonImg: '/dungeons/fire/hellofflame-bt.png',
    titleImg: '/dungeons/fire/hellofflame-title.jpg',
    loadingBg: '/dungeons/fire/hellofflameloading-bg.jpg',
    loadingMsg: "불의 던전으로 강습 중...",
    loadingLogo: "/dungeons/fire/hellofflame-bt.png",
    loadingOpacity: "opacity-70",
    winBg: '/dungeons/fire/hellofflamewin.jpeg',
    loseBg: '/dungeons/fire/hellofflamelose-bg.jpg',
    boardBg: '/dungeons/fire/dungeoninsite-bg.jpg',
    tileImg: '/dungeons/fire/hellofflame-tile.png',
    mineImg: '/dungeons/fire/hellofflame-mine.png',
    mineShadow: 'drop-shadow-[0_0_15px_rgba(220,38,38,1)]',
    revealedMineBg: 'bg-red-950/80 shadow-[inset_0_0_20px_rgba(220,38,38,0.8)]',
    
    // 💡 10행 8열의 기본 사각형 맵
    layout: Array(10).fill(Array(8).fill(1)),
    
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
    buttonImg: '/dungeons/water/hellofaqua-bt.png',
    titleImg: '/dungeons/water/hellofaqua-title.jpg',
    loadingBg: '/dungeons/water/hellofaqualoading-bg.jpg',
    loadingMsg: "물의 던전으로 잠수 중...",
    loadingLogo: "/dungeons/water/hellofaqua-bt.png",
    loadingOpacity: "opacity-70",
    winBg: '/dungeons/water/hellofaquawin.jpg',
    loseBg: '/dungeons/water/hellofaqualose.jpg',
    boardBg: '/dungeons/water/hellofaqua-board-bg.jpg',
    tileImg: '/dungeons/water/hellofaqua-tile.png',
    mineImg: '/dungeons/water/hellofaqua-mine.png',
    mineShadow: 'drop-shadow-[0_0_15px_rgba(37,99,235,1)]',
    revealedMineBg: 'bg-blue-950/80 shadow-[inset_0_0_20px_rgba(37,99,235,0.8)]',
    
    // 💡 모서리가 깎인 팔각형 구조 (0은 투명 타일 처리됨)
    layout: [
      [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    ],

    rewards: {
      Easy: { gold: 10, exp: 5, materials: { '맑은 물방울': 1 } },
      Normal: { gold: 30, exp: 15, materials: { '맑은 물방울': 3, '심해의 결정': 1 } },
      Hard: { exp: 50, gold: 100, materials: { '심해의 결정': 3, '얼어붙은 눈물': 1 } },
      Expert: { gold: 300, exp: 150, materials: { '얼어붙은 눈물': 3, '해신의 삼지창 조각': 1 } },
      Hell: { gold: 1000, exp: 500, materials: { '해신의 삼지창 조각': 3, '리바이어던의 비늘': 1 } }
    }
  }
};

export const DIFFICULTIES = ['Easy', 'Normal', 'Hard', 'Expert', 'Hell'];
