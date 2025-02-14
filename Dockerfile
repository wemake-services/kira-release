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
  nodejs \
  npm \
  sqlite-dev

# Installing dependencies in a separate cache layer
WORKDIR /release
COPY . /release/
RUN npm install
