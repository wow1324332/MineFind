export const GAME_CONFIG = {
  ROWS: 10,
  COLS: 8,
  MINES: 15,
};

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

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

// 💡 룰 교정: 숫자 5 초과 방지 및 실시간 주변 지뢰 계산 적용
export const placeMinesAndCalculate = (board, firstR, firstC) => {
  let minesPlaced = 0;
  let attempts = 0;
  const maxAttempts = GAME_CONFIG.MINES * 100; // 무한 루프 방지 안전장치

  while (minesPlaced < GAME_CONFIG.MINES && attempts < maxAttempts) {
    attempts++;
    const r = Math.floor(Math.random() * GAME_CONFIG.ROWS);
    const c = Math.floor(Math.random() * GAME_CONFIG.COLS);
    
    // 1. 이미 지뢰가 있거나, 첫 클릭 위치 및 그 주변(3x3)이면 건너뜀 (첫 클릭 시 안전 확보)
    if (board[r][c].isMine) continue;
    if (Math.abs(r - firstR) <= 1 && Math.abs(c - firstC) <= 1) continue;

    // 2. 숫자가 6 이상이 되는지 사전 검사 (Max 5 룰)
    let canPlace = true;
    for (let [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < GAME_CONFIG.ROWS && nc >= 0 && nc < GAME_CONFIG.COLS) {
        // 주변 칸 중 하나라도 이미 숫자가 5라면, 지뢰 설치 불가!
        if (board[nr][nc].neighborMines >= 5) {
          canPlace = false;
          break;
        }
      }
    }

    // 3. 검사 통과 시 지뢰 설치 및 주변 칸의 숫자 1씩 증가
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
