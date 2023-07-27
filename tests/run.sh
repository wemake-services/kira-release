#!/usr/bin/env sh

set -o errexit
set -o nounset

# Setting up the environment:
git config --global init.defaultBranch master
git init

# Running tests:
semantic-release --dry-run
