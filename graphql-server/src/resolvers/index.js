const subjects = require('./subjects');
const subject = require('./subject');
const user = require('./user');
const vote = require('./vote');

module.exports = {
  subjectResolver: subject.getSubject,
  subjectsResolver: subjects,
  createSubjectResolver: subject.createSubject,
  subjectVoteResolver: subject.voteResolver,
  subjectHistoryResolver: subject.historyResolver,
  genericSubjectResolver: subject.genericSubjectResolver,
  genericUserResolver: user.genericGetUser,
  doVoteResolver: vote.doVoteResolver,
};
