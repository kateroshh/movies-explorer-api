const express = require('express');
const { createUser, login, signout } = require('../controllers/authorization');
const { validateNewUser, validateLogin } = require('../validators/user-validator');

const AuthRouter = express.Router();

AuthRouter.post('/signin', validateLogin, login);
AuthRouter.post('/signup', validateNewUser, createUser);
AuthRouter.post('/signout', signout);

module.exports = { AuthRouter };
