draftail [![npm](https://img.shields.io/npm/v/draftail.svg?style=flat-square)](https://www.npmjs.com/package/draftail) [![Build Status](https://travis-ci.org/springload/draftail.svg?branch=master)](https://travis-ci.org/springload/draftail) [![Dependency Status](https://david-dm.org/springload/draftail.svg?style=flat-square)](https://david-dm.org/springload/draftail) [![devDependency Status](https://david-dm.org/springload/draftail/dev-status.svg?style=flat-square)](https://david-dm.org/springload/draftail#info=devDependencies)
=========

> A batteries-excluded rich text editor based on [Draft.js](https://facebook.github.io/draft-js/). :memo::cocktail:

This is a work in progress. It is intended to be integrated into [Wagtail](https://wagtail.io/).

```sh
npm install --save draftail
```

## Development

### Install

> Clone the project on your computer, and install [Node](https://nodejs.org). This project also uses [nvm](https://github.com/springload/frontend-starter-kit/blob/master/docs/useful-tooling.md#nvm).

```sh
nvm install
# Then, install all project dependencies.
npm install
```

### Working on the project

> Everything mentioned in the installation process should already be done.

```sh
# Make sure you use the right node version.
nvm use
# Start the server and the development tools.
npm run start
# Runs linting.
npm run lint
# Runs tests.
npm run test
# View other available commands with:
npm run
```

### Publish

```sh
git release x.y.z
npm run dist
# Use irish-pub to check the package content. Install w/ npm install -g first.
irish-pub
npm publish
```
