FROM node:alpine
WORKDIR /usr/src/build
COPY ui/package.json ui/yarn.lock ./
RUN yarn && yarn cache clean
COPY ui/ .
RUN yarn build

FROM golang:1.10.3-stretch
WORKDIR /src/app
ENV GOPATH=/ GOBIN=/go/bin
COPY src/ ./
RUN go get -d ./...
RUN export GOOS=linux GOARCH=amd64 CGO_ENABLED=1 && go build -o voter