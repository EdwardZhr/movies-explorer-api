const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

const {
  UserNotFoundMessage,
  UserExistsMessage,
  IncorrectCreateUserMessage,
  IncorrectUpdateUserMessage,
} = require('../utils/constants');

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(UserNotFoundMessage);
      }
      res.send(user);
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(UserNotFoundMessage);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(UserExistsMessage));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(IncorrectUpdateUserMessage));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    email, name, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, name, password: hash,
    }))
    .then((user) => res.send({
      data: {
        name: user.name, email: user.email,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(UserExistsMessage));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(IncorrectCreateUserMessage));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      }).end();
    })
    .catch(next);
};

const clearCookie = (req, res) => {
  res.clearCookie('jwt').end();
};

module.exports = {
  getUserInfo, updateUserInfo, createUser, login, clearCookie,
};
