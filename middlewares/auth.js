const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/unauthorized-err');
const { UnauthorizedMessage } = require('../utils/constants');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError(UnauthorizedMessage));
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new UnauthorizedError(UnauthorizedMessage));
  }

  req.user = payload;

  return next();
};

module.exports = { auth };
