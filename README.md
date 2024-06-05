# Kira Release Bot

[![wemake.services](https://img.shields.io/badge/%20-wemake.services-green.svg?label=%20&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC%2FxhBQAAAAFzUkdCAK7OHOkAAAAbUExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP%2F%2F%2F5TvxDIAAAAIdFJOUwAjRA8xXANAL%2Bv0SAAAADNJREFUGNNjYCAIOJjRBdBFWMkVQeGzcHAwksJnAPPZGOGAASzPzAEHEGVsLExQwE7YswCb7AFZSF3bbAAAAABJRU5ErkJggg%3D%3D)](https://wemake.services)
[![kira-family](https://img.shields.io/badge/kira-family-pink.svg)](https://github.com/wemake-services/kira)
![Build](https://github.com/wemake-services/kira-release/workflows/Build/badge.svg?branch=master&event=push)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Dependencies Status](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg)](https://github.com/wemake-services/kira-release/pulls?utf8=%E2%9C%93&q=is%3Apr%20author%3Aapp%2Fdependabot)

Automate routine work with releasing new versions.

Part of the [`@kira`](https://github.com/wemake-services/kira) bots family.

## Release steps

So, when the time to release comes our bot:

1. calculates a new semantic version since the last tagged release,
2. summarizes the release notes from these commits,
3. creates a signed GitLab release,
4. creates a changelog entry, commits it to the project,
5. tags a new release with the newly calculated version number,
6. optionally uploads new `docker` images to GitLab registry

Internally we use [`semantic-release`](https://github.com/semantic-release/semantic-release).
With multiple plugins.

## How does it work?

Every commit is validated to be compatible to [`conventional-changelog`](https://github.com/conventional-changelog)
format (here's [our format](https://github.com/wemake-services/kira-setup/blob/master/kira_setup/pipelines/project.py#L7) just for example):

```js
/^(revert: )?(feat|fix|docs|refactor|chore)(\(.+\))?:.{1,50}refs #\d+/
```

However, we **do not** enforce any particular format with this project.
You are free to choose any existing or create your own.

We also recommend to enforce this format in [Gitlab's push rules](https://docs.gitlab.com/ee/push_rules/push_rules.html#commit-messages-with-a-specific-reference).

In this case I won't be able to push incorrect commit messages:

```
» git push
Counting objects: 3, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 692 bytes | 692.00 KiB/s, done.
Total 3 (delta 2), reused 0 (delta 0)
remote: GitLab: Commit message does not follow the pattern '/^(revert: )?(feat|fix|docs|refactor|chore) ...'
```

## Gitlab CI setup

It is recommended to use this bot as a part of your CI.
There are two possible ways to release your software:

1. On every push to `master` (we consider `master` branch protected by default)
2. Manually by setting up [`manual` CI jobs](https://docs.gitlab.com/ee/ci/yaml/#whenmanual)

### Extra settings

They are not required, but may help you:

0. Invite `@kira-bot` to your project
1. All [tags must be protected](https://docs.gitlab.com/ee/user/project/protected_tags.html), only `@kira-bot` is allowed to create them
2. [`master` branch must be protected](https://docs.gitlab.com/ee/user/project/protected_branches.html), only `@kira-bot` is allowed to push

### CI variables

You are required to set:

- `GITLAB_TOKEN` secret variable in CI configuration

You can also optionally set:

- `KIRA_RELEASE_SKIP_DOCKER` to `'true'`, so your `docker` image deploy will be skipped
- `KIRA_RELEASE_ASSETS` to any [assets](https://github.com/semantic-release/git#assets) string, so it will upload these files to GitLab release
- `KIRA_RELEASE_EXEC_CONFIG` string with `json` config to pass to [`@semantic-release/exec`](https://github.com/semantic-release/exec). Related docs on [why](https://semantic-release.gitbook.io/semantic-release/support/faq#how-can-i-use-a-npm-build-script-that-requires-the-package-jsons-version) would you possibly need this
- `KIRA_RELEASE_REPLACE_CONFIG` string with `json` config of how to [bump version numbers](https://github.com/google/semantic-release-replace-plugin) in a project definition file, example: `KIRA_RELEASE_REPLACE_CONFIG='{ "project": "package.json", "from": "\"version\": \".*\"", "to": "\"version\": \"${nextRelease.version}\"" }'`
- `KIRA_RELEASE_BRANCHES` [to semantic release branches](https://semantic-release.gitbook.io/semantic-release/usage/configuration#branches) default: `['master',  'main']`

**Note:** You might want to use `$$` to escape `$` char in several environments like GitLab CI configuration file


## Container release

We use five ebv variables to publish pre-built containers into the registry.
Basically, this is ready to work with GitLab CI and GitLab Container registry,
but you can modify it to work with any registry / CI.
For example, we use GitHub Container Registry in this project's CI
(see `.github/workflows/test.yml`).

Variables:
- `CI_REGISTRY`: what registry you use: `registry.gitlab.com`, `ghrc.io`, or any other
- `CI_REGISTRY_USER`: username to use for login
- `CI_JOB_TOKEN`: the token we use to auth, can be any token that your registry supports
- `CI_PROJECT_NAMESPACE`: organization name to use in image name
- `CI_PROJECT_NAME`: project name to use in image name


## Running

Copy-paste our `.gitlab-ci.yml` file. And modify it to match your project.


## Credis

Special thanks to:
- [`semantic-release-gitlab-docker`](https://gitlab.com/foxfarmroad/semantic-release-gitlab-docker) which we used before creating our own `GitLab` + `docker` release script
