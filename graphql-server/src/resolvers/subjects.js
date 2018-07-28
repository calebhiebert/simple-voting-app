const db = require('../db');

module.exports = async (root, args, context, info) => {
  const subjects = await db.subject.findAll();
  return subjects;
};
