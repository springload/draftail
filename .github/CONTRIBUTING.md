# Contribution Guidelines

Thank you for considering to help this project.

We welcome all support, whether on bug reports, feature requests, code, design, reviews, tests, documentation, and more.

Please note that this project is released with a [Contributor Code of Conduct](/docs/CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Discussing the editor's behavior

The behavior of this editor is heavily inspired by prior art. If you want to discuss changing how the editor behaves, please take some time to consider how other editors operate. We specifically refer to:

-   [ ] [Microsoft Word](https://products.office.com/en/word)
-   [ ] [Microsoft Word Online](https://office.live.com/start/Word.aspx)
-   [ ] [Google Docs](https://docs.google.com/)
-   [ ] [Apple Pages](https://www.apple.com/lae/pages/)
-   [ ] [Dropbox Paper](https://www.dropbox.com/paper)
-   [ ] [Gmail](https://www.google.com/gmail/)
-   [ ] [TinyMCE](https://www.tinymce.com/)
-   [ ] [CKEditor](https://ckeditor.com)
-   [ ] [Quill](https://quilljs.com/)
-   [ ] [Slate](http://slatejs.org/)
-   [ ] Other [Draft.js editors](https://github.com/nikgraf/awesome-draft-js)

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
# Re-formats all of the files in the project (with Prettier).
npm run format
# Run tests in a watcher.
npm run test:watch
# Run test coverage
npm run test:coverage
# Open the coverage report with:
npm run report:coverage
# Open the build report with:
npm run report:build
# Open the file size report with:
npm run report:size
# View other available commands with:
npm run
```

### Releases

-   Make a new branch for the release of the new version.
-   Update the [CHANGELOG](CHANGELOG.md).
-   Update the version number in `package.json`, following semver.
-   Make a PR and squash merge it.
-   Back on master with the PR merged, follow the instructions below.

```sh
npm run dist
# Use irish-pub to check the package content. Install w/ npm install -g first.
irish-pub
npm publish
```

-   Finally, go to GitHub and create a release and a tag for the new version.
-   Done!

> As a last step, you may want to go update the [Draftail Playground](https://github.com/thibaudcolas/draftail-playground) to this new release to check that all is well in a fully separate project.
