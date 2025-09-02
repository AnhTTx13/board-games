type TBallColor = "RED" | "GREEN" | "BLUE" | "PURPLE" | "YELLOW"

type TBallSize = "none" | "small" | "big"

type TPosition = { x: number; y: number }

type TSquare = {
  ballColor: TBallColor
  ballSize: TBallSize
}

const BallColors: TBallColor[] = ["RED", "GREEN", "BLUE", "PURPLE", "YELLOW"]

function threeRandomColor(): TBallColor[] {
  const result: TBallColor[] = []
  for (let i = 0; i < 3; i++) {
    let idx = Math.floor(Math.random() * 5)
    result.push(BallColors[idx])
  }
  return result
}

function getEmptyPositions(board: TSquare[][]): TPosition[] {
  let emptyPositions: TPosition[] = []

  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      if (board[x][y].ballSize === "none") {
        emptyPositions.push({ x, y })
      }
    }
  }

  return emptyPositions
}

function threeRandomEmptyPositions(emptyPositions: TPosition[]): TPosition[] {
  if (emptyPositions.length <= 3) {
    return emptyPositions
  }
  const result: TPosition[] = []
  const visitedIdx = new Array<boolean>(emptyPositions.length)
  for (let i = 0; i < 3; i++) {
    let idx = Math.floor(Math.random() * emptyPositions.length)
    while (visitedIdx[idx]) {
      idx = Math.floor(Math.random() * emptyPositions.length)
    }
    result.push(emptyPositions[idx])
    visitedIdx[idx] = true
  }

  return result
}

function explode(board: TSquare[][], ...positions: TPosition[]): TSquare[][] {
  const result: TSquare[][] = []
  for (let i = 0; i < 9; i++) {
    let row = board[i]
    result.push([...row])
  }

  for (let pos of positions) {
    let x = pos.x,
      y = pos.y

    // check row
    let l = y,
      r = y
    while (l - 1 >= 0) {
      if (
        board[x][l - 1].ballSize === "big" &&
        board[x][l - 1].ballColor === board[x][l].ballColor
      ) {
        l--
      } else {
        break
      }
    }
    while (r + 1 < 9) {
      if (
        board[x][r + 1].ballSize === "big" &&
        board[x][r + 1].ballColor === board[x][r].ballColor
      ) {
        r++
      } else {
        break
      }
    }

    // if has a ball chain of same color with length >= 5 on line x, delete all those balls
    if (r - l + 1 >= 5) {
      for (let j = l; j <= r; j++) {
        result[x][j].ballSize = "none"
      }
    }

    // check colum
    let u = x,
      d = x
    while (u - 1 >= 0) {
      if (
        board[u - 1][y].ballSize === "big" &&
        board[u - 1][y].ballColor === board[u][y].ballColor
      ) {
        u--
      } else {
        break
      }
    }
    while (d + 1 < 9) {
      if (
        board[d + 1][y].ballSize === "big" &&
        board[d + 1][y].ballColor === board[d][y].ballColor
      ) {
        d++
      } else {
        break
      }
    }
    // if has a ball chain of same color with length >= 5 on column y, delete all those balls
    if (d - u + 1 >= 5) {
      for (let i = u; i <= d; i++) {
        result[i][y].ballSize = "none"
      }
    }

    // check diagonal 1
    let du1 = x, // diagonal-up pointer
      dd1 = x, // diagonal-down pointer
      dl1 = y, // diagonal-left pointer
      dr1 = y, // diagonal-right pointer
      di1 = 1
    while (du1 - 1 >= 0 && dl1 - 1 >= 0) {
      if (
        board[du1 - 1][dl1 - 1].ballSize === "big" &&
        board[du1 - 1][dl1 - 1].ballColor === board[du1][dl1].ballColor
      ) {
        du1--
        dl1--
        di1++
      } else {
        break
      }
    }
    while (dd1 + 1 < 9 && dr1 + 1 < 9) {
      if (
        board[dd1 + 1][dr1 + 1].ballSize === "big" &&
        board[dd1 + 1][dr1 + 1].ballColor === board[dd1][dr1].ballColor
      ) {
        dd1++
        dr1++
        di1++
      } else {
        break
      }
    }
    // if has a ball chain of same color with length >= 5 on diagonal 1, delete all those balls
    if (di1 >= 5) {
      for (let i = du1, j = dl1; i <= dd1 && j <= dr1; i++, j++) {
        result[i][j].ballSize = "none"
      }
    }

    // check diagnal 2
    let du2 = x, // diagonal-up pointer
      dd2 = x, // diagonal-down pointer
      dl2 = y, // diagonal-left pointer
      dr2 = y, // diagonal-right pointer
      di2 = 1
    while (du2 - 1 >= 0 && dr2 + 1 < 9) {
      if (
        board[du2 - 1][dr2 + 1].ballSize === "big" &&
        board[du2 - 1][dr2 + 1].ballColor === board[du2][dr2].ballColor
      ) {
        du2--
        dr2++
        di2++
      } else {
        break
      }
    }
    while (dd2 + 1 < 9 && dl2 - 1 >= 0) {
      if (
        board[dd2 + 1][dl2 - 1].ballSize === "big" &&
        board[dd2 + 1][dl2 - 1].ballColor === board[dd2][dl2].ballColor
      ) {
        dd2++
        dl2--
        di2++
      } else {
        break
      }
    }
    // if has a ball chain of same color with length >= 5 on diagonal 1, delete all those balls
    if (di2 >= 5) {
      for (let i = du2, j = dr2; i <= dd2 && j >= dl2; i++, j--) {
        result[i][j].ballSize = "none"
      }
    }
  }

  return result
}

