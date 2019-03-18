# Kira Release Bot

[![wemake.services](https://img.shields.io/badge/%20-wemake.services-green.svg?label=%20&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC%2FxhBQAAAAFzUkdCAK7OHOkAAAAbUExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP%2F%2F%2F5TvxDIAAAAIdFJOUwAjRA8xXANAL%2Bv0SAAAADNJREFUGNNjYCAIOJjRBdBFWMkVQeGzcHAwksJnAPPZGOGAASzPzAEHEGVsLExQwE7YswCb7AFZSF3bbAAAAABJRU5ErkJggg%3D%3D)](https://wemake.services)
[![kira-family](https://img.shields.io/badge/kira-family-pink.svg)](https://github.com/wemake-services/kira)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Dependencies Status](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg)](https://github.com/wemake-services/kira-release/pulls?utf8=%E2%9C%93&q=is%3Apr%20author%3Aapp%2Fdependabot)

Automate routine work with releasing new versions.

Part of the [`@kira`](https://github.com/wemake-services/kira) bots family.


## How does it work?

Our release bot does make sure that everything is ready for the next release:
1. Version is [semantically](https://semver.org/) bumped
2. Git tags are in place
3. Changelog is up-to-date

Every commit is validated to be compatible to [`conventional-changelog`](https://github.com/conventional-changelog)
format (here's our format just for example):

```js
/^(revert: )?(feat|fix|docs|refactor|test|chore)(\(.+\))?: .{1,50} refs #\d+/
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
remote: GitLab: Commit message does not follow the pattern '/^(revert: )?(feat|fix|docs|refactor|test|chore)(\(.+\))?: .{1,50} refs #\d+/'
```

So, when the time to release comes our bot calculates
a new semantic version since the last tagged release,
creates a changelog entry, commits it to the project,
and tags a new release with the newly calculated version number.

Then you can execute any deployment
scripts you have to distribute your project.

Internally we use [`standard-version`](https://github.com/conventional-changelog/standard-version) and expose the same [life-cycle hooks](https://github.com/conventional-changelog/standard-version#lifecycle-scripts).


## Gitlab CI setup

It is recommended to use this bot as a part of your CI.
There are two possible ways to release your software:
1. On every push to `master` (we consider `master` branch protected by default)
2. Manually by setting up [`manual` CI jobs](https://docs.gitlab.com/ee/ci/yaml/#whenmanual)


## Running

Create a job inside `.gitlab-ci.yml`:

```yml
release:
  stage: deploy
  allow_failure: false
  image: node:10
  # Uncomment to make the release process manual:
  # when: manual
  install:
    - npm install -g standard-version
  script:
    - standard-version --no-verify --git-tag-fallback
  cache:
    paths:
      - node_modules/
```
