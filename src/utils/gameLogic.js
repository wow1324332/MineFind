// src/utils/gameLogic.js

export const getMineCount = (difficulty) => {
  switch (difficulty) {
    case 'Easy': return 10;
    case 'Normal': return Math.floor(Math.random() * (14 - 11 + 1)) + 11; 
    case 'Hard': return Math.floor(Math.random() * (19 - 15 + 1)) + 15;   
    case 'Expert': return Math.floor(Math.random() * (24 - 20 + 1)) + 20; 
    case 'Hell': return Math.floor(Math.random() * (30 - 25 + 1)) + 25;   
    default: return 12;
  }
};

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

// 💡 맵 레이아웃(layout)을 받아 그에 맞는 다이내믹 보드를 생성!
export const createEmptyBoard = (layout) => {
  const rows = layout.length;
  const cols = layout[0].length;
  
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      r, c,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0,
      // 💡 0이면 가짜(투명) 타일, 1이면 진짜 타일로 셋팅
      isPlayable: layout[r][c] === 1 
    }))
  );
};

export const cloneBoard = (board) => board.map(row => row.map(cell => ({ ...cell })));

export const placeMinesAndCalculate = (board, firstR, firstC, totalMines) => {
  const rows = board.length;
  const cols = board[0].length;
  let minesPlaced = 0;
  let attempts = 0;
  const maxAttempts = totalMines * 100; 

  while (minesPlaced < totalMines && attempts < maxAttempts) {
    attempts++;
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    
    // 💡 투명 타일이거나 이미 지뢰가 있으면 패스
    if (!board[r][c].isPlayable || board[r][c].isMine) continue;
    
    if (Math.abs(r - firstR) <= 1 && Math.abs(c - firstC) <= 1) continue;

    let canPlace = true;
    for (let [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        if (board[nr][nc].isPlayable && board[nr][nc].neighborMines >= 5) {
          canPlace = false;
          break;
        }
      }
    }

    if (canPlace) {
      board[r][c].isMine = true;
      for (let [dr, dc] of DIRECTIONS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          if (board[nr][nc].isPlayable) {
            board[nr][nc].neighborMines++;
          }
        }
      }
      minesPlaced++;
    }
  }
  return minesPlaced;
};

export const revealEmptyCells = (board, startR, startC) => {
  const rows = board.length;
  const cols = board[0].length;
  const stack = [[startR, startC]];
  
  while (stack.length > 0) {
    const [r, c] = stack.pop();
    DIRECTIONS.forEach(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const cell = board[nr][nc];
        // 💡 투명 타일은 건드리지 않음
        if (cell.isPlayable && !cell.isRevealed && !cell.isFlagged && !cell.isMine) {
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
  const rows = board.length;
  const cols = board[0].length;
  let unrevealedSafeCells = 0;
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // 💡 진짜 타일 중 지뢰가 아니면서 열리지 않은 타일이 있는지 체크
      if (board[r][c].isPlayable && !board[r][c].isMine && !board[r][c].isRevealed) {
        unrevealedSafeCells++;
      }
    }
  }
  return unrevealedSafeCells === 0;
};