function newBoardData(): TSquare[][] {
  const board: TSquare[][] = []
  for (let i = 0; i < 9; i++) {
    let row: TSquare[] = []
    for (let j = 0; j < 9; j++) {
      row.push({ ballSize: "none", ballColor: "RED" })
    }
    board.push(row)
  }
  const colors: TBallColor[] = ["RED", "GREEN", "BLUE", "PURPLE", "YELLOW"]

  // new 10 balls, 7 big balls, 3 small balls

  // 7 random colors for big balls
  const bigBallColor: TBallColor[] = []
  for (let i = 0; i < 7; i++) {
    let idx = Math.floor(Math.random() * 5)
    bigBallColor.push(colors[idx])
  }
  // 3 random colors for small balls
  const smallBallColor: TBallColor[] = []
  for (let i = 0; i < 3; i++) {
    let idx = Math.floor(Math.random() * 5)
    smallBallColor.push(colors[idx])
  }

  const visitedPos = new Array<boolean>(81).fill(false)
  for (let i = 0; i < 7; i++) {
    let idx = Math.floor(Math.random() * 81)
    while (visitedPos[idx]) {
      idx = Math.floor(Math.random() * 81)
    }
    visitedPos[idx] = true
    let x = Math.floor(idx / 9),
      y = idx % 9
    board[x][y].ballColor = bigBallColor[i]
    board[x][y].ballSize = "big"
  }
  for (let i = 0; i < 3; i++) {
    let idx = Math.floor(Math.random() * 81)
    while (visitedPos[idx]) {
      idx = Math.floor(Math.random() * 81)
    }
    visitedPos[idx] = true
    let x = Math.floor(idx / 9),
      y = idx % 9
    board[x][y].ballColor = smallBallColor[i]
    board[x][y].ballSize = "small"
  }

  return board
}

