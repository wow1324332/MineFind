// src/constants/dungeonData.js

export const DUNGEON_INFO = {
  fire: {
    id: 'fire',
    name: 'Hell of flame',
    buttonImg: '/dungeons/fire/hellofflame-bt.webp',
    titleImg: '/dungeons/fire/hellofflame-title.webp',
    loadingBg: '/dungeons/fire/hellofflameloading-bg.webp',
    loadingMsg: "불의 던전으로 강습 중...",
    loadingLogo: "/dungeons/fire/hellofflame-bt.webp",
    loadingOpacity: "opacity-70",
    winBg: '/dungeons/fire/hellofflamewin.webp',
    loseBg: '/dungeons/fire/hellofflamelose-bg.webp',
    boardBg: '/dungeons/fire/dungeoninsite-bg.webp',
    tileImg: '/dungeons/fire/hellofflame-tile.webp',
    mineImg: '/dungeons/fire/hellofflame-mine.webp',
    mineShadow: 'drop-shadow-[0_0_15px_rgba(220,38,38,1)]',
    revealedMineBg: 'bg-red-950/80 shadow-[inset_0_0_20px_rgba(220,38,38,0.8)]',
    
    // 💡 10행 8열의 기본 사각형 맵
    layout: Array(10).fill(Array(10).fill(1))
  },
  water: {
    id: 'water',
    name: 'Hell of aqua',
    buttonImg: '/dungeons/water/hellofaqua-bt.webp',
    titleImg: '/dungeons/water/hellofaqua-title.webp',
    loadingBg: '/dungeons/water/hellofaqualoading-bg.webp',
    loadingMsg: "물의 던전으로 잠수 중...",
    loadingLogo: "/dungeons/water/hellofaqua-bt.webp",
    loadingOpacity: "opacity-70",
    winBg: '/dungeons/water/hellofaquawin.webp',
    loseBg: '/dungeons/water/hellofaqualose.webp',
    boardBg: '/dungeons/water/hellofaqua-board-bg.webp',
    tileImg: '/dungeons/water/hellofaqua-tile.webp',
    mineImg: '/dungeons/water/hellofaqua-mine.webp',
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
    buttonImg: '/dungeons/poison/hellofpoison-bt.webp',
    titleImg: '/dungeons/poison/hellofpoison-title.webp',
    loadingBg: '/dungeons/poison/hellofpoisonloading-bg.webp',
    loadingMsg: "독의 심연으로 이동 중...",
    loadingLogo: "/dungeons/poison/hellofpoison-bt.webp", // 💡 로고 경로 수정
    loadingOpacity: "opacity-70",
    winBg: '/dungeons/poison/hellofpoisonwin.webp',
    loseBg: '/dungeons/poison/hellofpoisonlose.webp',
    boardBg: '/dungeons/poison/hellofpoison-board-bg.webp',
    tileImg: '/dungeons/poison/hellofpoison-tile.webp',
    mineImg: '/dungeons/poison/hellofpoison-mine.webp',
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
  },
  frozen: {
    id: 'frozen',
    name: 'Hell of frozen',
    buttonImg: '/dungeons/frozen/helloffrozen-bt.png',
    titleImg: '/dungeons/frozen/helloffrozen-title.jpg',
    loadingBg: '/dungeons/frozen/helloffrozenloading-bg.jpg',
    loadingMsg: "번놔의 심연으로 이동 중...",
    loadingLogo: "/dungeons/frozen/helloffrozen-bt.png", // 💡 로고 경로 수정
    loadingOpacity: "opacity-70",
    winBg: '/dungeons/frozen/helloffrozenwin.jpg',
    loseBg: '/dungeons/frozen/helloffrozenlose.jpg',
    boardBg: '/dungeons/frozen/helloffrozen-board-bg.jpg',
    tileImg: '/dungeons/frozen/helloffrozen-tile.png',
    mineImg: '/dungeons/frozen/helloffrozen-mine.png',
    mineShadow: 'drop-shadow-[0_0_15px_rgba(34,197,94,1)]', // 💡 독 던전 전용 녹색 불빛으로 수정
    revealedMineBg: 'bg-slate-900/80 shadow-[inset_0_0_20px_rgba(56,189,248,0.8)]', // 💡 독 던전 전용 녹색 불빛으로 수정
    
    layout: [
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    ],
  }
};

export const DIFFICULTIES = ['Easy', 'Normal', 'Hard', 'Expert', 'Hell'];
