const jwt = require('jsonwebtoken');

const UnauthorizeddError = require('../errors/unauthorized-err');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizeddError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new UnauthorizeddError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};

module.exports = { auth };
