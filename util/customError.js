class BlogValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "BlogValidationError";
  }
}

module.exports = {
  BlogValidationError,
};
