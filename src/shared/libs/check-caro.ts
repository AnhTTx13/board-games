export function CheckCaro(
  board: ('X' | 'O' | '_')[][],
  position: { x: number; y: number },
): 'X' | 'O' | '_' {
  const x = position.x,
    y = position.y;
  if (board[x][y] === '_') {
    return '_';
  }

  // check row
  let l = y, // left pointer
    r = y; // right pointer
  while (l >= 0) {
    if (l - 1 >= 0 && board[x][l - 1] === board[x][l]) {
      l--;
    } else {
      break;
    }
  }
  while (r < 12) {
    if (r + 1 < 12 && board[x][r + 1] === board[x][r]) {
      r++;
    } else {
      break;
    }
  }
  if (r - l + 1 >= 5) {
    return board[x][y];
  }

  // check column
  let u = x, // up pointer
    d = x; // down pointer
  while (u >= 0) {
    if (u - 1 >= 0 && board[u - 1][y] === board[u][y]) {
      u--;
    } else {
      break;
    }
  }
  while (d < 12) {
    if (d + 1 < 12 && board[d + 1][y] === board[d][y]) {
      d++;
    } else {
      break;
    }
  }
  if (d - u + 1 >= 5) {
    return board[x][y];
  }

  // check first diagonal
  let du1 = x, // diagonal-up pointer-1
    dd1 = x, // diagonal-down pointer-1
    dl1 = y, // diagonal-left pointer-1
    dr1 = y, // diagonal-right pointer-1
    di1 = 1; // diagonal's length
  while (du1 >= 0 && dl1 >= 0) {
    if (
      du1 - 1 >= 0 &&
      dl1 - 1 >= 0 &&
      board[du1 - 1][dl1 - 1] === board[du1][dl1]
    ) {
      di1++;
      du1--;
      dl1--;
    } else {
      break;
    }
  }
  while (dd1 < 12 && dr1 < 12) {
    if (
      dd1 + 1 < 12 &&
      dr1 + 1 < 12 &&
      board[dd1 + 1][dr1 + 1] === board[dd1][dr1]
    ) {
      di1++;
      dd1++;
      dr1++;
    } else {
      break;
    }
  }
  if (di1 >= 5) {
    return board[x][y];
  }

  // check second diagonal
  let du2 = x, // diagonal-up pointer-2
    dd2 = x, // diagonal-down pointer-2
    dl2 = y, // diagonal-left pointer-2
    dr2 = y, // diagonal-right pointer-2
    di2 = 1; // diagonal length
  while (du2 >= 0 && dr2 < 12) {
    if (
      du2 - 1 >= 0 &&
      dr2 + 1 < 12 &&
      board[du2 - 1][dr2 + 1] === board[du2][dr2]
    ) {
      di2++;
      du2--;
      dr2++;
    } else {
      break;
    }
  }
  while (dd2 < 12 && dl2 >= 0) {
    if (
      dd2 + 1 < 12 &&
      dl2 - 1 >= 0 &&
      board[dd2 + 1][dl2 - 1] === board[dd2][dl2]
    ) {
      di2++;
      dd2++;
      dl2--;
    } else {
      break;
    }
  }
  if (di2 >= 5) {
    return board[x][y];
  }

  return '_';
}
