const express = require('express');
const { getUser, updateUser } = require('../controllers/users');
const { validateProfile } = require('../validators/user-validator');

const UserRouter = express.Router();

UserRouter.get('/users/me', getUser);
UserRouter.patch('/users/me', validateProfile, updateUser);

module.exports = { UserRouter };
