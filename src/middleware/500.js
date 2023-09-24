function error500(error, req, res, next) {
  res.status(500).send(error.message);
}

module.exports = error500;
