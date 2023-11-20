const { rateLimit } = require('express-rate-limit');

/**
 * Ограничение число запросов с одного IP в единицу времени.
 * windowMs - 15 минут
 * limit: - ограничить каждый IP до 100 запросов на «окно» (15 минут).
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});

module.exports = {
  limiter,
};
