export const GAME_CONFIG = {
  ROWS: 10,
  COLS: 8,
};

// 💡 난이도별 지뢰 갯수 계산기
export const getMineCount = (difficulty) => {
  switch (difficulty) {
    case 'Easy': return 10;
    case 'Normal': return Math.floor(Math.random() * (14 - 11 + 1)) + 11; // 11 ~ 14
    case 'Hard': return Math.floor(Math.random() * (19 - 15 + 1)) + 15;   // 15 ~ 19
    case 'Expert': return Math.floor(Math.random() * (24 - 20 + 1)) + 20; // 20 ~ 24
    case 'Hell': return Math.floor(Math.random() * (30 - 25 + 1)) + 25;   // 25 ~ 30
    default: return 12;
  }
};

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

// 💡 (에러 원인) 지워졌던 보드 생성 함수 복구!
export const createEmptyBoard = () => {
  return Array.from({ length: GAME_CONFIG.ROWS }, (_, r) =>
    Array.from({ length: GAME_CONFIG.COLS }, (_, c) => ({
      r, c,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0,
    }))
  );
};

export const cloneBoard = (board) => board.map(row => row.map(cell => ({ ...cell })));

// 💡 지뢰 배치 함수 (Max 5 룰 유연화 & 실제 배치된 지뢰 수 반환)
export const placeMinesAndCalculate = (board, firstR, firstC, totalMines) => {
  let minesPlaced = 0;
  let attempts = 0;
  const maxAttempts = totalMines * 100; // 무한 루프 방지

  while (minesPlaced < totalMines && attempts < maxAttempts) {
    attempts++;
    const r = Math.floor(Math.random() * GAME_CONFIG.ROWS);
    const c = Math.floor(Math.random() * GAME_CONFIG.COLS);
    
    if (board[r][c].isMine) continue;
    // 첫 클릭 위치와 주변 8칸에는 지뢰 생성 금지
    if (Math.abs(r - firstR) <= 1 && Math.abs(c - firstC) <= 1) continue;

    let canPlace = true;
    
    // 💡 [핵심 1] 룰 유연화: 시도 횟수가 절반을 넘어가면 공간이 없다는 뜻이므로 Max 5 룰을 무시합니다.
    const isStrictRule = attempts < (maxAttempts / 2);

    if (isStrictRule) {
      for (let [dr, dc] of DIRECTIONS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < GAME_CONFIG.ROWS && nc >= 0 && nc < GAME_CONFIG.COLS) {
          if (board[nr][nc].neighborMines >= 5) {
            canPlace = false;
            break;
          }
        }
      }
    }

    if (canPlace) {
      board[r][c].isMine = true;
      for (let [dr, dc] of DIRECTIONS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < GAME_CONFIG.ROWS && nc >= 0 && nc < GAME_CONFIG.COLS) {
          board[nr][nc].neighborMines++;
        }
      }
      minesPlaced++;
    }
  }

  // 💡 [핵심 2] 실제로 보드에 깔린 진짜 지뢰 갯수를 반환하여 UI 카운터와 동기화합니다!
  return minesPlaced;
};

export const revealEmptyCells = (board, startR, startC) => {
  const stack = [[startR, startC]];
  while (stack.length > 0) {
    const [r, c] = stack.pop();
    DIRECTIONS.forEach(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < GAME_CONFIG.ROWS && nc >= 0 && nc < GAME_CONFIG.COLS) {
        const cell = board[nr][nc];
        if (!cell.isRevealed && !cell.isFlagged && !cell.isMine) {
          cell.isRevealed = true;
          if (cell.neighborMines === 0) {
            stack.push([nr, nc]);
          }
        }
      }
    });
  }
};

export const checkWinCondition = (board) => {
  let unrevealedSafeCells = 0;
  for (let r = 0; r < GAME_CONFIG.ROWS; r++) {
    for (let c = 0; c < GAME_CONFIG.COLS; c++) {
      if (!board[r][c].isMine && !board[r][c].isRevealed) {
        unrevealedSafeCells++;
      }
    }
  }
  return unrevealedSafeCells === 0;
};
