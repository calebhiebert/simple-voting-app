const db = require('../db');
const { AuthenticationError } = require('apollo-server');

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

module.exports.doVoteResolver = async (root, args, context, info) => {
  if (!context.user) {
    throw new AuthenticationError();
  }

  const existingVote = await db.vote.findOne({
    where: {
      voter: { [db.Op.eq]: context.user.id },
    },
  });

  if (existingVote !== null) {
    existingVote.subjectId = args.subjectId;
    await existingVote.save();
    return existingVote;
  } else {
    const vote = await db.vote.create({
      subjectId: args.subjectId,
      voter: context.user.id,
    });
    return vote;
  }
};
