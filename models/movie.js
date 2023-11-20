const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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
    },
    nameEN: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

module.exports = mongoose.model('movie', movieSchema);
