const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
      minlength: [2, 'Минимальная длинна 2 символа'],
      maxlength: [255, 'Максимальная длинна 255 символов'],
    },
    director: {
      type: String,
      required: true,
      minlength: [2, 'Минимальная длинна 2 символа'],
      maxlength: [255, 'Максимальная длинна 255 символов'],
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
      minlength: [2, 'Минимальная длинна 2 символа'],
      maxlength: [4, 'Максимальная длинна 4 символов'],
    },
    description: {
      type: String,
      required: true,
      minlength: [2, 'Минимальная длинна 2 символа'],
      maxlength: [255, 'Максимальная длинна 255 символов'],
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator: (v) => validator.isURL(v, { protocols: ['http', 'https'] }),
        message: (props) => `${props.value} некорректное значение image`,
      },
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator: (v) => validator.isURL(v, { protocols: ['http', 'https'] }),
        message: (props) => `${props.value} некорректное значение trailerLink`,
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: (v) => validator.isURL(v, { protocols: ['http', 'https'] }),
        message: (props) => `${props.value} некорректное значение trailerLink`,
      },
    },
    owner: {
      type: mongoose.ObjectId,
      required: {
        value: true,
        message: 'Поле owner обязательное для заполнения',
      },
    },
    movieId: {
      type: Number,
      required: {
        value: true,
        message: 'Поле movieId обязательное для заполнения',
      },
    },
    nameRU: {
      type: String,
      required: true,
      minlength: [2, 'Минимальная длинна 2 символа'],
      maxlength: [255, 'Максимальная длинна 255 символов'],
    },
    nameEN: {
      type: String,
      required: true,
      minlength: [2, 'Минимальная длинна 2 символа'],
      maxlength: [255, 'Максимальная длинна 255 символов'],
    },
  },
  { versionKey: false, timestamps: true },
);

module.exports = mongoose.model('movie', movieSchema);
