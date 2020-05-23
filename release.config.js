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
// 3. KIRA_RELEASE_REPLACE_CONFIG
//    json config of how to replace version number in the project file
//

// Configuration:
const assets = process.env.KIRA_RELEASE_ASSETS || ''
const replaceConfig = JSON.parse(
  process.env.KIRA_RELEASE_REPLACE_CONFIG || '{}',
)
const skipDocker = process.env.KIRA_RELEASE_SKIP_DOCKER
const dockerImageName = `${process.env.GROUP_NAME}/${process.env.PROJECT_NAME}`

// Helpers:
const tobeCommitted = ['CHANGELOG.md']
if (replaceConfig.project) {
  tobeCommitted.push(replaceConfig.project)
}

// Pipeline definition:
const releasePipeline = {
  'plugins': [
    '@semantic-release/commit-analyzer',
  ],
}

// Maybe we should update some files with versions?
if (replaceConfig) {
  releasePipeline.plugins.push([
    '@google/semantic-release-replace-plugin', {
      'replacements': {
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
      }
    },
  ])
}

// Back to basic release pipeline:
releasePipeline.plugins.push(...[
  '@semantic-release/release-notes-generator',
  '@semantic-release/changelog',

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
      'name': dockerImageName,
    },
  ])
}

module.exports = releasePipeline