function checkMove(board: TSquare[][], startPos: TPosition, endPos: TPosition): boolean {
  const visited: boolean[][] = []
  for (let i = 0; i < 9; i++) {
    visited.push(new Array<boolean>(9).fill(false))
  }
  visited[startPos.x][startPos.y] = true
  let queue: TPosition[] = [startPos]
  while (queue.length > 0) {
    let newQueue: TPosition[] = []
    for (let pos of queue) {
      let x = pos.x,
        y = pos.y
      if (x - 1 >= 0 && board[x - 1][y].ballSize !== "big" && !visited[x - 1][y]) {
        visited[x - 1][y] = true
        newQueue.push({ x: x - 1, y })
        if (visited[endPos.x][endPos.y]) return true
      }
      if (x + 1 < 9 && board[x + 1][y].ballSize !== "big" && !visited[x + 1][y]) {
        visited[x + 1][y] = true
        newQueue.push({ x: x + 1, y })
        if (visited[endPos.x][endPos.y]) return true
      }
      if (y - 1 >= 0 && board[x][y - 1].ballSize !== "big" && !visited[x][y - 1]) {
        visited[x][y - 1] = true
        newQueue.push({ x, y: y - 1 })
        if (visited[endPos.x][endPos.y]) return true
      }
      if (y + 1 < 9 && board[x][y + 1].ballSize !== "big" && !visited[x][y + 1]) {
        visited[x][y + 1] = true
        newQueue.push({ x, y: y + 1 })
        if (visited[endPos.x][endPos.y]) return true
      }
    }
    queue = newQueue
  }
  return visited[endPos.x][endPos.y]
}

function getSmallBallPos(board: TSquare[][]): TPosition[] {
  const result: TPosition[] = []
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j].ballSize === "small") {
        result.push({ x: i, y: j })
      }
    }
  }
  return result
}

function processBoard(board: TSquare[][], endPos: TPosition): TSquare[][] {
  const emptyPos = getEmptyPositions(board)
  const smallBallPos = getSmallBallPos(board)
  if (smallBallPos.length === 2) {
    // if end position is a small ball
    let idx = Math.floor(Math.random() * emptyPos.length)
    let x = emptyPos[idx].x,
      y = emptyPos[idx].y
    emptyPos.splice(idx, 1)
    board[x][y].ballSize = "big"
    board[x][y].ballColor = BallColors[Math.floor(Math.random() * BallColors.length)]
  }
  for (let pos of smallBallPos) {
    board[pos.x][pos.y].ballSize = "big"
  }

  const result = explode(board, endPos, ...smallBallPos)
  const threeNewPos = threeRandomEmptyPositions(emptyPos)
  const threeNewColor = threeRandomColor()
  for (let i in threeNewPos) {
    let pos = threeNewPos[i]
    result[pos.x][pos.y].ballColor = threeNewColor[i]
    result[pos.x][pos.y].ballSize = "small"
  }

  return result
}

