const solveBoard = (board: number[][]): number[][] | null => {
  const cloneBoard: number[][] = board.map((row) => [...row]);
  const row = new Array(10)
      .fill(new Array(10).fill(false))
      .map((row) => [...row]),
    col = new Array(10).fill(new Array(10).fill(false)).map((row) => [...row]),
    box = new Array(10).fill(new Array(10).fill(false)).map((row) => [...row]);
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let b = Math.floor(i / 3) * 3 + Math.floor(j / 3);
      if (cloneBoard[i][j] !== 0) {
        if (
          row[i][cloneBoard[i][j]] ||
          col[j][cloneBoard[i][j]] ||
          box[b][cloneBoard[i][j]]
        )
          return null;
        row[i][cloneBoard[i][j]] = true;
        col[j][cloneBoard[i][j]] = true;
        box[b][cloneBoard[i][j]] = true;
      }
    }
  }
  let flag = false;
  const backtrack = (idx: number) => {
    if (idx > 80 || flag) {
      flag = true;
      return;
    }
    let i = Math.floor(idx / 9),
      j = idx % 9,
      b = Math.floor(i / 3) * 3 + Math.floor(j / 3);
    if (cloneBoard[i][j] === 0) {
      for (let x = 1; x <= 9; x++) {
        if (!row[i][x] && !col[j][x] && !box[b][x]) {
          cloneBoard[i][j] = x;
          row[i][x] = true;
          col[j][x] = true;
          box[b][x] = true;
          backtrack(idx + 1);
          if (flag) return;
          cloneBoard[i][j] = 0;
          row[i][x] = false;
          col[j][x] = false;
          box[b][x] = false;
        }
      }
    } else {
      backtrack(idx + 1);
    }
  };
  backtrack(0);
  if (!flag) {
    return null;
  }
  return cloneBoard;
};

const genSudoku = (hide: number): number[][] => {
  const board: number[][] = [];
  for (let i = 0; i < 9; i++) board.push(new Array(9).fill(0));

  const box1: number[] = Array.from({ length: 9 }, (_, i) => i).sort(
    () => Math.random() - 0.5,
  );
  let idx = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      board[i][j] = box1[idx];
      idx++;
    }
  }

  const box2: number[] = Array.from({ length: 9 }, (_, i) => i).sort(
    () => Math.random() - 0.5,
  );
  idx = 0;
  for (let i = 3; i < 6; i++) {
    for (let j = 3; j < 6; j++) {
      board[i][j] = box2[idx];
      idx++;
    }
  }

  const box3: number[] = Array.from({ length: 9 }, (_, i) => i).sort(
    () => Math.random() - 0.5,
  );
  idx = 0;
  for (let i = 6; i < 9; i++) {
    for (let j = 6; j < 9; j++) {
      board[i][j] = box3[idx];
      idx++;
    }
  }

  const solvedBoard = solveBoard(board)!;
  const hidePos: number[] = Array.from({ length: 81 }, (_, i) => i).sort(
    () => Math.random() - 0.5,
  );
  for (let i = 0; i < hide && i < 81; i++) {
    let x = hidePos[i] % 9,
      y = (hidePos[i] - x) / 9;
    solvedBoard[x][y] = 0;
  }

  return solvedBoard;
};

const hintSudoku = (board: number[][]): number[][] => {
  const solvedBoard = solveBoard(board);
  if (solvedBoard === null) {
    return board;
  }
  let wasHinted = false;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        if (!wasHinted) {
          wasHinted = true;
          continue;
        }
        solvedBoard[i][j] = 0;
      }
    }
  }
  return solvedBoard;
};
