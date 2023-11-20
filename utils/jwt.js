const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET, NODE_ENV } = process.env;

const keyToken = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

const generateToken = (payload) => jwt.sign(payload, keyToken, { expiresIn: 3600 });

module.exports = {
  generateToken,
};
