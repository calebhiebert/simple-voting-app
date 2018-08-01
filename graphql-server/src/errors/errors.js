const { ApolloError } = require('apollo-server');

class NotFoundError extends ApolloError {
  constructor() {
    super('The requested resource could not be found', 'NOT_FOUND');
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
