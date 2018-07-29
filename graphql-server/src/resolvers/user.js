const db = require('../db');

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

module.exports.getCurrentUser = (root, args, context, info) => {
  return context.user;
};

module.exports.getUsers = async (root, args, context, info) => {
  const users = await db.user.findAll();

  return users;
};
