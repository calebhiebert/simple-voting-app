const { ApolloServer, gql } = require('apollo-server');
const pino = require('pino');
const localResolvers = require('./resolvers');
const schema = gql`
  ${require('fs').readFileSync(
    require('path').join(__dirname, '..', 'schema.gql'),
  )}
`;

const logger = pino({ level: 'debug', name: 'index' });

const resolvers = {
  Query: {
    subjects: localResolvers.subjectResolver,
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

server.listen().then((info) => {
  logger.info('Server started', { url: info.url });
});
