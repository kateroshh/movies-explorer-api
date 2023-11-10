const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET, NODE_ENV } = process.env;

const auth = (req, res, next) => {
  let payload;

  try {
    const token = req.cookies.userToken;

    if (!token) {
      return res.status(401).send({ message: 'Необходима авторизация' });
    }

    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (error) {
    if (error.message === 'NotAutanticate') {
      return res.status(401).send({
        message: 'Не правильный email или пароль',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({ message: 'Токен некорректный' });
    }

    return res.status(500).send({ message: 'Ошибка на стороне сервера', error });
  }

  req.user = payload;
  next();
  return null;
};

module.exports = auth;
