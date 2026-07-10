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
    layout: Array(10).fill(Array(10).fill(1))
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
  },
  poison: {
    id: 'poison',
    name: 'Hell of poison',
    buttonImg: '/dungeons/poison/hellofpoison-bt.png',
    titleImg: '/dungeons/poison/hellofpoison-title.jpg',
    loadingBg: '/dungeons/poison/hellofpoisonloading-bg.jpg',
    loadingMsg: "독의 심연으로 이동 중...",
    loadingLogo: "/dungeons/poison/hellofpoison-bt.png", // 💡 로고 경로 수정
    loadingOpacity: "opacity-70",
    winBg: '/dungeons/poison/hellofpoisonwin.jpg',
    loseBg: '/dungeons/poison/hellofpoisonlose.jpg',
    boardBg: '/dungeons/poison/hellofpoison-board-bg.jpg',
    tileImg: '/dungeons/poison/hellofpoison-tile.png',
    mineImg: '/dungeons/poison/hellofpoison-mine.png',
    mineShadow: 'drop-shadow-[0_0_15px_rgba(34,197,94,1)]', // 💡 독 던전 전용 녹색 불빛으로 수정
    revealedMineBg: 'bg-green-950/80 shadow-[inset_0_0_20px_rgba(34,197,94,0.8)]', // 💡 독 던전 전용 녹색 불빛으로 수정
    
    layout: [
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1],
      [1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    ],
  },
    light: {
    id: 'light',
    name: 'Hell of agony',
    buttonImg: '/dungeons/agony/hellofagony-bt.png',
    titleImg: '/dungeons/agony/hellofagony-title.jpg',
    loadingBg: '/dungeons/agony/hellofagonyloading-bg.jpg',
    loadingMsg: "번놔의 심연으로 이동 중...",
    loadingLogo: "/dungeons/agony/hellofagony-bt.png", // 💡 로고 경로 수정
    loadingOpacity: "opacity-70",
    winBg: '/dungeons/agony/hellofagonywin.jpg',
    loseBg: '/dungeons/agony/hellofagonylose.jpg',
    boardBg: '/dungeons/agony/hellofagony-board-bg.jpg',
    tileImg: '/dungeons/agony/hellofagony-tile.png',
    mineImg: '/dungeons/agony/hellofagony-mine.png',
    mineShadow: 'drop-shadow-[0_0_15px_rgba(34,197,94,1)]', // 💡 독 던전 전용 녹색 불빛으로 수정
    revealedMineBg: 'bg-yellow-950/80 shadow-[inset_0_0_20px_rgba(34,197,94,0.8)]', // 💡 독 던전 전용 녹색 불빛으로 수정
    
    layout: [
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    ],
  }
};

export const DIFFICULTIES = ['Easy', 'Normal', 'Hard', 'Expert', 'Hell'];