function checkBest(board: TSquare[][], startPos: TPosition, endPos: TPosition): boolean {
  let color = board[startPos.x][startPos.y].ballColor
  let x = endPos.x,
    y = endPos.y

  // check row
  let l = y,
    r = y
  while (l - 1 >= 0) {
    if (x === startPos.x && l - 1 === startPos.y) {
      break
    }
    if (board[x][l - 1].ballSize === "big" && board[x][l - 1].ballColor === color) {
      l--
    } else {
      break
    }
  }
  while (r + 1 < 9) {
    if (x === startPos.x && r + 1 === startPos.y) {
      break
    }
    if (board[x][r + 1].ballSize === "big" && board[x][r + 1].ballColor === color) {
      r++
    } else {
      break
    }
  }
  if (
    r - l + 1 >= 5 &&
    !(startPos.x === endPos.x && l <= startPos.y && startPos.y <= r) // the case start and end in the same row
  ) {
    return true
  }

  // check colum
  let u = x,
    d = x
  while (u - 1 >= 0) {
    if (u - 1 === startPos.x && y === startPos.y) {
      break
    }
    if (board[u - 1][y].ballSize === "big" && board[u - 1][y].ballColor === color) {
      u--
    } else {
      break
    }
  }
  while (d + 1 < 9) {
    if (d + 1 === startPos.x && y === startPos.y) {
      break
    }
    if (board[d + 1][y].ballSize === "big" && board[d + 1][y].ballColor === color) {
      d++
    } else {
      break
    }
  }
  if (
    d - u + 1 >= 5 &&
    !(startPos.y === endPos.y && u <= startPos.y && startPos.y <= d) // the case start and end in the same column
  ) {
    return true
  }

  // check diagonal 1
  let du1 = x, // diagonal-up pointer
    dd1 = x, // diagonal-down pointer
    dl1 = y, // diagonal-left pointer
    dr1 = y, // diagonal-right pointer
    di1 = 1
  while (du1 - 1 >= 0 && dl1 - 1 >= 0) {
    if (du1 - 1 === startPos.x && dl1 - 1 === startPos.y) {
      break
    }
    if (
      board[du1 - 1][dl1 - 1].ballSize === "big" &&
      board[du1 - 1][dl1 - 1].ballColor === color
    ) {
      du1--
      dl1--
      di1++
    } else {
      break
    }
  }
  while (dd1 + 1 < 9 && dr1 + 1 < 9) {
    if (dd1 + 1 === startPos.x && dr1 + 1 === startPos.y) {
      break
    }
    if (
      board[dd1 + 1][dr1 + 1].ballSize === "big" &&
      board[dd1 + 1][dr1 + 1].ballColor === color
    ) {
      dd1++
      dr1++
      di1++
    } else {
      break
    }
  }
  if (di1 >= 5) {
    return true
  }

  // check diagnal 2
  let du2 = x, // diagonal-up pointer
    dd2 = x, // diagonal-down pointer
    dl2 = y, // diagonal-left pointer
    dr2 = y, // diagonal-right pointer
    di2 = 1
  while (du2 - 1 >= 0 && dr2 + 1 < 9) {
    if (du2 - 1 === startPos.x && dr2 + 1 === startPos.y) {
      break
    }
    if (
      board[du2 - 1][dr2 + 1].ballSize === "big" &&
      board[du2 - 1][dr2 + 1].ballColor === color
    ) {
      du2--
      dr2++
      di2++
    } else {
      break
    }
  }
  while (dd2 + 1 < 9 && dl2 - 1 >= 0) {
    if (dd2 + 1 === startPos.x && dl2 - 1 === startPos.y) {
      break
    }
    if (
      board[dd2 + 1][dl2 - 1].ballSize === "big" &&
      board[dd2 + 1][dl2 - 1].ballColor === color
    ) {
      dd2++
      dl2--
      di2++
    } else {
      break
    }
  }
  if (di2 >= 5) {
    return true
  }
  return false
}

