FROM node:alpine
WORKDIR /usr/src/build
COPY ui/package.json ui/yarn.lock ./
RUN yarn && yarn cache clean
COPY ui/ .
ENV NODE_ENV production
RUN yarn build

FROM node:alpine
WORKDIR /usr/src/app
COPY graphql-server/package.json graphql-server/yarn.lock ./
RUN yarn && yarn cache clean
COPY graphql-server/ ./

FROM node:alpine
WORKDIR /app
RUN mkdir -p /app/dist
COPY --from=0 /usr/src/build/dist/ ./dist
COPY --from=1 /usr/src/app/ .
ENV NODE_ENV=production
EXPOSE 8080
CMD [ "yarn", "up" ]