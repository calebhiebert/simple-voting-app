const subject = require('./subject');
const user = require('./user');
const vote = require('./vote');

module.exports = {
  genericSubjectResolver: subject.genericSubjectResolver,
  genericUserResolver: user.genericGetUser,
};

module.exports = {
  Query: {
    subjects: subject.getSubjects,
    subject: subject.getSubject,
    user: user.getCurrentUser,
    users: user.getUsers,
    votedFor: vote.votedFor,
  },

  Mutation: {
    createSubject: subject.createSubject,
    updateSubject: subject.updateSubject,
    deleteSubject: subject.deleteSubject,
    updateUser: user.updateUser,
    vote: vote.doVoteResolver,
  },

  Subscription: {
    subjectChanged: subject.subjectChangedResolver,
    voteCast: vote.voteCastResolver,
  },

  Subject: {
    votes: subject.voteResolver,
    history: subject.historyResolver,
    voteCount: subject.voteCountResolver,
  },

  Vote: {
    subject: subject.genericSubjectResolver('subjectId'),
    voter: user.genericGetUser('root', 'voter'),
  },

  SubjectHistory: {
    subject: subject.genericSubjectResolver('subjectId'),
    editor: user.genericGetUser('root', 'editor'),
  },
};
