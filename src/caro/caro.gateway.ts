import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { CheckCaro } from 'src/shared/libs/check-caro';

type LiveGame = {
  id: number;
  x_player: string;
  o_player: string;
  current_turn: 'X' | 'O';
  room: string;
  board: ('X' | 'O' | '_')[][];
};

@WebSocketGateway({ cors: true })
export class CaroGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  Games: LiveGame[] = [];

  @WebSocketServer() io: Server;

  afterInit() {
    console.log('WebSocket gateway has been initialized');
  }
  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`\n${client.id} connected`);
    console.log(`Number of connected clients: ${this.io.sockets.sockets.size}`);
  }
  handleDisconnect(@ConnectedSocket() client: Socket) {
    for (let room of client.rooms) {
      client.leave(room);
      this.io
        .to(room)
        .emit('message', { message: `${client.id} has left the room` });
    }
    console.log(`\n${client.id} disconnected`);
    console.log(`Number of connected clients: ${this.io.sockets.sockets.size}`);
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('room') room: string,
    @MessageBody('nickname') nickname: string,
  ) {
    if (!room) {
      return;
    }

    // ensure that a room can only has atmost 2 clients
    let roomSize = this.io.sockets.adapter.rooms.get(room)?.size || 0;
    if (roomSize >= 2) {
      return this.io
        .to(client.id)
        .emit('message', { message: 'Room has been filled' });
    }

    // ensure that a person can be in only one room at a time
    for (let r of client.rooms) {
      if (r !== client.id) {
        client.leave(r);
      }
    }
    client.join(room);
    roomSize++;

    this.io.to(room).emit('message', {
      message: `${nickname ?? 'someone'}(${client.id}) has joined the room`,
    });

    if (roomSize === 2) {
      const clientSet = this.io.sockets.adapter.rooms.get(room);
      if (!clientSet) {
        return this.io.to(room).emit('message', {
          message: 'Something went wrong, try later',
        });
      }
      const clients = Array.from(clientSet);
      const newGame: LiveGame = {
        id: this.Games.length,
        room: room,
        x_player: clients[0],
        o_player: clients[1],
        current_turn: 'X',
        board: new Array(12)
          .fill(new Array(12).fill('_'))
          .map((row) => [...row]),
      };
      this.Games.push(newGame);
      this.io.to(room).emit('message', {
        message: 'Game has been started',
      });
      return this.io.to(room).emit('live-game', newGame);
    }
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('room') room: string,
    @MessageBody('nickname') nickname: string,
  ) {
    if (!room) {
      return;
    }
    if (!client.rooms.has(room)) {
      return this.io
        .to(client.id)
        .emit('message', { message: 'You are not in that room' });
    }
    client.leave(room);
    this.io
      .to(client.id)
      .emit('message', { message: 'You have left the room' });
    return this.io.to(room).emit('message', {
      message: `${nickname ?? 'someone'}(${client.id}) has left the room`,
    });
  }
  @SubscribeMessage('game-move')
  async handleGameMove(
    @ConnectedSocket() client: Socket,
    @MessageBody('room') room: string,
    @MessageBody('gameId') gameId: number,
    @MessageBody('position') position: { x: number; y: number },
  ) {
    if (!room || !position || gameId === -1 || gameId === undefined) {
      return;
    }
    if (!client.rooms.has(room)) {
      return this.io
        .to(client.id)
        .emit('message', { message: 'You are not in that room' });
    }
    let roomSize = this.io.sockets.adapter.rooms.get(room)?.size || 0;
    if (roomSize < 2) {
      return this.io
        .to(client.id)
        .emit('message', { message: 'The game has not started yet' });
    }
    const game = this.Games[gameId];
    if (!game) {
      return this.io
        .to(client.id)
        .emit('message', { message: 'Game not found' });
    }
    if (client.id !== game.o_player && client.id !== game.x_player) {
      return this.io
        .to(client.id)
        .emit('message', { message: 'Game not found' });
    }
    let player = 'X';
    if (game.o_player === client.id) {
      player = 'O';
    }
    if (player !== game.current_turn) {
      return this.io
        .to(client.id)
        .emit('message', { message: 'Not your turn' });
    }
    if (
      !game.board[position.x][position.y] ||
      game.board[position.x][position.y] !== '_'
    ) {
      return this.io.to(client.id).emit('message', { message: 'Invalid move' });
    }
    game.board[position.x][position.y] = player;
    if (game.current_turn === 'X') {
      game.current_turn = 'O';
    } else {
      game.current_turn = 'X';
    }
    const winner = CheckCaro(game.board, position);
    if (winner !== '_') {
      return this.io.to(room).emit('game-end', { winner: winner, game });
    }
    return this.io.to(room).emit('live-game', game);
  }
}
