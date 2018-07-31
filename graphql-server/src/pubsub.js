const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

const SUBJECT_CHANGED = 'subjectUpdated';
const VOTE_CAST = 'voteCast';

module.exports = {
  pubsub,
  SUBJECT_CHANGED,
  VOTE_CAST,
};
