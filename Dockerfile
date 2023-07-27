FROM wemakeservices/wemake-dind:latest

LABEL maintainer="mail@sobolevn.me"
LABEL vendor="wemake.services"

ENV GIT_AUTHOR_NAME="kira-bot" \
  GIT_AUTHOR_EMAIL="kira@wemake.services" \
  GIT_COMMITTER_NAME="kira-bot" \
  GIT_COMMITTER_EMAIL="kira@wemake.services" \
  # Without this line `semantic-release` CLI does not work:
  PATH="/release/node_modules/.bin:${PATH}"

RUN apk --no-cache add \
  curl \
  git \
  nodejs \
  npm

# Installing dependencies in a separate cache layer
WORKDIR /release
COPY . /release/
RUN npm install
