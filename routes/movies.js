// # возвращает все сохранённые текущим пользователем фильмы
// GET /movies

// # создаёт фильм с переданными в теле
// # country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
// POST /movies

// # удаляет сохранённый фильм по id
// DELETE /movies/_id

const express = require('express');
const { getMovies, saveMovie } = require('../controllers/movies');
// const { validateProfile } = require('../validators/user-validator');

const MovieRouter = express.Router();

MovieRouter.get('/movies', getMovies);
MovieRouter.post('/movies', saveMovie);
MovieRouter.delete('/movies/_id', getMovies);

module.exports = { MovieRouter };
