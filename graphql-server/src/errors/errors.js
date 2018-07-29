class NotFoundError extends Error {
  constructor() {
    super('The entity was not found');
    this.name = 'EntityNotFound';
  }
}

module.exports.NotFoundError = NotFoundError;

class MustBeAuthenticated extends Error {
  constructor() {
    super('You must be authenticated to access this resource');
    this.name = 'MustBeAuthenticated';
  }
}

module.exports.MustBeAuthenticatedError = MustBeAuthenticated;
