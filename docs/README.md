# Draftail documentation

## Editor behavior

### Keyboard shortcuts

We support keyboard shortcuts inspired by the ones used in [Google Docs](https://support.google.com/docs/answer/179738), thanks to [Draft.js key bindings](https://facebook.github.io/draft-js/docs/advanced-topics-key-bindings.html).

| Function                                          | Shortcut                         | Shortcut (macOS)                    |
| ------------------------------------------------- | -------------------------------- | ----------------------------------- |
| **Common actions**                                |                                  |                                     |
| Copy                                              | `Ctrl + C`                       | `⌘ + C`                             |
| Cut                                               | `Ctrl + X`                       | `⌘ + X`                             |
| Paste                                             | `Ctrl + V`                       | `⌘ + V`                             |
| Paste without formatting                          | `Ctrl + Shift + V`               | `⌘ + Shift + V`                     |
| Undo                                              | `Ctrl + Z`                       | `⌘ + Z`                             |
| Redo                                              | `Ctrl + Shift + Z`               | `⌘ + Shift + Z`                     |
| Insert or edit link                               | `Ctrl + K`                       | `⌘ + K`                             |
| Open link                                         | `Alt + Enter`                    | `Option + Enter`                    |
| **Text formatting (if enabled)**                  |                                  |                                     |
| Bold                                              | `Ctrl + B`                       | `⌘ + B`                             |
| Italicize                                         | `Ctrl + I`                       | `⌘ + I`                             |
| Underline                                         | `Ctrl + U`                       | `⌘ + U`                             |
| Monospace (code)                                  | `Ctrl + J`                       | `⌘ + J`                             |
| Strikethrough                                     | `Ctrl + Shift + X`               | `⌘ + Shift + X`                     |
| Superscript                                       | `Ctrl + .`                       | `⌘ + .`                             |
| Subscript                                         | `Ctrl + ,`                       | `⌘ + ,`                             |
| **Paragraph formatting (if enabled)**             |                                  |                                     |
| Increase list indentation                         | `Tab`                            | `Tab`                               |
| Decrease list indentation                         | `Shift + Tab`                    | `Shift + Tab`                       |
| Apply normal text style                           | `Ctrl + Alt + 0`                 | `⌘ + Option + 0`                    |
| Apply heading style [1-6]                         | `Ctrl + Alt + [1-6]`             | `⌘ + Option + [1-6]`                |
| Numbered list                                     | `Ctrl + Shift + 7`               | `⌘ + Shift + 7`                     |
| Bulleted list                                     | `Ctrl + Shift + 8`               | `⌘ + Shift + 8`                     |
| Go to new line                                    | `Enter`                          | `Enter`                             |
| Insert soft new line                              | `Shift + Enter`                  | `Shift + Enter`                     |
| Insert soft new line                              | `Ctrl + Enter`                   | `⌘ + Enter`                         |
| **Text selection with keyboard**                  |                                  |                                     |
| Select all                                        | `Ctrl + A`                       | `⌘ + A`                             |
| Extend selection one character                    | `Shift + Left/right arrow`       | `Shift + Left/right arrow`          |
| Extend selection one line                         | `Shift + Up/down arrow`          | `Shift + Up/down arrow`             |
| Extend selection one word                         | `Alt + Shift + Left/right arrow` | `Option + Shift + Left/right arrow` |
| Extend selection to the beginning of the line     | `Ctrl + Shift + Left arrow`      | `⌘ + Shift + Left arrow`            |
| Extend selection to the end of the line           | `Ctrl + Shift + Right arrow`     | `⌘ + Shift + Right arrow`           |
| Extend selection to the beginning of the document | `Shift + Home`                   | `Shift + Home`                      |
| Extend selection to the end of the document       | `Shift + End`                    | `Shift + End`                       |
| **Text selection with mouse**                     |                                  |                                     |
| Select word                                       | `Double-click`                   | `Double-click`                      |
| Extend selection one word at a time               | `Double-click + Drag`            | `Double-click + Drag`               |
| Select paragraph                                  | `Triple-click`                   | `Triple-click`                      |
| Extend selection one paragraph at a time          | `Triple-click + Drag`            | `Triple-click + Drag`               |

### Expected behavior

* Pressing return on an empty list item should un-indent it until it is not nested, and then remove it.
* Pressing return at the end of a block should create an empty unstyled block.
* Atomic blocks (images, embeds, `hr`) are always preceded and followed by a block (empty if no other block is present). See [facebook/draft-js#327](https://github.com/facebook/draft-js/issues/327).
* Blocks starting with "- ", "\* ", "1. " are automatically converted to list items.

- Pasting content with block nesting above the configured maxium should reduce the depth up to the maximum.

### Unsupported scenarios

* Nesting `ol` inside `ul` or the other way around.

## Browser support

**Supported browser / device versions:**

| Browser       | Device/OS | Version    | Notes                                                               |
| ------------- | --------- | ---------- | ------------------------------------------------------------------- |
| Mobile Safari | iOS       | latest     |                                                                     |
| Mobile Safari | iOS       | latest - 1 | Mobile Safari updates are tied to iOS updates, which are infrequent |
| Chrome        | Android   | latest     |                                                                     |
| IE            | Windows   | 11         |                                                                     |
| MS Edge       | Windows   | latest     |                                                                     |
| Chrome        | Desktop   | latest     |                                                                     |
| Firefox       | Desktop   | latest     |                                                                     |
| Safari        | OSX       | latest     |                                                                     |

For all browser versions defined as "latest", we will ensure support by using a combination of:

* Manual tests on Nightly & Beta browser releases during development.
* Manual & automated tests on latest stable releases during development & testing.
* Automated tests on recent stable releases during testing.

**Unsupported browser / device versions:**

| Browser       | Device/OS     | Version | Notes |
| ------------- | ------------- | ------- | ----- |
| Stock browser | Android       | 4       |       |
| Stock browser | Windows Phone | ?       |       |
| IE            | Desktop       | 10      |       |
| IE            | Desktop       | 9       |       |
| IE            | Desktop       | 8       |       |

## R&D notes

### Other Draft.js editors

> Full list on https://github.com/nikgraf/awesome-draft-js

Other approaches:

* http://slatejs.org/
* http://quilljs.com/

### Other Wagtail-integrated editors to learn from

Things to borrow: keyboard shortcuts, Wagtail integration mechanism,

* https://github.com/jaydensmith/wagtailfroala
* https://github.com/isotoma/wagtailtinymce
* https://github.com/dperetti/Django-wagtailmedium

### Things that it would be cool to support in the future

* Emojis
* Hashtags
* Linkification
* Mentions
* Undo/redo buttons
* Character / word counter
* Markdown syntax shortcuts (see https://github.com/brijeshb42/medium-draft/blob/ec7aa4315b9aea2eb5c12241052fffe5a5f601ea/src/util/beforeinput.js)
* UI displaying all available keyboard shortcuts (`cmd + /`)
* Drag and drop image insertion
* Custom inline styles (see https://github.com/jpuri/draftjs-utils/commit/02f452cef415a20351d809fac3b87b9f2ae5f7a9, https://github.com/jpuri/draftjs-utils/commit/6a12f693330f0e8a82ec0461661be505f16b6003)
* Smart quotes replacement
* https://github.com/globocom/megadraft/blob/master/src/utils.js#L67

## Demo site

Website favicons generated with [RealFaviconGenerator](https://realfavicongenerator.net/).

Original pencil icon is the [Noun project crayon](https://commons.wikimedia.org/wiki/File:Noun_project_-_crayon.svg) dedicated to the public domain (CC0) by D. Charbonnier.
