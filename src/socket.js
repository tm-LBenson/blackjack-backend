'use strict';

const { currentNames, refreshName } = require('./userNameCache');

let io;
const startIo = (incomingIo) => {
  io = incomingIo || {};

  io.on('connection', (socket) => {
    console.log('IO server connection');

    socket.emit('proofOfLife', 'This is the proof of life');

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

    socket.on('JOIN', (userId) => {
      socket.join(userId);
      console.log(`Joined room: ${userId}`);
      socket.to(userId).emit('USER_CONNECTED', 'New user connected.');
      socket.emit('JOIN', userId);

      socket.on('TEST', (payload) => {
        const response = 'success';
        socket.to(userId).emit('TEST', response);
        socket.emit('TEST', '');
      });
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

function doIoStuff(session) {
  io.to(session.id).emit('current count', session.count);
}

module.exports = { startIo, io, doIoStuff };
