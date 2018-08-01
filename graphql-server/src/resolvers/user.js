const db = require('../db');
const { AuthenticationError } = require('apollo-server');
const { NotFoundError } = require('../errors/errors');
const dl = require('../dataloader')();
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

    const user = await dl.userById.load(id);

    return user;
  };
};

module.exports.updateUser = async (root, args, { user }, info) => {
  if (!user || user.banned || !user.admin) {
    throw new AuthenticationError();
  }

  const dbUser = await db.user.findOne({
    where: {
      id: { [db.Op.eq]: args.input.id },
    },
  });

  if (dbUser === null) {
    throw new NotFoundError();
  }

  await dbUser.update(args.input);

  // reset dataloader user cache
  dl.userById.clear(dbUser.id);
  return dbUser;
};

module.exports.getCurrentUser = (root, args, context, info) => {
  return context.user;
};

module.exports.getUsers = async (root, args, context, info) => {
  const users = await db.user.findAll();

  for (const user of users) {
    dl.userById.prime(user.id, user);
  }

  return users;
};
