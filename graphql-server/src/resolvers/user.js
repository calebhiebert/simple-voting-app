const db = require('../db');
const { AuthenticationError } = require('apollo-server');
const { NotFoundError } = require('../errors/errors');
const pino = require('pino');

const logger = pino({ name: 'user-resolvers', level: 'debug' });

module.exports.genericGetUser = (rootOrArgs, key) => {
  return async (root, args, context, info) => {
    let id;

    if (rootOrArgs === 'args') {
      id = args[key];
    } else {
      id = root[key];
    }

    const user = await db.user.findOne({
      where: {
        id: { [db.Op.eq]: id },
      },
    });

    return user;
  };
};

module.exports.updateUser = async (root, args, context, info) => {
  if (!context.user || context.user.banned || !context.user.admin) {
    throw new AuthenticationError();
  }

  const user = await db.user.findOne({
    where: {
      id: { [db.Op.eq]: args.input.id },
    },
  });

  logger.debug(JSON.parse(JSON.stringify(user)));

  if (user === null) {
    throw new NotFoundError();
  }

  logger.debug(args.input);

  await user.update(args.input);
  return user;
};

module.exports.getCurrentUser = (root, args, context, info) => {
  return context.user;
};

module.exports.getUsers = async (root, args, context, info) => {
  const users = await db.user.findAll();

  return users;
};
