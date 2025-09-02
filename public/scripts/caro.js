const socket = io(undefined, {
  autoConnect: true,
});

let game = {
  id: -1,
  board: new Array(12).fill(new Array(12).fill("_")).map((row) => [...row]),
  current_turn: "_",
  o_player: "_",
  x_player: "_",
  room: "",
};

const onConnect = () => {
  console.log("Connected, socket id:", socket.id);

  const gameConnection = document.getElementById("caro-game-connection");
  gameConnection.innerHTML = `Connection: <span class="font-bold">Connected</span>`;

  const socketId = document.getElementById("caro-user-socket-id");
  socketId.innerHTML = `Socket id: <span class="font-bold">${socket.id}</span>`;

  const newMessage = document.createElement("p");
  newMessage.textContent = "You are connected";
  const gameMessages = document.getElementById("caro-game-messages");
  gameMessages.appendChild(newMessage);
};

const onDisconnect = () => {
  const gameConnection = document.getElementById("caro-game-connection");
  gameConnection.innerHTML = `Connection: <span class="font-bold">Disconnected</span>`;

  const socketId = document.getElementById("caro-user-socket-id");
  socketId.innerHTML = `Socket id: <span class="font-bold">_</span>`;

  const newMessage = document.createElement("p");
  newMessage.textContent = "You are disconnected";
  const gameMessages = document.getElementById("caro-game-messages");
  gameMessages.appendChild(newMessage);
};

const onMessage = (data) => {
  console.log(data);
  const newMessage = document.createElement("p");
  newMessage.textContent = data.message;
  const gameMessages = document.getElementById("caro-game-messages");
  gameMessages.appendChild(newMessage);
};

const onLiveGame = (data) => {
  console.log(data);
  game = data;

  const winnerDiv = document.getElementById("caro-winner");
  if (!winnerDiv.classList.contains("hidden"))
    winnerDiv.classList.add("hidden");

  const gameState = document.getElementById("caro-game-state");
  gameState.innerHTML = `Game state: <span class="font-bold">Started</span>`;

  const currentTurn = document.getElementById("caro-current-turn");
  currentTurn.innerHTML = `Current turn: <span class="font-bold">${game.current_turn}</span>`;

  let playerTurn = "X";
  if (game.o_player === socket.id) playerTurn = "O";
  const playerTurnElement = document.getElementById("caro-user-player-turn");
  playerTurnElement.innerHTML = `Player turn: <span class="font-bold">${playerTurn}</span>`;

  const roomInput = document.getElementById("caro-room-input");
  if (!roomInput.getAttribute("disabled")) {
    roomInput.setAttribute("disabled", true);
    roomInput.setAttribute(
      "title",
      "Cannot enter another room when on live-game",
    );
    roomInput.classList.add(
      "cursor-not-allowed",
      "text-gray-500",
      "border-gray-500",
    );
  }

  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 12; j++) {
      const square = document.getElementById(`caro-square-${i}-${j}`);
      if (game.board[i][j] === "_") {
        square.innerText = "";
      } else {
        square.innerText = game.board[i][j];
      }
    }
  }
};

const onGameEnd = (data) => {
  console.log(data);

  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 12; j++) {
      const square = document.getElementById(`caro-square-${i}-${j}`);
      if (data.game.board[i][j] === "_") {
        square.innerText = "";
      } else {
        square.innerText = data.game.board[i][j];
      }
    }
  }

  const nickname =
    document.getElementById("caro-user-nickname")?.textContent || "";
  socket.emit("leave-room", {
    room: game.room,
    nickname: nickname || "someone",
  });

  const winnerDiv = document.getElementById("caro-winner");
  winnerDiv.innerText = `${data.winner} IS WIN`;
  winnerDiv.classList.remove("hidden");

  const newMessage = document.createElement("p");
  newMessage.textContent = `${data.winner} is Winner`;
  const gameMessages = document.getElementById("caro-game-messages");
  gameMessages.appendChild(newMessage);

  const gameState = document.getElementById("caro-game-state");
  gameState.innerHTML = `Game state: <span class="font-bold">Ended</span>`;

  const roomInput = document.getElementById("caro-room-input");
  roomInput.value = "";
  roomInput.removeAttribute("disabled");
  roomInput.removeAttribute("title");
  roomInput.classList.remove(
    "cursor-not-allowed",
    "text-gray-500",
    "border-gray-500",
  );

  const currentTurn = document.getElementById("caro-current-turn");
  currentTurn.innerHTML = `Current turn: <span class="font-bold">_</span>`;
};

socket.on("connect", onConnect);
socket.on("disconnect", onDisconnect);
socket.on("message", onMessage);
socket.on("live-game", onLiveGame);
socket.on("game-end", onGameEnd);

const handleJoinRoom = () => {
  const roomName = document.getElementById("caro-room-input").value;
  if (!roomName) {
    return alert("Enter room name before start");
  }
  const nickname =
    document.getElementById("caro-user-nickname")?.textContent || "";
  socket.emit("join-room", {
    room: roomName,
    nickname: nickname || "someone",
  });
};

const handleLeaveRoom = () => {
  const roomName = document.getElementById("caro-room-input").value;
  const nickname =
    document.getElementById("caro-user-nickname")?.textContent || "";
  if (roomName) {
    socket.emit("leave-room", {
      room: roomName,
      nickname: nickname || "someone",
    });
  }
};

const handleCaroMove = (x, y) => {
  if (game.id === -1) {
    return alert("The game has not started yet");
  }
  let playerTurn = "X";
  if (game.o_player === socket.id) playerTurn = "O";
  if (playerTurn !== game.current_turn) {
    return alert("Not your turn");
  }
  socket.emit("game-move", {
    room: game.room,
    position: { x, y },
    gameId: game.id,
  });
};
