const jwt = require('jsonwebtoken');
require('dotenv').config();
const { AuthErr } = require('../errors/errors');
const { NOT_AUTANTICATE_ERROR_TEXT, TOKEN_ERROR_TEXT, INCORRECT_DATA_ERROR_TEXT } = require('../constants');

const { JWT_SECRET, NODE_ENV } = process.env;

/**
 * Функция авторизации пользователя
 * @param {*} req - объект запроса использует req.cookies
 * @param {*} res - ответ запроса отправляем информацию о пользователе (успех) или ошибку
 * @param {*} next - аргумент обратного вызова для функции промежуточного обработчика
 * @returns
 */
const auth = (req, res, next) => {
  let payload;

  try {
    const token = req.cookies.userToken;

    if (!token) {
      return next(new AuthErr(NOT_AUTANTICATE_ERROR_TEXT));
    }

    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (error) {
    if (error.message === 'NotAutanticate') {
      return next(new AuthErr(INCORRECT_DATA_ERROR_TEXT));
    }

    if (error.name === 'JsonWebTokenError') {
      return next(new AuthErr(TOKEN_ERROR_TEXT));
    }

    return next(error);
  }

  req.user = payload;
  next();
  return null;
};

module.exports = auth;
