ARG NODE_VERSION=26.13

FROM node:${NODE_VERSION}-alpine AS node

FROM wemakeservices/wemake-dind:latest

LABEL maintainer="mail@sobolevn.me"
LABEL vendor="wemake.services"

ENV GIT_AUTHOR_NAME="kira-project" \
  GIT_AUTHOR_EMAIL="n.a.sobolev@gmail.com" \
  GIT_COMMITTER_NAME="kira-project" \
  GIT_COMMITTER_EMAIL="n.a.sobolev@gmail.com" \
  # Without this line `semantic-release` CLI does not work:
  PATH="/release/node_modules/.bin:${PATH}"

RUN apk --no-cache add \
  curl \
  git \
  sqlite-dev

COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

RUN node -v

# Installing dependencies in a separate cache layer
WORKDIR /release
COPY . /release/
RUN npm install
