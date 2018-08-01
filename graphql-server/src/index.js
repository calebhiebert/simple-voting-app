const { ApolloServer, gql } = require('apollo-server-express');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const pino = require('pino');
const express = require('express');
const graphql = require('graphql');
const resolvers = require('./resolvers');
const authMiddleware = require('./auth-middleware').default;
const path = require('path');
const cors = require('cors');
const schemaString = require('fs').readFileSync(path.join(__dirname, '..', 'schema.gql'), {
  encoding: 'utf8',
});

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
app.use(express.static(path.join(__dirname, '..', 'dist')));

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

app.use((req, res) => {
  res.header('Content-Type', 'text/html');

  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

const httpServer = app.listen({ port }, () => {
  logger.info(`🚀 Server ready on port ${port}`);
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
