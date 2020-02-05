# `@eturino/ioredis-del-by-pattern`

[![npm version](https://badge.fury.io/js/%40eturino%2Fioredis-del-by-pattern.svg)](https://badge.fury.io/js/%40eturino%2Fioredis-del-by-pattern)
[![Build Status](https://travis-ci.org/eturino/ioredis-del-by-pattern.svg?branch=master)](https://travis-ci.org/eturino/ioredis-del-by-pattern)
[![Maintainability](https://api.codeclimate.com/v1/badges/653fcf67de9f3bc22c84/maintainability)](https://codeclimate.com/github/eturino/ioredis-del-by-pattern/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/653fcf67de9f3bc22c84/test_coverage)](https://codeclimate.com/github/eturino/ioredis-del-by-pattern/test_coverage)

[TypeDoc generated docs in here](https://eturino.github.io/ioredis-del-by-pattern)

[Github repo here](https://github.com/eturino/ioredis-del-by-pattern)

[ioredis](https://github.com/luin/ioredis) util to delete keys by pattern on redis. Supports batches (pipeline) and lets the user decide to use `del` or `unlink` methods.

## Installation

`yarn add @eturino/ioredis-del-by-pattern` or `npm install @eturino/ioredis-del-by-pattern`.

## Usage

TBD.

## Development, Commits, versioning and publishing

<details><summary>See documentation for development</summary>
<p>

See [The Typescript-Starter docs](https://github.com/bitjson/typescript-starter#bump-version-update-changelog-commit--tag-release).

### Commits and CHANGELOG

For commits, you should use [`commitizen`](https://github.com/commitizen/cz-cli)

```sh
yarn global add commitizen

#commit your changes:
git cz
```

As typescript-starter docs state:

This project is tooled for [conventional changelog](https://github.com/conventional-changelog/conventional-changelog) to make managing releases easier. See the [standard-version](https://github.com/conventional-changelog/standard-version) documentation for more information on the workflow, or [`CHANGELOG.md`](CHANGELOG.md) for an example.

```sh
# bump package.json version, update CHANGELOG.md, git tag the release
yarn run version
```

You may find a tool like [**`wip`**](https://github.com/bitjson/wip) helpful for managing work in progress before you're ready to create a meaningful commit.

### Creating the first version

Once you are ready to create the first version, run the following (note that `reset` is destructive and will remove all files not in the git repo from the directory).

```sh
# Reset the repo to the latest commit and build everything
yarn run reset && yarn run test && yarn run doc:html

# Then version it with standard-version options. e.g.:
# don't bump package.json version
yarn run version -- --first-release

# Other popular options include:

# PGP sign it:
# $ yarn run version -- --sign

# alpha release:
# $ yarn run version -- --prerelease alpha
```

And after that, remember to [publish the docs](#publish-the-docs).

And finally push the new tags to github and publish the package to npm.

```sh
# Push to git
git push --follow-tags origin master

# Publish to NPM (allowing public access, required if the package name is namespaced like `@somewhere/some-lib`)
yarn publish --access public
```

### Publish the Docs

```sh
yarn run doc:html && yarn run doc:publish
```

This will generate the docs and publish them in github pages.

### Generate a version

There is a single yarn command for preparing a new release. See [One-step publish preparation script in TypeScript-Starter](https://github.com/bitjson/typescript-starter#one-step-publish-preparation-script)

```sh
# Prepare a standard release
yarn prepare-release

# Push to git
git push --follow-tags origin master

# Publish to NPM (allowing public access, required if the package name is namespaced like `@somewhere/some-lib`)
yarn publish --access public
```

</p>
</details>
