const {
  indexHandler,
  incrHandler,
  logoutHandler,
  loginHandler,
} = require('../handlers/handlers');
const express = require('express');
const router = express.Router();

router.route('/').get(indexHandler);
router.route('/incr').post(incrHandler);
router.route('/logout').post(logoutHandler);
router.route('/login').post(loginHandler);
module.exports = router;
