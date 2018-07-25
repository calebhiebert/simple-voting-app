FROM node:alpine
WORKDIR /usr/src/build
COPY ui/package.json ui/yarn.lock ./
RUN yarn && yarn cache clean
COPY ui/ .
RUN yarn build

FROM golang:1.10.3-stretch
WORKDIR /src/app
ENV GOPATH=/;/src/app GOBIN=/go/bin
COPY src/ ./
RUN go get -d ./...
RUN export GOOS=linux GOARCH=amd64 CGO_ENABLED=1 && go build -o voter

FROM alpine:latest
RUN apk --no-cache add ca-certificates
RUN mkdir /lib64 && ln -s /lib/libc.musl-x86_64.so.1 /lib64/ld-linux-x86-64.so.2 && mkdir /app && mkdir /app/dist
COPY --from=1 /src/app/voter /app/voter
COPY --from=0 /usr/src/build/dist/ /app/dist
ENV GIN_MODE=release
EXPOSE 8080
CMD [ "/app/voter" ]