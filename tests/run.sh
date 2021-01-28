#!/usr/bin/env sh

set -o errexit
set -o nounset

# Setting up the environment:
git init

# Running tests:
semantic-release --dry-run
