const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
require('dotenv').config();

const { UserRouter, MovieRouter, AuthRouter } = require('./routes/index');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rate-limit');
const { NotFoundError } = require('./errors/errors');
const { MONGODB_URL_DEV, PORT_DEV } = require('./constants');

const { PORT = PORT_DEV, MONGO_URL = MONGODB_URL_DEV } = process.env;

const app = express();
app.use(helmet());

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

app.use(AuthRouter);

app.use(auth);

app.use(UserRouter);
app.use(MovieRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger); // логгер ошибок

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // централизованный обработчик

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
