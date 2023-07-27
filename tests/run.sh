#!/usr/bin/env sh

set -o errexit
set -o nounset

# Setting up the environment:
git init
git config --global init.defaultBranch master

# Running tests:
semantic-release --dry-run