function checkGood(board: TSquare[][], startPos: TPosition, endPos: TPosition): boolean {
  let color = board[startPos.x][startPos.y].ballColor
  let x = endPos.x,
    y = endPos.y

  // check row
  let l = y,
    r = y
  while (l - 1 >= 0) {
    if (x === startPos.x && l - 1 === startPos.y) {
      break
    }
    if (
      board[x][l - 1].ballSize === "none" ||
      (board[x][l - 1].ballSize === "big" && board[x][l - 1].ballColor === color)
    ) {
      l--
    } else {
      break
    }
  }
  while (r + 1 < 9) {
    if (x === startPos.x && r + 1 === startPos.y) {
      break
    }
    if (
      board[x][r + 1].ballSize === "none" ||
      (board[x][r + 1].ballSize === "big" && board[x][r + 1].ballColor === color)
    ) {
      r++
    } else {
      break
    }
  }
  if (r - l + 1 >= 5 && !(startPos.x === endPos.x && l <= startPos.y && startPos.y <= r)) {
    return true
  }

  // check colum
  let u = x,
    d = x
  while (u - 1 >= 0) {
    if (
      board[u - 1][y].ballSize === "none" ||
      (startPos.y === endPos.y &&
        board[u - 1][y].ballSize === "big" &&
        board[u - 1][y].ballColor === color)
    ) {
      u--
    } else {
      break
    }
  }
  while (d + 1 < 9) {
    if (
      board[d + 1][y].ballSize === "none" ||
      (board[d + 1][y].ballSize === "big" && board[d + 1][y].ballColor === color)
    ) {
      d++
    } else {
      break
    }
  }
  if (d - u + 1 >= 5 && !(u <= startPos.y && startPos.y <= d)) {
    return true
  }

  // check diagonal 1
  let du1 = x, // diagonal-up pointer
    dd1 = x, // diagonal-down pointer
    dl1 = y, // diagonal-left pointer
    dr1 = y, // diagonal-right pointer
    di1 = 1
  while (du1 - 1 >= 0 && dl1 - 1 >= 0) {
    if (du1 - 1 === startPos.x && dl1 - 1 === startPos.y) {
      break
    }
    if (
      board[du1 - 1][dl1 - 1].ballSize === "none" ||
      (board[du1 - 1][dl1 - 1].ballSize === "big" &&
        board[du1 - 1][dl1 - 1].ballColor === color)
    ) {
      du1--
      dl1--
      di1++
    } else {
      break
    }
  }
  while (dd1 + 1 < 9 && dr1 + 1 < 9) {
    if (dd1 + 1 === startPos.x && dr1 + 1 === startPos.y) {
      break
    }
    if (
      board[dd1 + 1][dr1 + 1].ballSize === "none" ||
      (board[dd1 + 1][dr1 + 1].ballSize === "big" &&
        board[dd1 + 1][dr1 + 1].ballColor === color)
    ) {
      dd1++
      dr1++
      di1++
    } else {
      break
    }
  }
  if (di1 >= 5) {
    return true
  }

  // check diagnal 2
  let du2 = x, // diagonal-up pointer
    dd2 = x, // diagonal-down pointer
    dl2 = y, // diagonal-left pointer
    dr2 = y, // diagonal-right pointer
    di2 = 1
  while (du2 - 1 >= 0 && dr2 + 1 < 9) {
    if (du2 - 1 === startPos.x && dr2 + 1 === startPos.y) {
      break
    }
    if (
      board[du2 - 1][dr2 + 1].ballSize === "none" ||
      (board[du2 - 1][dr2 + 1].ballSize === "big" &&
        board[du2 - 1][dr2 + 1].ballColor === color)
    ) {
      du2--
      dr2++
      di2++
    } else {
      break
    }
  }
  while (dd2 + 1 < 9 && dl2 - 1 >= 0) {
    if (dd2 + 1 === startPos.x && dl2 - 1 === startPos.y) {
      break
    }
    if (
      board[dd2 + 1][dl2 - 1].ballSize === "none" ||
      (board[dd2 + 1][dl2 - 1].ballSize === "big" &&
        board[dd2 + 1][dl2 - 1].ballColor === color)
    ) {
      dd2++
      dl2--
      di2++
    } else {
      break
    }
  }
  if (di2 >= 5) {
    return true
  }
  return false
}

