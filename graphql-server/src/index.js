const { ApolloServer, gql } = require('apollo-server-express');
const pino = require('pino');
const express = require('express');
const graphql = require('graphql');
const localResolvers = require('./resolvers');
const authMiddleware = require('./auth-middleware').default;
const { SubscriptionServer } = require('subscriptions-transport-ws');
const cors = require('cors');
const schema = gql`
  ${require('fs').readFileSync(require('path').join(__dirname, '..', 'schema.gql'))}
`;
const { pubsub } = require('./pubsub');

const app = express();
const port = process.env.PORT || 4000;
const logger = pino({ level: 'debug', name: 'index' });

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
  }),
);
app.use(authMiddleware);

const resolvers = {
  Query: {
    subjects: localResolvers.subjectsResolver,
    subject: localResolvers.subjectResolver,
    votedFor: localResolvers.votedForResolver,
    user: localResolvers.currentUserResolver,
    users: localResolvers.allUsersResolver,
  },
  Mutation: {
    createSubject: localResolvers.createSubjectResolver,
    updateSubject: localResolvers.updateSubjectResolver,
    deleteSubject: localResolvers.deleteSubjectResolver,
    updateUser: localResolvers.updateUserResolver,
    vote: localResolvers.doVoteResolver,
  },
  Subscription: {
    subjectChanged: localResolvers.subjectChangedResolver,
    voteCast: localResolvers.voteCastResolver,
  },
  Subject: {
    votes: localResolvers.subjectVoteResolver,
    history: localResolvers.subjectHistoryResolver,
    voteCount: localResolvers.subjectVoteCountResolver,
  },
  Vote: {
    voter: localResolvers.genericUserResolver('root', 'voter'),
    subject: localResolvers.genericSubjectResolver('subjectId'),
  },
  SubjectHistory: {
    subject: localResolvers.genericSubjectResolver('subjectId'),
    editor: localResolvers.genericUserResolver('root', 'editor'),
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: ({ req }) => {
    return {
      user: req.user,
      pubsub,
    };
  },
});

server.applyMiddleware({ app });

const httpServer = app.listen({ port }, () => {
  logger.info(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});

const subscriptionServer = new SubscriptionServer(
  {
    schema: server.schema,
    execute: graphql.execute,
    subscribe: graphql.subscribe,
  },
  {
    server: httpServer,
    path: '/graphql',
  },
);
