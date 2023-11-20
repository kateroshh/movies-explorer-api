const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [2, 'Минимальная длинна 2 символа'],
      maxlength: [30, 'Максимальная длинна 30 символов'],
    },
    email: {
      type: String,
      unique: true,
      required: {
        value: true,
        message: 'Поле email обязательное для заполнения',
      },
      validate: {
        validator: (v) => validator.isEmail(v),
        message: (props) => `${props.value} некорректное значение email`,
      },
    },
    password: {
      type: String,
      required: {
        value: true,
        message: 'Поле password обязательное для заполнения',
      },
      select: false,
    },
  },
  { versionKey: false, timestamps: true },
);

module.exports = mongoose.model('user', userSchema);
