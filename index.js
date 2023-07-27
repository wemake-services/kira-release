// This is a friendly fork of
// https://gitlab.com/foxfarmroad/semantic-release-gitlab-docker

const verifyConditions = require('./lib/verify')
const publish = require('./lib/publish')

module.exports = {
  verifyConditions,
  publish,
}
