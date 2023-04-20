const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

const {
  CREATED,
  IncorrectCreateMovieMessage,
  MovieNotFoundMessage,
  MovieDeletedMessage,
  CantDeleteMovieMessage,
  IncorrectIdMessage,
} = require('../utils/constants');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .populate(['owner'])
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const data = req.body;
  data.owner = req.user._id;

  Movie.create(data)
    .then((movie) => res.status(CREATED).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(IncorrectCreateMovieMessage));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .populate(['owner'])
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(MovieNotFoundMessage);
      }
      if (!(movie.owner.equals(req.user._id.toString()))) {
        throw new ForbiddenError(CantDeleteMovieMessage);
      }
      return movie.deleteOne().then(() => res.send({ message: MovieDeletedMessage }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(IncorrectIdMessage));
      }
      return next(err);
    });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
