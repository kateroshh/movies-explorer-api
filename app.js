const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { UserRouter } = require('./routes/users');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');

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

// app.post('/signin', validateLogin, login);
// app.post('/signup', validateNewUser, createUser);
app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use(UserRouter);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
