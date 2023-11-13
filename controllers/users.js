const bcrypt = require('bcrypt');
const User = require('../models/user');
const { generateToken } = require('../utils/jwt');
const { NotFoundError, DuplcateErr, ValidationErr } = require('../errors/errors');

const MONGE_DUPLCATE_ERROR_CODE = 11000;
const SOLT_ROUND = 10;
const TOKEN_NAME = 'userToken';

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
        next(new NotFoundError('Пользователь не найден'));
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
        next(new NotFoundError('Пользователь не найден'));
      }
      res.send(user);
    })
    .catch(next);
};

/**
 * Функция создаёт пользователя с переданными в теле (name, email, password)
 * @param {*} req - объект запроса использует req.body (name, email, password)
 * @param {*} res - ответ запроса отправляем информацию о новом пользователе (без пароля)
 * @param {*} next - аргумент обратного вызова для функции промежуточного обработчика
 */
const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  const hash = await bcrypt.hash(password, SOLT_ROUND);

  User({
    name,
    email,
    password: hash,
  })
    .save()
    .then((newUser) => {
      const userWithoutPassword = newUser.toObject();
      delete userWithoutPassword.password;
      res.status(201).send(userWithoutPassword);
    })
    .catch((error) => {
      if (error.code === MONGE_DUPLCATE_ERROR_CODE) {
        next(new DuplcateErr('Такой пользователь уже существует'));
      }

      next(error);
    });
};

/**
 * Функция входа в систему. Проверяет переданные в теле почту и пароль (email, password). Создает токен
 * @param {*} req - объект запроса использует req.body (email, password)
 * @param {*} res - ответ запроса отправляем информацию email и id залогиненого пользователя
 * @param {*} next - аргумент обратного вызова для функции промежуточного обработчика
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password').orFail(next);
    const matched = await bcrypt.compare(String(password), user.password);

    if (!matched) {
      next(new ValidationErr('Не правильный email или пароль'));
    }

    // Создает токен пользователя и записывает его в cookie с названием userToken
    const token = generateToken({ _id: user._id, email: user.email });

    res.cookie(TOKEN_NAME, token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return res.status(200).send({ email: user.email, id: user._id });
  } catch (error) {
    next(error);
  }
  return null;
};

/**
 * Функция выхода из системы
 * @param {*} req - объект запроса
 * @param {*} res - ответ запроса устанавливаем значение maxAge: -1 у cookie
 * @param {*} next - аргумент обратного вызова для функции промежуточного обработчика
 */
const signout = async (req, res, next) => {
  try {
    res.clearCookie(TOKEN_NAME);
    res.end();
  } catch (error) {
    next(new Error('Ошибка выхода из системы'));
  }
};

module.exports = {
  getUser,
  createUser,
  login,
  updateUser,
  signout,
};
