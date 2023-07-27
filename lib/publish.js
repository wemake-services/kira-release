module.exports = async (pluginConfig, { nextRelease: { version }, logger }) => {
  const execa = await import('execa')

  const registry = process.env.CI_REGISTRY
  logger.log(
    `Pushing ${registry}/${
      pluginConfig.imageName
    }:latest and ${registry}/${
      pluginConfig.imageName
    }:${version} to GitLab registry`
  )

  // Push both new version and latest
  execa('docker', ['push', `${registry}/${pluginConfig.imageName}:latest`], {
    stdio: 'inherit',
  })
  execa(
    'docker',
    [
      'tag',
      `${registry}/${pluginConfig.imageName}:latest`,
      `${registry}/${pluginConfig.imageName}:${version}`,
    ],
    { stdio: 'inherit' },
  )
  execa(
    'docker',
    ['push', `${registry}/${pluginConfig.imageName}:${version}`],
    { stdio: 'inherit' },
  )
}
