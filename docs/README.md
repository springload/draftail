# Draftail documentation

## Editor behavior

### Keyboard shortcuts

We support keyboard shortcuts inspired by the ones used in [Google Docs](https://support.google.com/docs/answer/179738), thanks to [Draft.js key bindings](https://facebook.github.io/draft-js/docs/advanced-topics-key-bindings.html).

| Function                                          | Shortcut               | Shortcut (macOS)          | Alternative |
| ------------------------------------------------- | ---------------------- | ------------------------- | ----------- |
| **Common actions**                                |                        |                           |             |
| Copy                                              | `Ctrl + C`             | `⌘ + C`                   |             |
| Cut                                               | `Ctrl + X`             | `⌘ + X`                   |             |
| Paste                                             | `Ctrl + V`             | `⌘ + V`                   |             |
| Paste without formatting                          | `Ctrl + Shift + V`     | `⌘ + Shift + V`           |             |
| Undo                                              | `Ctrl + Z`             | `⌘ + Z`                   |             |
| Redo                                              | `Ctrl + Shift + Z`     | `⌘ + Shift + Z`           |             |
| Insert or edit link                               | `Ctrl + K`             | `⌘ + K`                   |             |
| Open link                                         | `Alt + Enter`          | `Option + Enter`          |             |
| Insert horizontal rule                            |                        |                           | `---`       |
| **Text formatting (if enabled)**                  |                        |                           |             |
| Bold                                              | `Ctrl + B`             | `⌘ + B`                   |             |
| Italicize                                         | `Ctrl + I`             | `⌘ + I`                   |             |
| Underline                                         | `Ctrl + U`             | `⌘ + U`                   |             |
| Monospace (code)                                  | `Ctrl + J`             | `⌘ + J`                   |             |
| Strikethrough                                     | `Ctrl + Shift + X`     | `⌘ + Shift + X`           |             |
| Superscript                                       | `Ctrl + .`             | `⌘ + .`                   |             |
| Subscript                                         | `Ctrl + ,`             | `⌘ + ,`                   |             |
| **Paragraph formatting (if enabled)**             |                        |                           |             |
| Increase list indentation                         | `Tab`                  | `Tab`                     |             |
| Decrease list indentation                         | `Shift + Tab`          | `Shift + Tab`             |             |
| Apply normal text style                           | `Ctrl + Alt + 0`       | `⌘ + Option + 0`          | `Backspace` |
| Apply heading style [1-6]                         | `Ctrl + Alt + [1-6]`   | `⌘ + Option + [1-6]`      | `## Space`  |
| Numbered list                                     | `Ctrl + Shift + 7`     | `⌘ + Shift + 7`           | `1. Space`  |
| Bulleted list                                     | `Ctrl + Shift + 8`     | `⌘ + Shift + 8`           | `- Space`   |
| Blockquote                                        |                        |                           | `> Space`   |
| Code block                                        |                        |                           | ` ``` `     |
| Go to new line                                    | `Enter`                | `Enter`                   |             |
| Insert soft new line                              | `Shift + Enter`        | `Shift + Enter`           |             |
| Insert soft new line                              | `Ctrl + Enter`         | `⌘ + Enter`               |             |
| **Text selection with keyboard**                  |                        |                           |             |
| Select all                                        | `Ctrl + A`             | `⌘ + A`                   |             |
| Extend selection one character                    | `Shift + ← or →`       | `Shift + ← or →`          |             |
| Extend selection one line                         | `Shift + ↑ or ↓`       | `Shift + ↑ or ↓`          |             |
| Extend selection one word                         | `Alt + Shift + ← or →` | `Option + Shift + ← or →` |             |
| Extend selection to the beginning of the line     | `Ctrl + Shift + ←`     | `⌘ + Shift + ←`           |             |
| Extend selection to the end of the line           | `Ctrl + Shift + →`     | `⌘ + Shift + →`           |             |
| Extend selection to the beginning of the document | `Shift + Home`         | `Shift + Home`            |             |
| Extend selection to the end of the document       | `Shift + End`          | `Shift + End`             |             |
| **Text selection with mouse**                     |                        |                           |             |
| Select word                                       | `Double-click`         | `Double-click`            |             |
| Extend selection one word at a time               | `Double-click + Drag`  | `Double-click + Drag`     |             |
| Select paragraph                                  | `Triple-click`         | `Triple-click`            |             |
| Extend selection one paragraph at a time          | `Triple-click + Drag`  | `Triple-click + Drag`     |             |

### Expected behavior

* Pressing return on an empty list item should un-indent it until it is not nested, and then remove it.
* Pressing return at the end of a block should create an empty unstyled block.
* Atomic blocks (images, embeds, `hr`) are always preceded and followed by a block (empty if no other block is present). See [facebook/draft-js#327](https://github.com/facebook/draft-js/issues/327).
* Blocks starting with "- ", "\* ", "1. " are automatically converted to list items.
* Pasting content with block nesting above the configured maxium should reduce the depth up to the maximum.

#### Cut-copy-pasting test plan

Use the [Draft.js Cut/Copy/Paste testing plan](https://github.com/facebook/draft-js/wiki/Manual-Testing#cutcopypaste). We target specific external sources, and have ready-made test documents available to test them:

##### External sources

Here are external sources we want to pay special attention to, and for which we have ready-made test documents with diverse rich content.

* [ ] [Microsoft Word](https://products.office.com/en/word): [Test document](https://drive.google.com/open?id=13JGWTFIFk5gjD0g3sEcZJhBKKXaq9SEC)
* [ ] [Microsoft Word Online](https://office.live.com/start/Word.aspx): [Test document](https://1drv.ms/w/s!AuGin45FpiF5hjzm9QdWHYGqPrqm)
* [ ] [Google Docs](https://docs.google.com/): [Test document](https://docs.google.com/document/d/1YjqkIMC3q4jAzy__-S4fb6mC_w9EssmA6aZbGYWFv80/edit)
* [ ] [Apple Pages](https://www.apple.com/lae/pages/): [Test document](https://drive.google.com/open?id=12jCB-l6MOYsNjN-NWXNsen8ThGupX_g4)
* [ ] [Dropbox Paper](https://www.dropbox.com/paper): [Test document](https://paper.dropbox.com/doc/Draft.js-paste-test-document-njfdkwmkeGQ9KICjVwLmU)

## Upgrade considerations

### Draft.js

Draft.js is relatively stable but also historically slow to address bugs. Draftail sometimes has to override behavior in a way that may be problematic if the Draft.js API is updated.

When upgrading to a more recent Draft.js version, always review the full [CHANGELOG](https://github.com/facebook/draft-js/blob/master/CHANGELOG.md) as well as individual changes.

Here are specific parts of the code that **should always be reviewed before upgrading**, and may need to be updated, or that we may be able to remove:

* https://github.com/springload/draftail/blob/df903f86c882bd5101eb05e152e8b8a8b9a4915e/lib/blocks/MediaBlock.js#L60-L71
* https://github.com/springload/draftail/commit/431c3fd09c4cfc043c8b334544b05b9f580b75d2
* https://github.com/springload/draftail/blob/df903f86c882bd5101eb05e152e8b8a8b9a4915e/lib/api/behavior.js#L100-L110
* https://github.com/springload/draftail/commit/8d9de77349cd2f7ee1cba36b03f2946a21039dde
* https://github.com/springload/draftail/blob/df903f86c882bd5101eb05e152e8b8a8b9a4915e/lib/api/behavior.js#L23:L26
* https://github.com/springload/draftail/commit/162fc13e193ac581f662de393151efde477183b9
* https://github.com/springload/draftail/commit/88ae9adcda1929c92f065655a03c1b33fcfe6c2d
* https://github.com/springload/draftail/commit/e05df07f8ed6c5df65c79824bbb1dcd6e8800bdd

### DraftJS utils

Always pinned to an exact version so we can review individual changes when deciding to upgrade. Look at the [package.json](https://github.com/jpuri/draftjs-utils/blob/master/package.json) for version compatibility with other dependencies.

### Immutable

Always use the same version range as that of Draft.js: [package.json](https://github.com/facebook/draft-js/blob/master/package.json).

### Webpack

We generally follow the configuration of [create-react-app](https://github.com/facebookincubator/create-react-app);

* UglifyJS issues: https://github.com/springload/draftail/blob/df903f86c882bd5101eb05e152e8b8a8b9a4915e/webpack/webpack.config.prod.js#L15-L31

## Demo site

### Favicons

Favicons generated with [RealFaviconGenerator](https://realfavicongenerator.net/).

Original pencil icon is the [Noun project crayon](https://commons.wikimedia.org/wiki/File:Noun_project_-_crayon.svg) dedicated to the public domain (CC0) by D. Charbonnier.

### Static editor content

The demo site contains static content exported with [draftjs_exporter](https://github.com/springload/draftjs_exporter). It is placed there for SEO, and also to make the loading experience nicer.

To regenerate it, get the serialised ContentState for the index page's editor (in `sessionStorage`), go to [the exporter demo](https://draftjs-exporter.herokuapp.com), and place the ContentState in the `sessionStorage` value of that editor.
