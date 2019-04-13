FROM docker:latest

LABEL maintainer="sobolevn@wemake.services"
LABEL vendor="wemake.services"

ENV GIT_AUTHOR_NAME="kira-bot" \
  GIT_AUTHOR_EMAIL="kira@wemake.services" \
  GIT_COMMITTER_NAME="kira-bot" \
  GIT_COMMITTER_EMAIL="kira@wemake.services"

RUN apk --no-cache add git nodejs nodejs-npm

COPY . /code/
WORKDIR /code

# Installing dependencies in a separate cache layer
RUN npm install
