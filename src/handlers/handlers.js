const { join } = require('path');
const { io, doIoStuff } = require('../socket');
const { currentNames, deleteName } = require('../userNameCache');

function incrHandler(req, res) {
  const session = req.session;
  session.count = (session.count || 0) + 1;
  res.status(200).end('' + session.count);

  doIoStuff(session);
}

function loginHandler(req, res, next) {
  try {
    console.log(req.body);
    const userName = req.body.username;
    if (!currentNames.hasOwnProperty(userName)) {
      currentNames[userName] = Date.now();
      res
        .status(200)
        .json({ success: true, message: 'Logged in successfully.' });
    } else {
      res
        .status(200)
        .json({ success: false, message: 'Username already taken.' });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
}

function logoutHandler(req, res) {
  const sessionId = req.session.id;
  req.session.destroy(() => {
    // disconnect all Socket.IO connections linked to this session ID
    io.in(sessionId).disconnectSockets();
    deleteName(req.body.username);
    res.status(204).end();
  });
}

function indexHandler(req, res) {
  res.sendFile(join(__dirname + '/../public', 'index.html'));
}

module.exports = {
  indexHandler,
  logoutHandler,
  incrHandler,
  loginHandler,
};
