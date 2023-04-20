const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const UnauthorizedError = require('../errors/unauthorized-err');
const { AutharizationErrorMessage } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(AutharizationErrorMessage);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(AutharizationErrorMessage);
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
