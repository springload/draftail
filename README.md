[Draftail](https://springload.github.io/draftail/) [![npm](https://img.shields.io/npm/v/draftail.svg?style=flat-square)](https://www.npmjs.com/package/draftail) [![Build Status](https://travis-ci.org/springload/draftail.svg?branch=master)](https://travis-ci.org/springload/draftail) [![Coverage Status](https://coveralls.io/repos/github/springload/draftail/badge.svg)](https://coveralls.io/github/springload/draftail) [![Greenkeeper badge](https://badges.greenkeeper.io/springload/draftail.svg)](https://greenkeeper.io/)
=========

> A batteries-excluded rich text editor based on [Draft.js](https://facebook.github.io/draft-js/). :memo::cocktail:

[![Screenshot of Draftail](https://cdn.rawgit.com/springload/draftail/da8ca3db/.github/draftail-ui-screenshot.png)](https://springload.github.io/draftail/)

It is developed alongside our Python [Draft.js exporter](https://github.com/springload/draftjs_exporter), for integration into [Wagtail](https://wagtail.io/). Check out [wagtaildraftail](https://github.com/springload/wagtaildraftail), and the [online demo](https://springload.github.io/draftail/)!

## Features

> This project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html), and measures performance and [code coverage](https://coveralls.io/github/springload/draftail).

Draftail aims for a mouse-free, keyboard-centric experience. Most formatting can be done by using common keyboard shortcuts, inspired by [Google Docs](https://support.google.com/docs/answer/179738).

Here are important features worth highlighting:

- Support for [keyboard shortcuts](https://github.com/springload/draftail/tree/master/docs#keyboard-shortcuts).
- Autolists – start a line with `-` , `*` , `1.`  to create a list item.
- Undo / redo – until the end of times.
- Common text types: headings, paragraphs, quotes, lists.
- Common text styles: Bold, Italic, Underline, Monospace, Strikethrough.
- Built-in `Link` and `Document` controls.
- Built-in `Image` and `Embed` blocks.

## Usage

Draftail is meant to be used in scenarios where not all formatting should be available, and where custom formatting can be necessary. Available formats, built-in and custom, can be specificed declaratively for each editor instance.

First, grab the package from npm:

```sh
npm install --save draftail
# Draftail's peerDependencies:
npm install --save draft-js@^0.10.0 react@^15.5.0 react-dom@^15.5.0 prop-types@^15.5.0
# Note: Draft.js builds upon ES6 language features. If targeting browsers that do not support them,
# see https://facebook.github.io/draft-js/docs/advanced-topics-issues-and-pitfalls.html#polyfills.
```

Then, import the editor and use it in your code. Here is a [basic example](https://springload.github.io/draftail/example.html):

```js
import React from 'react';
import ReactDOM from 'react-dom';

import DraftailEditor, { BLOCK_TYPE, INLINE_STYLE } from 'draftail';

const initialContentState = JSON.parse(sessionStorage.getItem('basic:contentState')) || null;

const onSave = (contentState) => {
    sessionStorage.setItem('basic:contentState', JSON.stringify(contentState));
};

const editor = (
    <DraftailEditor
        rawContentState={initialContentState}
        onSave={onSave}
        blockTypes={[
            { label: 'H3', type: BLOCK_TYPE.HEADER_THREE },
            { label: 'UL', type: BLOCK_TYPE.UNORDERED_LIST_ITEM, icon: 'icon-list-ul' },
        ]}
        inlineStyles={[
            { label: 'Bold', type: INLINE_STYLE.BOLD, icon: 'icon-bold' },
            { label: 'Italic', type: INLINE_STYLE.ITALIC, icon: 'icon-italic' },
        ]}
    />
);

ReactDOM.render(editor, document.querySelector('[data-mount-basic]'));
```

### Configuration

#### Built-in formats

- Block types: `H1`, `H2`, `H3`, `H4`, `H5`, `H6`, `Blockquote`, `Code`, `UL`, `OL`, `P`
- Inline styles: `Bold`, `Italic`, `Underline`, `Monospace`, `Strikethrough`
- Entities: `Images`, `Embeds`, (`Links`, `Documents`)
- And `HR`, `BR` as special cases

#### Custom block types

TODO

#### Custom inline styles

TODO

#### Custom entity types

TODO

## Development

### Install

> Clone the project on your computer, and install [Node](https://nodejs.org). This project also uses [nvm](https://github.com/creationix/nvm).

```sh
nvm install
# Then, install all project dependencies.
npm install
# Install the git hooks.
./.githooks/deploy
# Set up a `.env` file with the appropriate secrets.
touch .env
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

### Releases

- Make a new branch for the release of the new version.
- Update the [CHANGELOG](CHANGELOG.md).
- Update the version number in `package.json`, following semver.
- Make a PR and squash merge it.
- Back on master with the PR merged, follow the instructions below.

```sh
npm run dist
# Use irish-pub to check the package content. Install w/ npm install -g first.
irish-pub
npm publish
```

- Finally, go to GitHub and create a release and a tag for the new version.
- Done!
