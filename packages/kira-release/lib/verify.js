module.exports = async (pluginConfig, { logger }) => {
  const execa = await import('execa')

  const requiredEnvVars = [
    'CI_JOB_TOKEN',
    'CI_REGISTRY_USER',
    'CI_REGISTRY',
    'GROUP_NAME',
    'PROJECT_NAME',
  ]
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Environment variable ${envVar} is not set`)
    }
  }

  if (!pluginConfig.imageName) {
    throw new Error('image name is not set in the config')
  }

  try {
    await execa(
      'docker',
      [
        'login',
        `-u=${process.env.CI_REGISTRY_USER}`,
        `-p=${process.env.CI_JOB_TOKEN}`,
        process.env.CI_REGISTRY,
      ],
      {
        stdio: 'inherit',
      },
    )
  } catch (err) {
    throw new Error('GitLab registry login failed', { cause: err })
  }
}
