const db = require('../db');
const { NotFoundError } = require('../errors/errors');
const { AuthenticationError } = require('apollo-server');
const pubsub = require('../pubsub');
const logger = require('pino')({ name: 'create-subject', level: 'debug' });

module.exports.genericSubjectResolver = (rootKey) => {
  return async (root, args, { dl }, info) => {
    return dl.subjectById.load(root[rootKey]);
  };
};

module.exports.subjectChangedResolver = {
  subscribe: (root, args, context, info) => {
    return pubsub.pubsub.asyncIterator(pubsub.SUBJECT_CHANGED);
  },
};

module.exports.getSubject = async (root, args, { dl }, info) => {
  const subject = await dl.subjectById.load(args.id);

  if (subject === null) {
    throw new NotFoundError();
  }

  return subject;
};

module.exports.createSubject = async (root, args, context, info) => {
  if (context.user === null || context.user.banned) {
    throw new AuthenticationError();
  }

  const subject = await db.subject.create(args.input);
  const history = await db.subject_history.create({
    editor: context.user.id,
    ...args.input,
    subjectId: subject.id,
  });

  context.pubsub.publish(pubsub.SUBJECT_CHANGED, { subjectChanged: subject });
  return subject;
};

module.exports.getSubjects = async (root, args, context, info) => {
  const subjects = await db.subject.findAll();
  return subjects;
};

module.exports.deleteSubject = async (root, args, context, info) => {
  if (!context.user || context.user.banned) {
    throw new AuthenticationError();
  }

  const subject = await db.subject.findOne({
    where: {
      id: { [db.Op.eq]: args.id },
    },
  });

  await db.subject_history.destroy({
    where: {
      subjectId: { [db.Op.eq]: args.id },
    },
  });

  await db.vote.destroy({
    where: {
      subjectId: { [db.Op.eq]: args.id },
    },
  });

  if (subject === null) {
    throw new NotFoundError();
  }

  await subject.destroy();

  return true;
};

module.exports.updateSubject = async (root, args, context, info) => {
  if (context.user === null || context.user.banned) {
    throw new AuthenticationError();
  }

  const subject = await db.subject.findOne({
    where: {
      id: { [db.Op.eq]: args.input.id },
    },
  });

  if (subject === null) {
    throw new NotFoundError();
  }

  await db.subject_history.create({
    editor: context.user.id,
    personName: args.input.personName,
    costumeDescription: args.input.costumeDescription,
    subjectId: subject.id,
  });

  await subject.update(args.input);
  context.pubsub.publish(pubsub.SUBJECT_CHANGED, { subjectChanged: subject });
  return subject;
};

module.exports.voteCountResolver = async (root, args, context, info) => {
  const count = await db.vote.count({
    where: {
      subjectId: { [db.Op.eq]: root.id },
    },
  });

  return count;
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
