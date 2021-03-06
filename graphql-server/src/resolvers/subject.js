const db = require('../db');
const { NotFoundError } = require('../errors/errors');
const { AuthenticationError } = require('apollo-server');
const pubsub = require('../pubsub');
const dl = require('../dataloader')();
const logger = require('pino')({ name: 'create-subject', level: 'debug' });

module.exports.genericSubjectResolver = (rootKey) => {
  return async (root, args, context, info) => {
    return dl.subjectById.load(root[rootKey]);
  };
};

module.exports.subjectChangedResolver = {
  subscribe: (root, args, context, info) => {
    return pubsub.pubsub.asyncIterator(pubsub.SUBJECT_CHANGED);
  },
};

module.exports.getSubject = async (root, args, context, info) => {
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

  dl.subjectHistoryBySubjectId.prime(subject.id, [history]);

  // Clear the cache just incase a null value was cache previously
  dl.subjectById.clear(subject.id);

  pubsub.pubsub.publish(pubsub.SUBJECT_CHANGED, { subjectChanged: subject });
  return subject;
};

module.exports.getSubjects = async (root, args, context, info) => {
  const subjects = await db.subject.findAll();

  // Prime dataloader cache
  for (const subject of subjects) {
    dl.subjectById.prime(subject.id, subject);
  }

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

  if (subject === null) {
    throw new NotFoundError();
  }

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

  await subject.destroy();

  // Clear the dataloader cache
  dl.subjectById.clear(subject.id);
  dl.voteBySubjectId.clear(subject.id);
  dl.voteCountBySubjectId.clear(subject.id);
  dl.subjectHistoryBySubjectId.clear(subject.id);

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

  // Clear dataloader cache
  dl.subjectById.clearAll();
  dl.subjectHistoryBySubjectId.clearAll();

  pubsub.pubsub.publish(pubsub.SUBJECT_CHANGED, { subjectChanged: subject });
  return subject;
};

module.exports.voteCountResolver = async (root, args, context, info) => {
  const result = await dl.voteCountBySubjectId.load(root.id);
  return result.vote_count;
};

module.exports.voteResolver = async (root, args, context, info) => {
  const votes = await dl.voteBySubjectId.load(root.id);

  return votes;
};

module.exports.historyResolver = async (root, args, context, info) => {
  return dl.subjectHistoryBySubjectId.load(root.id);
};
