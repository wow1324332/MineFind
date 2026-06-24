export const GAME_CONFIG = {
  ROWS: 10,
  COLS: 8,
  MINES: 10,
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

export const placeMinesAndCalculate = (board, firstR, firstC) => {
  let minesPlaced = 0;
  while (minesPlaced < GAME_CONFIG.MINES) {
    const r = Math.floor(Math.random() * GAME_CONFIG.ROWS);
    const c = Math.floor(Math.random() * GAME_CONFIG.COLS);
    
    if (!board[r][c].isMine && !(r === firstR && c === firstC)) {
      board[r][c].isMine = true;
      minesPlaced++;
    }
  }

  for (let r = 0; r < GAME_CONFIG.ROWS; r++) {
    for (let c = 0; c < GAME_CONFIG.COLS; c++) {
      if (!board[r][c].isMine) {
        let count = 0;
        DIRECTIONS.forEach(([dr, dc]) => {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < GAME_CONFIG.ROWS && nc >= 0 && nc < GAME_CONFIG.COLS && board[nr][nc].isMine) {
            count++;
          }
        });
        board[r][c].neighborMines = count;
      }
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
