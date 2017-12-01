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

## Demo site

Website favicons generated with [RealFaviconGenerator](https://realfavicongenerator.net/).

Original pencil icon is the [Noun project crayon](https://commons.wikimedia.org/wiki/File:Noun_project_-_crayon.svg) dedicated to the public domain (CC0) by D. Charbonnier.
