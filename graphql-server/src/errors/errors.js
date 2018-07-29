class NotFoundError extends Error {
  constructor() {
    this.name = 'EntityNotFound';
  }
}

module.exports.NotFoundError = NotFoundError;

class MustBeAuthenticated extends Error {
  constructor() {
    this.name = 'MustBeAuthenticated';
  }
}

module.exports.MustBeAuthenticatedError = MustBeAuthenticated;
