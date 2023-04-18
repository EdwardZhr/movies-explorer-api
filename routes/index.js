const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');
const { PageNotFoundMessage } = require('../utils/constants');

const {
  createUser, login, clearCookie,
} = require('../controllers/users');

const {
  createUserValidation, loginValidation,
} = require('../utils/validation');

const { auth } = require('../middlewares/auth');

router.post('/signup', createUserValidation, createUser);

router.post('/signin', loginValidation, login);

router.use(auth);

router.post('/signout', clearCookie);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', (req, res, next) => {
  next(new NotFoundError(PageNotFoundMessage));
});

module.exports = router;
