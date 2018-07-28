const { ApolloServer, gql } = require('apollo-server-express');
const pino = require('pino');
const express = require('express');
const localResolvers = require('./resolvers');
const authMiddleware = require('./auth-middleware').default;
const schema = gql`
  ${require('fs').readFileSync(
    require('path').join(__dirname, '..', 'schema.gql'),
  )}
`;

const app = express();
const port = process.env.PORT || 4000;
const logger = pino({ level: 'debug', name: 'index' });

app.use(authMiddleware);

const resolvers = {
  Query: {
    subjects: localResolvers.subjectsResolver,
    subject: localResolvers.subjectResolver,
  },
  Mutation: {
    createSubject: localResolvers.createSubjectResolver,
    vote: localResolvers.doVoteResolver,
  },
  Subject: {
    votes: localResolvers.subjectVoteResolver,
    history: localResolvers.subjectHistoryResolver,
  },
  Vote: {
    voter: localResolvers.genericUserResolver('root', 'voter'),
    subject: localResolvers.genericSubjectResolver('subjectId'),
  },
  SubjectHistory: {
    subject: localResolvers.genericSubjectResolver('subjectId'),
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: ({ req }) => {
    return {
      user: req.user,
    };
  },
});

server.applyMiddleware({ app });

app.listen({ port }, () => {
  logger.info(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
