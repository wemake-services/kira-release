// Generic release configuration.
//
// Required parameters are:
// 1. KIRA_RELEASE_ASSETS
//    to release static files with gitlab
// 2. GROUP_NAME and PROJECT_NAME
//    to correctly set name of your docker image
//    if you are using docker releases
//
// See README.md for more options and their description.

// Configuration:
const assets = process.env.KIRA_RELEASE_ASSETS || ''
const replaceConfig = JSON.parse(
  process.env.KIRA_RELEASE_REPLACE_CONFIG || '{}',
)
const execConfig = JSON.parse(process.env.KIRA_RELEASE_EXEC_CONFIG || '{}')
const skipDocker = process.env.KIRA_RELEASE_SKIP_DOCKER

// Files to be committed back to the repo later on:
const tobeCommitted = ['CHANGELOG.md']
if (replaceConfig.project) {
  tobeCommitted.push(replaceConfig.project)
  console.log('Found replacement configuration')
  console.log(replaceConfig)
}

// Pipeline definition:
const releasePipeline = {
  'plugins': [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
  ],
}

// Maybe we should update some files with versions?
if (replaceConfig) {
  releasePipeline.plugins.push([
    '@google/semantic-release-replace-plugin', {
      'replacements': [{
        'files': [replaceConfig.project],
        'from': replaceConfig.from,
        'to': replaceConfig.to,
        'results': [
          {
            'file': replaceConfig.project,
            'hasChanged': true,
            'numMatches': 1,
            'numReplacements': 1,
          }
        ],
        'countMatches': true,
      }],
    },
  ])
}

// Maybe we should execute some extra steps before making a deployment?
if (Object.keys(execConfig).length !== 0) {
  console.log('Found exec configuration')
  console.log(execConfig)

  releasePipeline.plugins.push([
    // See: https://github.com/semantic-release/exec
    '@semantic-release/exec', execConfig,
  ])
}

// Back to basic release pipeline:
releasePipeline.plugins.push(...[
  ['@semantic-release/git', {
    'assets': tobeCommitted,
  }],

  ['@semantic-release/gitlab', { assets }],
])

// Maybe we should crete a docker release?
if (!skipDocker || skipDocker.toLowerCase() !== 'true') {
  // If it is not a docker-based app, this step will be ignored:
  releasePipeline.plugins.push([
    'semantic-release-gitlab-docker', {
      'name': `${process.env.GROUP_NAME}/${process.env.PROJECT_NAME}`,
    },
  ])
}

module.exports = releasePipeline
