const Movie = require('../models/movie');
const { NotFoundError, DuplcateErr } = require('../errors/errors');

const MONGE_DUPLCATE_ERROR_CODE = 11000;

/**
 * Функция возвращает все сохранённые текущим пользователем фильмы
 * @param {*} req - объект запроса использует req.user._id
 * @param {*} res - ответ запроса отправляем информацию о пользователе
 * @param {*} next - аргумент обратного вызова для функции промежуточного обработчика
 */
const getMovies = async (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

/**
 * Функция добавляет фильм в избранное
 * @param {*} req - объект запроса использует req.user._id и переменные из req.body
 * @param {*} res - ответ запроса отправляем информацию о сохранненом фильме
 * @param {*} next - аргумент обратного вызова для функции промежуточного обработчика
 */
const saveMovie = async (req, res, next) => {
  const { country, director, duration, year, description, image } = req.body;
  const { trailerLink, thumbnail, movieId, nameRU, nameEN } = req.body;
  const owner = req.user._id;

  Movie({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .save()
    .then((newMovie) => res.status(201).send(newMovie))
    .catch((error) => {
      if (error.code === MONGE_DUPLCATE_ERROR_CODE) {
        next(new DuplcateErr('Такой фильм уже есть в избранном'));
      }

      next(error);
    });
};

/**
 * Функция удаляет сохранённый фильм по id
 * @param {*} req - объект запроса использует req.params.id
 * @param {*} res - ответ запроса отправляем информацию об удаленном фильме
 * @param {*} next - аргумент обратного вызова для функции промежуточного обработчика
 */
const deleteMovie = (req, res, next) => {
  Movie.findByIdAndRemove(req.params.id)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Фильм по указанному _id не найден'));
      }

      return res.send(card);
    })
    .catch(next);
};

module.exports = {
  getMovies,
  saveMovie,
  deleteMovie,
};
