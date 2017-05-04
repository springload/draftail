Draftail documentation
======================

## Editor behavior

### Keyboard shortcuts

We support keyboard shortcuts inspired by the ones used in [Google Docs](https://support.google.com/docs/answer/179738), thanks to [Draft.js key bindings](https://facebook.github.io/draft-js/docs/advanced-topics-key-bindings.html).

| Function | Shortcut | Shortcut (macOS) |
|----------|----------|------------------|
| **Common actions** |||
| Copy | `ctrl + C` | `⌘ + C` |
| Cut | `ctrl + X` | `⌘ + X` |
| Paste | `ctrl + V` | `⌘ + V` |
| Paste without formatting | `ctrl + shift + V` | `⌘ + shift + V` |
| Undo | `ctrl + Z` | `⌘ + Z` |
| Redo | `ctrl + shift + Z` | `⌘ + shift + Z` |
| Insert or edit link | `ctrl + K` | `⌘ + K` |
| Open link | `alt + enter` | `option + enter` |
| **Text formatting (if enabled)** |||
| Bold | `ctrl + B` | `⌘ + B` |
| Italicize | `ctrl + I` | `⌘ + I` |
| Underline | `ctrl + U` | `⌘ + U` |
| Monospace (code) | `ctrl + J` | `⌘ + J` |
| Strikethrough | `alt + shift + 5` | `option + shift + 5` |
| **Paragraph formatting (if enabled)** |||
| Increase list indentation | `Tab` | `Tab` |
| Decrease list indentation | `shift + Tab` | `shift + Tab` |
| Apply normal text style | `ctrl + alt + 0` | `⌘ + option + 0` |
| Apply heading style [1-6] | `ctrl + alt + [1-6]` | `⌘ + option + [1-6]` |
| Numbered list | `ctrl + shift + 7` | `⌘ + shift + 7` |
| Bulleted list | `ctrl + shift + 8` | `⌘ + shift + 8` |
| Go to new line | `enter` | `enter` |
| Insert soft new line | `shift + enter` | `shift + enter` |
| Insert soft new line | `ctrl + enter` | `⌘ + enter` |
| **Text selection with keyboard** |||
| Select all | `ctrl + A` | `⌘ + A` |
| Extend selection one character | `shift + Left/right arrow` | `shift + Left/right arrow` |
| Extend selection one line | `shift + Up/down arrow` | `shift + Up/down arrow` |
| Extend selection one word | `alt + shift + Left/right arrow` | `option + shift + Left/right arrow` |
| Extend selection to the beginning of the line | `ctrl + shift + Left arrow` | `⌘ + shift + Left arrow` |
| Extend selection to the end of the line | `ctrl + shift + Right arrow` | `⌘ + shift + Right arrow` |
| Extend selection to the beginning of the document | `shift + Home` | `shift + Home` |
| Extend selection to the end of the document | `shift + End` | `shift + End` |
| **Text selection with mouse** |||
| Select word | `Double-click` | `Double-click` |
| Extend selection one word at a time | `Double-click + drag` | `Double-click + drag` |
| Select paragraph | `Triple-click` | `Triple-click` |
| Extend selection one paragraph at a time | `Triple-click + drag` | `Triple-click + drag` |

### Expected behavior

- Pressing return on an empty list item should un-indent it until it is not nested, and then remove it.
- Pressing return at the end of a block should create an empty unstyled block.
- Atomic blocks (images, embeds, `hr`) are always preceded and followed by a block (empty if no other block is present). See [facebook/draft-js#327](https://github.com/facebook/draft-js/issues/327).
- Blocks starting with "- ", "* ", "1. " are automatically converted to list items.


- Pasting content with block nesting above the configured maxium should reduce the depth up to the maximum.

### Unsupported scenarios

- Nesting `ol` inside `ul` or the other way around.

## Browser support

**Supported browser / device versions:**

| Browser | Device/OS | Version | Notes |
|---------|-----------|---------|-------|
| Mobile Safari | iOS | latest ||
| Mobile Safari | iOS | latest - 1 | Mobile Safari updates are tied to iOS updates, which are infrequent |
| Chrome | Android | latest ||
| IE | Windows | 11 ||
| MS Edge | Windows | latest ||
| Chrome | Desktop | latest ||
| Firefox | Desktop | latest ||
| Safari | OSX | latest ||

For all browser versions defined as "latest", we will ensure support by using a combination of:

- Manual tests on Nightly & Beta browser releases during development.
- Manual & automated tests on latest stable releases during development & testing.
- Automated tests on recent stable releases during testing.

**Unsupported browser / device versions:**

| Browser | Device/OS | Version | Notes |
|---------|-----------|---------|-------|
| Stock browser | Android | 4 |  |
| Stock browser | Windows Phone | ? |  |
| IE | Desktop | 10 |  |
| IE | Desktop | 9 |  |
| IE | Desktop | 8 |  |

## R&D notes

### Other Draft.js editors

> Full list on https://github.com/nikgraf/awesome-draft-js

Other approaches:

- http://slatejs.org/
- http://quilljs.com/

### Other Wagtail-integrated editors to learn from

Things to borrow: keyboard shortcuts, Wagtail integration mechanism,

- https://github.com/jaydensmith/wagtailfroala
- https://github.com/isotoma/wagtailtinymce
- https://github.com/dperetti/Django-wagtailmedium

### Things that it would be cool to support in the future

- Emojis
- Hashtags
- Linkification
- Mentions
- Undo/redo buttons
- Character / word counter
- Markdown syntax shortcuts (see https://github.com/brijeshb42/medium-draft/blob/ec7aa4315b9aea2eb5c12241052fffe5a5f601ea/src/util/beforeinput.js)
- UI displaying all available keyboard shortcuts (`cmd + /`)
- Drag and drop image insertion
- Custom inline styles (see https://github.com/jpuri/draftjs-utils/commit/02f452cef415a20351d809fac3b87b9f2ae5f7a9, https://github.com/jpuri/draftjs-utils/commit/6a12f693330f0e8a82ec0461661be505f16b6003)
- Smart quotes replacement
- https://github.com/globocom/megadraft/blob/master/src/utils.js#L67
