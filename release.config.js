// Generic release configuration.
//
// Parameters are:
// 1. KIRA_RELEASE_ASSETS
//    to release static files with gitlab
// 2. KIRA_RELEASE_SKIP_DOCKER=true
//    to skip docker release to Gitlab Registry
// 2.1 GROUP_NAME and PROJECT_NAME
//    to correctly set name of your docker image
//    if you are using docker releases
//

const assets = process.env.KIRA_RELEASE_ASSETS || ''
const skipDocker = process.env.KIRA_RELEASE_SKIP_DOCKER
const dockerImageName = `${process.env.GROUP_NAME}/${process.env.PROJECT_NAME}`

// Pipeline definition:

const releasePipeline = {
  'plugins': [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',

    ['@semantic-release/git', {
      'assets': ['CHANGELOG.md'],
    }],

    ['@semantic-release/gitlab', { assets }],
  ]
}

if (!skipDocker || skipDocker.toLowerCase() !== 'true') {
  // If it is not a docker-based app, this step will be ignored:
  releasePipeline['plugins'].push(
    ['semantic-release-gitlab-docker', {
      'name': dockerImageName,
    }]
  )
}

module.exports = releasePipeline
