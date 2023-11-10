// # возвращает информацию о пользователе (email и имя)
// GET /users/me

// # обновляет информацию о пользователе (email и имя)
// PATCH /users/me

const express = require('express');
const { getUser } = require('../controllers/users');
// const { validateObjId, validateAvatar, validateProfile } = require('../validators/user-validator');

const UserRouter = express.Router();

UserRouter.get('/users/me', getUser);
// UserRouter.patch('/users/me', validateProfile, updateUserProfile);

module.exports = { UserRouter };
