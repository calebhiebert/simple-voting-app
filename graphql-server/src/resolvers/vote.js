const db = require('../db');
const { AuthenticationError } = require('apollo-server');
const { NotFoundError } = require('../errors/errors');
const pubsub = require('../pubsub');
const dl = require('../dataloader')();

module.exports.votedFor = async (root, args, context, info) => {
  if (!context.user) {
    throw new AuthenticationError();
  }

  const existingVote = await db.vote.findOne({
    where: {
      voter: { [db.Op.eq]: context.user.id },
    },

    include: [
      {
        model: db.subject,
        as: 'subject',
      },
    ],
  });

  if (existingVote === null) {
    return null;
  }

  return existingVote.subject;
};

module.exports.voteCastResolver = {
  subscribe: (root, args, context, info) => {
    return pubsub.pubsub.asyncIterator(pubsub.VOTE_CAST);
  },
};

module.exports.doVoteResolver = async (root, args, context, info) => {
  if (!context.user) {
    throw new AuthenticationError();
  }

  const existingVote = await db.vote.findOne({
    where: {
      voter: { [db.Op.eq]: context.user.id },
    },
    include: [{ model: db.subject, as: 'subject' }],
  });

  const subject = await dl.subjectById.load(args.subjectId);

  if (subject === null) {
    throw new NotFoundError();
  }

  if (existingVote !== null) {
    // Clear dataloader cache
    dl.voteBySubjectId.clear(existingVote.subjectId);
    dl.voteCountBySubjectId.clear(existingVote.subjectId);

    existingVote.subjectId = args.subjectId;
    await existingVote.save();

    // Clear dataloader cache
    dl.voteBySubjectId.clear(subject.id);
    dl.voteCountBySubjectId.clear(subject.id);
    pubsub.pubsub.publish(pubsub.VOTE_CAST, { voteCast: [existingVote.subject, subject] });
    pubsub.pubsub.publish(pubsub.SUBJECT_CHANGED, { subjectChanged: existingVote.subject });
    pubsub.pubsub.publish(pubsub.SUBJECT_CHANGED, { subjectChanged: subject });

    return existingVote;
  } else {
    const vote = await db.vote.create({
      subjectId: args.subjectId,
      voter: context.user.id,
    });

    // Clear dataloaders
    dl.voteBySubjectId.clear(subject.id);
    dl.voteCountBySubjectId.clear(subject.id);

    pubsub.pubsub.publish(pubsub.VOTE_CAST, { voteCast: [subject] });
    pubsub.pubsub.publish(pubsub.SUBJECT_CHANGED, { subjectChanged: subject });
    return vote;
  }
};
