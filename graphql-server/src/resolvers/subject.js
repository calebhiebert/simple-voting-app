const db = require('../db');
const logger = require('pino')({ name: 'create-subject', level: 'debug' });

module.exports.genericSubjectResolver = (rootKey) => {
  return async (root, args, context, info) => {
    const subject = await db.subject.findOne({
      where: {
        id: { [db.Op.eq]: root[rootKey] },
      },
    });

    return subject;
  };
};

module.exports.getSubject = async (root, args, context, info) => {
  const subject = await db.subject.findOne({
    where: {
      id: { [db.Op.eq]: args.id },
    },
  });

  return subject;
};

module.exports.createSubject = async (root, args, context, info) => {
  const subject = await db.subject.create(args.input);
  return subject;
};

module.exports.voteResolver = async (root, args, context, info) => {
  const votes = await db.vote.findAll({
    where: {
      subjectId: { [db.Op.eq]: root.id },
    },
  });

  return votes;
};

module.exports.historyResolver = async (root, args, context, info) => {
  const history = await db.subject_history.findAll({
    where: {
      subjectId: { [db.Op.eq]: root.id },
    },
  });

  return history;
};
