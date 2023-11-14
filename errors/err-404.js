class Err404 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = Err404;
