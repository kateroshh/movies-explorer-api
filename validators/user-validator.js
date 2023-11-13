const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
  validateNewUser: celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string()
        .required()
        .email({ tlds: { allow: false } }),
      password: Joi.string().required(),
    }),
  }),
  validateLogin: celebrate({
    body: Joi.object().keys({
      email: Joi.string()
        .required()
        .email({ tlds: { allow: false } }),
      password: Joi.string().required(),
    }),
  }),
  validateProfile: celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string()
        .required()
        .email({ tlds: { allow: false } }),
    }),
  }),
};
