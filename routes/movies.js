const express = require('express');
const { getMovies, saveMovie, deleteMovie } = require('../controllers/movies');
const { validateMovieId, validateNewMovie } = require('../validators/movie-validator');

const MovieRouter = express.Router();

MovieRouter.get('/movies', getMovies);
MovieRouter.post('/movies', validateNewMovie, saveMovie);
MovieRouter.delete('/movies/:_id', validateMovieId, deleteMovie);

module.exports = { MovieRouter };
