'use strict';

const { currentNames, refreshName } = require('./userNameCache');

let io;
const startIo = (incomingIo) => {
  io = incomingIo || {};

  io.on('connection', (socket) => {
    console.log('IO server connection');

    socket.on('CHECK', (username) => {
      let matchFound = false;

      for (const listUsername in currentNames) {
        if (listUsername === username) {
          matchFound = true;
          console.log(matchFound);
          break;
        }
      }
      socket.emit('CHECK', matchFound);
    });

    socket.on('HEARTBEAT', (username) => {
      refreshName(username);
    });

    socket.on('USERS', () => {
      console.log('sending user list');
      socket.emit('USERS', Object.keys(currentNames));
     
    });

    socket.on('JOIN', (userId) => {
      socket.join(userId);
      console.log(`Joined room: ${userId}`);
      socket.to(userId).emit('USER_CONNECTED', 'New user connected.');
      socket.emit('JOIN', userId);
    });

    socket.on('GET_ROOMS', () => {
      let availableRooms = [];
      let rooms = io.sockets.adapter.rooms;

      for (const [key, value] of rooms.entries()) {
        if (!value.has(key)) {
          availableRooms.push(key);
        }
      }

      socket.emit('ROOMS', availableRooms);
    });
  });
};

module.exports = { startIo };
