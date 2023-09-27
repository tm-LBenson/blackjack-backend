'use strict';
const { join } = require('path');
const currentNames = require('../userNameCache');
const { notifyUsers } = require('../socket');
function incrHandler(req, res) {
  const session = req.session;
  session.count = (session.count || 0) + 1;
  res.status(200).end('' + session.count);
}

function loginHandler(req, res, next) {
  try {
    const userName = req.body.username;
    if (!currentNames.hasOwnProperty(userName)) {
      currentNames[userName] = Date.now();

      notifyUsers();
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
  try {
    currentNames.deleteName(req.body.username);
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
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
