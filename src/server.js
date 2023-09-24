const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const session = require('express-session');
const router = require('./routes/routes');
const { startIo } = require('./socket');
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});
const cors = require('cors');
const error500 = require('./middleware/500');
const sessionMiddleware = session({
  secret: 'changeit',
  resave: true,
  saveUninitialized: true,
});
app.use(cors());
app.use(express.json());
app.use(sessionMiddleware);
app.use(router);
app.use(error500);
startIo(io);

function serverStart() {
  server.listen(port, () => {
    console.log(`application is running at: http://localhost:${port}`);
  });
}

module.exports = { serverStart };
