export const GAME_CONFIG = {
  ROWS: 10,
  COLS: 8,
};
// 💡 새롭게 추가할 난이도별 지뢰 계산 함수 (파일 상단 쪽에 추가)
export const getMineCount = (difficulty) => {
  switch(difficulty) {
    case 'Easy': return 10;
    case 'Normal': return Math.floor(Math.random() * (14 - 11 + 1)) + 11; // 11 ~ 14
    case 'Hard': return Math.floor(Math.random() * (19 - 15 + 1)) + 15;   // 15 ~ 19
    case 'Expert': return Math.floor(Math.random() * (24 - 20 + 1)) + 20; // 20 ~ 24
    case 'Hell': return Math.floor(Math.random() * (30 - 25 + 1)) + 25;   // 25 ~ 30
    default: return 15;
  }
};

// 💡 기존 지뢰 배치 함수 수정 (인자에 totalMines 추가 및 GAME_CONFIG.MINES 교체)
export const placeMinesAndCalculate = (board, firstR, firstC, totalMines) => {
  let minesPlaced = 0;
  let attempts = 0;
  const maxAttempts = totalMines * 100; // 무한 루프 방지 안전장치

  // GAME_CONFIG.MINES 대신 받아온 totalMines를 사용합니다.
  while (minesPlaced < totalMines && attempts < maxAttempts) {
    attempts++;
    const r = Math.floor(Math.random() * GAME_CONFIG.ROWS);
    const c = Math.floor(Math.random() * GAME_CONFIG.COLS);
    
    // (이하 기존과 동일)
    if (board[r][c].isMine) continue;
    if (Math.abs(r - firstR) <= 1 && Math.abs(c - firstC) <= 1) continue;

    let canPlace = true;
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
