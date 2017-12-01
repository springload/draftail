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

## Upgrade considerations

### Draft.js

Draft.js is relatively stable but also historically slow to address bugs. Draftail sometimes has to override behavior in a way that may be problematic if the Draft.js API is updated.

When upgrading to a more recent Draft.js version, always review the full [CHANGELOG](https://github.com/facebook/draft-js/blob/master/CHANGELOG.md) as well as individual changes.

Here are specific parts of the code that may need thorough review, and updating, or that we may be able to remove:

* https://github.com/springload/draftail/blob/df903f86c882bd5101eb05e152e8b8a8b9a4915e/lib/blocks/MediaBlock.js#L60-L71
* https://github.com/springload/draftail/commit/431c3fd09c4cfc043c8b334544b05b9f580b75d2
* https://github.com/springload/draftail/blob/df903f86c882bd5101eb05e152e8b8a8b9a4915e/lib/api/behavior.js#L100-L110
* https://github.com/springload/draftail/commit/8d9de77349cd2f7ee1cba36b03f2946a21039dde
* https://github.com/springload/draftail/blob/df903f86c882bd5101eb05e152e8b8a8b9a4915e/lib/api/behavior.js#L23:L26

### DraftJS utils

Always pinned to an exact version so we can review individual changes when deciding to upgrade. Look at the [package.json](https://github.com/jpuri/draftjs-utils/blob/master/package.json) for version compatibility with other dependencies.

### Immutable

Always use the same version range as that of Draft.js: [package.json](https://github.com/facebook/draft-js/blob/master/package.json).

### Jest

* For Jest 21.3.0: https://github.com/springload/draftail/blob/df903f86c882bd5101eb05e152e8b8a8b9a4915e/lib/tests/polyfills.js#L3:L8

### Webpack

We generally follow the configuration of [create-react-app](https://github.com/facebookincubator/create-react-app);

* UglifyJS issues: https://github.com/springload/draftail/blob/df903f86c882bd5101eb05e152e8b8a8b9a4915e/webpack/webpack.config.prod.js#L15-L31

## Demo site

Website favicons generated with [RealFaviconGenerator](https://realfavicongenerator.net/).

Original pencil icon is the [Noun project crayon](https://commons.wikimedia.org/wiki/File:Noun_project_-_crayon.svg) dedicated to the public domain (CC0) by D. Charbonnier.
