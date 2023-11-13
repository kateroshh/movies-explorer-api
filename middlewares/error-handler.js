/**
 * Функция централизованной обработки ошибок
 * @param {*} err - ошибка
 * @param {*} req - объект запроса
 * @param {*} res - ответ запроса отправляем код ошибки и сообщение
 * @param {*} next - аргумент обратного вызова для функции промежуточного обработчика
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const message = err.statusCode === 500 ? 'На сервере произошла ошибка' : err.message;

  res.status(statusCode).send({ message });

  next();
};

module.exports = errorHandler;
