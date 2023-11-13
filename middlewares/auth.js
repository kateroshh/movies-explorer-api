const jwt = require('jsonwebtoken');
require('dotenv').config();
const { NotAutanticate } = require('../errors/errors');

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
      return next(new NotAutanticate('Необходима авторизация'));
    }

    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (error) {
    if (error.message === 'NotAutanticate') {
      return next(new NotAutanticate('Не правильный email или пароль'));
    }

    if (error.name === 'JsonWebTokenError') {
      return next(new NotAutanticate('Токен некорректный'));
    }

    return next(error);
  }

  req.user = payload;
  next();
  return null;
};

module.exports = auth;
