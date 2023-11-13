const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const { UserRouter, MovieRouter } = require('./routes/index');
const auth = require('./middlewares/auth');
const { createUser, login, signout } = require('./controllers/users');
const { validateNewUser, validateLogin } = require('./validators/user-validator');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rate-limit');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:3001',
      'https://kateroshh.nomoredomainsrocks.ru',
      'http://kateroshh.nomoredomainsrocks.ru',
    ],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

mongoose.connect(MONGO_URL).then(() => console.log('Connected!'));

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger); // логгер запросов

app.use(limiter);

app.post('/signin', validateLogin, login);
app.post('/signup', validateNewUser, createUser);
app.post('/signout', signout);

app.use(auth);

app.use(UserRouter);
app.use(MovieRouter);

app.use((req, res) => {
  res.status(404).json({
    message: 'Страница не найдена',
  });
});

app.use(errorLogger); // логгер ошибок

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // централизованный обработчик

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
