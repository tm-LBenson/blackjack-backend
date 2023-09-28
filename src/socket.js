'use strict';

const GameState = require('./blackjack/GameState');
const ListOfGames = require('./blackjack/ListOfGames');
const currentNames = require('./userNameCache');

let connectedSockets = [];
const startIo = (incomingIo) => {
  const io = incomingIo || {};

  io.on('connection', (socket) => {
    console.log('IO server connection');
    connectedSockets.push(socket);
    if (currentNames.names) {
      socket.emit('USERS', [
        Object.keys(currentNames.names),
        ListOfGames.getAllGames(),
      ]);
    }

    socket.on('USERS', () => {
      console.log('sending user and game list');
      if (currentNames.names) {
        socket.emit('USERS', [
          Object.keys(currentNames.names),
          ListOfGames.getAllGames(),
        ]);
      }
    });

    socket.on('CHECK', (username) => {
      let matchFound = false;

      for (const listUsername in currentNames.names) {
        if (listUsername === username) {
          matchFound = true;

          break;
        }
      }
      socket.emit('CHECK', matchFound);
    });

    socket.on('HEARTBEAT', (username) => {
      currentNames.refreshName(username);
    });

    socket.on('CREATE', (payload) => {
      const [gameId, username] = payload;
      const gameState = new GameState();

      gameState.addPlayer(username);

      ListOfGames.addGame(gameId, gameState);
      socket.emit('USERS', [
        Object.keys(currentNames.names),
        ListOfGames.getAllGames(),
      ]);
      console.log(`Joined room: ${gameId}`);
      socket.to(gameId).emit('USER_CONNECTED', 'New user connected.');
      socket.emit('CREATE', gameId);

      io.emit('NEW_ROOM', ListOfGames.getAllGames());
    });

    socket.on('JOIN_GAME', (clientData) => {
      let { username, roomId } = clientData;
      if (!roomId) roomId = 1;
      ListOfGames.games[roomId].addPlayer(username);
      socket.join(+roomId);
      socket.to(+roomId).emit('JOIN_GAME', ListOfGames.games[roomId]);
    });

    socket.on('PLAY_GAME', (gameId) => {
      socket.join(+gameId);
      io.in(+gameId).emit('PLAY_GAME', ListOfGames.games[gameId]);
    });

    socket.on('HIT', (username) => {
      const gameId = ListOfGames.getGameIdForPlayer(username);
      const game = ListOfGames.games[gameId];
      game.players[username].addCard(game.deck.draw());
      io.emit('UPDATE_GAME', game); // Emit updated game state
    });

    socket.on('STAND', (username) => {
      const gameId = ListOfGames.getGameIdForPlayer(username);
      const game = ListOfGames.games[gameId];
      // Logic for when a user stands...
      io.emit('UPDATE_GAME', game);
    });

    socket.on('BET', (data) => {
      const { username, amount } = data;
      const gameId = ListOfGames.getGameIdForPlayer(username);
      const game = ListOfGames.games[gameId];
      game.players[username].placeBet(amount);
      io.emit('UPDATE_GAME', game);
    });

    socket.on('LEAVE', (username) => {
      const gameId = ListOfGames.getGameIdForPlayer(username);
      const game = ListOfGames.games[gameId];
      game.removePlayer(username);
      io.emit('UPDATE_GAME', game);
    });

    socket.on('READY', (username) => {
      const gameId = ListOfGames.getGameIdForPlayer(username);
      const game = ListOfGames.games[gameId];
      game.players[username].status = 'ready';
      game.startGame();
      io.emit('UPDATE_GAME', game);
    });

    socket.on('disconnect', () => {
      const index = connectedSockets.indexOf(socket);
      if (index !== -1) {
        connectedSockets.splice(index, 1); // Remove the socket from the array when disconnected
      }
    });
  });
};
function notifyUsers() {
  for (let socket of connectedSockets) {
    if (currentNames.names) {
      socket.emit('USERS', [
        Object.keys(currentNames.names),
        ListOfGames.getAllGames(),
      ]);
    }
  }
}

module.exports = { startIo, notifyUsers };
