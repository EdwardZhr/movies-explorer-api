const CREATED = '201';

const UserNotFoundMessage = 'Пользователь с указанным _id не найден';
const UserExistsMessage = 'Пользователь с таким email уже существует';
const IncorrectCreateUserMessage = 'Переданы некорректные данные при создании пользователя';
const IncorrectUpdateUserMessage = 'Переданы некорректные данные при обновлении профиля';
const IncorrectCreateMovieMessage = 'Переданы некорректные данные фильма';
const MovieNotFoundMessage = 'Фильм с указанным _id не найден';
const MovieDeletedMessage = 'Фильм удален';
const CantDeleteMovieMessage = 'Нельзя удалить чужой фильм';
const IncorrectIdMessage = 'Передан некорректный _id';
const AutharizationErrorMessage = 'Неправильные почта или пароль';
const UnauthorizedMessage = 'Необходима авторизация';
const PageNotFoundMessage = 'Страница не найдена';

const regexLinkValidation = /(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?/i;

module.exports = {
  CREATED,
  regexLinkValidation,
  UserNotFoundMessage,
  UserExistsMessage,
  IncorrectCreateUserMessage,
  IncorrectUpdateUserMessage,
  IncorrectCreateMovieMessage,
  MovieNotFoundMessage,
  MovieDeletedMessage,
  CantDeleteMovieMessage,
  IncorrectIdMessage,
  AutharizationErrorMessage,
  UnauthorizedMessage,
  PageNotFoundMessage,
};
