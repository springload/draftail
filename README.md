[draftail](https://springload.github.io/draftail/) [![npm](https://img.shields.io/npm/v/draftail.svg?style=flat-square)](https://www.npmjs.com/package/draftail) [![Build Status](https://travis-ci.org/springload/draftail.svg?branch=master)](https://travis-ci.org/springload/draftail) [![Dependency Status](https://david-dm.org/springload/draftail.svg?style=flat-square)](https://david-dm.org/springload/draftail) [![devDependency Status](https://david-dm.org/springload/draftail/dev-status.svg?style=flat-square)](https://david-dm.org/springload/draftail#info=devDependencies)
=========

> A batteries-excluded rich text editor based on [Draft.js](https://facebook.github.io/draft-js/). :memo::cocktail:

This is a work in progress. It is intended to be integrated into [Wagtail](https://wagtail.io/). [Try a demo now](https://springload.github.io/draftail/).

```sh
npm install --save draftail
# Draftail's peerDependencies:
npm install --save draft-js@^0.9.x draftjs-utils@^0.3.2 immutable@^3.x.x react@^15.x.x react-dom@^15.x.x
```

There are other, not so explicit dependencies at the moment:

- jQuery 2, separately loaded onto the page.
- Specific styles from Wagtail, including its icon font.
- ES6 polyfill (like for Draft.js)

## Development

### Install

> Clone the project on your computer, and install [Node](https://nodejs.org). This project also uses [nvm](https://github.com/springload/frontend-starter-kit/blob/master/docs/useful-tooling.md#nvm).

```sh
nvm install
# Then, install all project dependencies.
npm install
# Optionally, install the git hooks.
./.githooks/deploy
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
git release vx.y.z
npm run dist
# Use irish-pub to check the package content. Install w/ npm install -g first.
irish-pub
npm publish
```
