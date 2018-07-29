const db = require('../db');

exports.getAllSubjectsResolver = async (root, args, context, info) => {
  const subjects = await db.subject.findAll();
  return subjects;
};
