const { ApolloServer, gql } = require('apollo-server-express');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { pubsub } = require('./pubsub');
const pino = require('pino');
const express = require('express');
const graphql = require('graphql');
const resolvers = require('./resolvers');
const authMiddleware = require('./auth-middleware').default;
const cors = require('cors');
const schemaString = require('fs').readFileSync(require('path').join(__dirname, '..', 'schema.gql'), {
  encoding: 'utf8',
});
const dataloaders = require('./dataloader');

const app = express();
const port = process.env.PORT || 4000;
const schema = gql(schemaString);
const logger = pino({ level: 'debug', name: 'index' });

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
  }),
);
app.use(authMiddleware);

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: ({ req }) => {
    return {
      user: req.user,
      pubsub,
      dl: dataloaders(),
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
    execute: (schema, document, rootValue, contextValue, variableValues, operationName, fieldResolver) => {
      console.log('EXECUTING');
      return graphql.execute(
        schema,
        document,
        rootValue,
        { dl: dataloaders() },
        variableValues,
        operationName,
        fieldResolver,
      );
    },
    subscribe: graphql.subscribe,
  },
  {
    server: httpServer,
    path: '/graphql',
  },
);
