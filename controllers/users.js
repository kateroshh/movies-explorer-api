const User = require('../models/user');
const { NotFoundError, DuplcateErr, ValidationErr } = require('../errors/errors');

const { DUBLCATE_ERROR_TEXT, NOT_FOUND_USER_ERROR_TEXT } = require('../constants');
const { MONGE_DUPLCATE_ERROR_CODE } = require('../constants');

/**
 * Функция возвращает информацию о пользователе (email и имя)
 * @param {*} req - объект запроса использует req.user._id
 * @param {*} res - ответ запроса отправляем информацию о пользователе
 * @param {*} next - аргумент обратного вызова для функции промежуточного обработчика
 */
const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError(NOT_FOUND_USER_ERROR_TEXT));
      }
      res.send(user);
    })
    .catch(next);
};

/**
 * Функция обновляет информацию о пользователе (email и имя)
 * @param {*} req - объект запроса использует req.user._id, req.body.name, req.body.email
 * @param {*} res - ответ запроса отправляем информацию об обновленном пользователе
 * @param {*} next - аргумент обратного вызова для функции промежуточного обработчика
 */
const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError(NOT_FOUND_USER_ERROR_TEXT));
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.code === MONGE_DUPLCATE_ERROR_CODE) {
        next(new DuplcateErr(DUBLCATE_ERROR_TEXT));
      } else if (error.name === 'ValidationError') {
        next(
          new ValidationErr(
            `${Object.values(error.errors)
              .map((err) => err.message)
              .join(', ')}`,
          ),
        );
      } else {
        next(error);
      }
    });
};

module.exports = {
  getUser,
  updateUser,
};
