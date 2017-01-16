draftail documentation
======================

## Editor behavior

### Keyboard shortcuts

We support keyboard shortcuts inspired by the ones used in [Google Docs](https://support.google.com/docs/answer/179738?co=GENIE.Platform%3DDesktop&hl=en), thanks to [Draft.js key bindings](https://facebook.github.io/draft-js/docs/advanced-topics-key-bindings.html).

| Function | Shortcut |
|----------|----------|
| **Common actions** ||
| Copy | ⌘ + C |
| Cut | ⌘ + X |
| Paste | ⌘ + V |
| Paste without formatting | ⌘ + Shift + V |
| Undo | ⌘ + Z |
| Redo | ⌘ + Shift + Z |
| Insert or edit link | ⌘ + K |
| Open link | Option + Enter |
| Text formatting (if enabled) ||
| Bold | ⌘ + B |
| Italicize | ⌘ + I |
| Underline | ⌘ + U |
| Monospace (code) | ⌘ + J |
| Strikethrough | Option + Shift + 5 |
| **Paragraph formatting (if enabled)** ||
| Increase list indentation | Tab  |
| Decrease list indentation | Shift + Tab |
| Apply normal text style | ⌘ + Option + 0 |
| Apply heading style [1-6] | ⌘ + Option + [1-6] |
| Numbered list | ⌘ + Shift + 7 |
| Bulleted list | ⌘ + Shift + 8 |
| Go to new line | Enter  |
| Insert soft new line | Shift + Enter |
| Insert soft new line | ⌘ + Enter |
| **Text selection with keyboard** ||
| Select all | ⌘ + A |
| Extend selection one character | Shift + Left/right arrow |
| Extend selection one line | Shift + Up/down arrow |
| Extend selection one word | Option + Shift + Left/right arrow |
| Extend selection to the beginning of the line | ⌘ + Shift + Left arrow |
| Extend selection to the end of the line | ⌘ + Shift + Right arrow |
| Extend selection to the beginning of the document | Shift + Home |
| Extend selection to the end of the document | Shift + End |
| **Text selection with mouse** ||
| Select word | Double-click |
| Extend selection one word at a time | Double-click + drag |
| Select paragraph | Triple-click |
| Extend selection one paragraph at a time | Triple-click + drag |

### Expected behavior

- Pressing return on an empty list item should un-indent it until it is not nested, and then remove it.
- Pressing return at the end of a block should create an empty unstyled block.
- Atomic blocks (images, embeds, `hr`) are always preceded and followed by an empty block. See [facebook/draft-js#327](https://github.com/facebook/draft-js/issues/327).

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

- https://github.com/ianstormtaylor/slate
- http://quilljs.com/

### Other Wagtail-integrated editors to learn from

Things to borrow: keyboard shortcuts, Wagtail integration mechanism,

- https://github.com/jaydensmith/wagtailfroala
- https://github.com/isotoma/wagtailtinymce

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