function getMoveableAdjacents(board: TSquare[][], pos: TPosition): TPosition[] {
  const visited = new Array(9).fill(new Array<boolean>(9).fill(false)).map((row) => [...row])
  visited[pos.x][pos.y] = true
  const queue: TPosition[] = [pos]
  const result: TPosition[] = []
  for (let i = 0; i < queue.length; i++) {
    let x = queue[i].x,
      y = queue[i].y
    if (x - 1 >= 0 && board[x - 1][y].ballSize !== "big" && !visited[x - 1][y]) {
      visited[x - 1][y] = true
      queue.push({ x: x - 1, y: y })
      result.push({ x: x - 1, y: y })
    }
    if (x + 1 < 9 && board[x + 1][y].ballSize !== "big" && !visited[x + 1][y]) {
      visited[x + 1][y] = true
      queue.push({ x: x + 1, y: y })
      result.push({ x: x + 1, y: y })
    }
    if (y - 1 >= 0 && board[x][y - 1].ballSize !== "big" && !visited[x][y - 1]) {
      visited[x][y - 1] = true
      queue.push({ x, y: y - 1 })
      result.push({ x, y: y - 1 })
    }
    if (y + 1 < 9 && board[x][y + 1].ballSize !== "big" && !visited[x][y + 1]) {
      visited[x][y + 1] = true
      queue.push({ x, y: y + 1 })
      result.push({ x, y: y + 1 })
    }
  }
  return result
}

function getHint(board: TSquare[][]): [TPosition, TPosition] {
  // best case (explode)
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j].ballSize === "big") {
        const cur: TPosition = { x: i, y: j }
        const adjacents = getMoveableAdjacents(board, cur)
        for (let x of adjacents) {
          if (checkBest(board, cur, x)) {
            return [cur, x]
          }
        }
      }
    }
  }
  // good case (can explode)
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j].ballSize === "big") {
        const cur: TPosition = { x: i, y: j }
        const adjacents = getMoveableAdjacents(board, cur)
        for (let x of adjacents) {
          if (checkGood(board, cur, x)) {
            return [cur, x]
          }
        }
      }
    }
  }
  // worst case
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j].ballSize === "big") {
        const cur: TPosition = { x: i, y: j }
        const adjacents = getMoveableAdjacents(board, cur)
        for (let x of adjacents) {
          return [cur, x]
        }
      }
    }
  }
  return [
    { x: -1, y: -1 },
    { x: -1, y: -1 },
  ]
}

function checkGameEnded(board: TSquare[][]): boolean {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j].ballSize === "none") {
        return false
      }
    }
  }
  return true
}

function findMinPath(board: TSquare[][], startPos: TPosition, endPos: TPosition): TPosition[] {
  const prevMove: (TPosition | null)[][] = []
  for (let i = 0; i < 9; i++) {
    const row = [...new Array<null>(9).fill(null)]
    prevMove.push(row)
  }
  let q: TPosition[] = [{ ...startPos }]
  while (q.length > 0) {
    let qNew: TPosition[] = []
    for (let p of q) {
      let x = p.x,
        y = p.y
      if (x + 1 < 9 && prevMove[x + 1][y] === null && board[x + 1][y].ballSize !== "big") {
        qNew.push({ x: x + 1, y })
        prevMove[x + 1][y] = { x, y }
      }
      if (y + 1 < 9 && prevMove[x][y + 1] === null && board[x][y + 1].ballSize !== "big") {
        qNew.push({ x, y: y + 1 })
        prevMove[x][y + 1] = { x, y }
      }
      if (x - 1 >= 0 && prevMove[x - 1][y] === null && board[x - 1][y].ballSize !== "big") {
        qNew.push({ x: x - 1, y })
        prevMove[x - 1][y] = { x, y }
      }
      if (y - 1 >= 0 && prevMove[x][y - 1] === null && board[x][y - 1].ballSize !== "big") {
        qNew.push({ x, y: y - 1 })
        prevMove[x][y - 1] = { x, y }
      }
    }
    q = qNew
  }
  const path: TPosition[] = [] // path is an array of turn positions
  let cur = prevMove[endPos.x][endPos.y]
  let next = { ...endPos }
  while (cur !== null && !(cur.x === startPos.x && cur.y === startPos.y)) {
    let prev = prevMove[cur.x][cur.y]!
    if (prev.x !== next.x && prev.y !== next.y) {
      // cur is a turn postion
      path.push({ ...cur })
    }
    next = cur
    cur = prev
  }
  return path.reverse()
}
