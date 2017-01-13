draftail documentation
======================

## Editor behavior

### Keyboard shortcuts

We support most of the common keyboard shortcuts users would expect to find in text editors, thanks to [Draft.js key bindings](https://facebook.github.io/draft-js/docs/advanced-topics-key-bindings.html).

#### Common actions

| Function | Shortcut |
|----------|----------|
| Copy | ⌘ + C |
| Cut | ⌘ + X |
| Paste | ⌘ + V |
| Paste without formatting | ⌘ + Shift + V |
| Undo | ⌘ + Z |
| Redo | ⌘ + Shift + Z |

#### Text formatting (if enabled)

| Function | Shortcut |
|----------|----------|
| Bold | ⌘ + B |
| Italicize | ⌘ + I |
| Underline | ⌘ + U |
| Monospace (code) | ⌘ + J |
| Strikethrough | Option + Shift + 5 |

#### Paragraph formatting (if enabled)

| Function | Shortcut |
|----------|----------|
| Increase list indentation | Tab  |
| Decrease list indentation | Shift + Tab |
| Apply normal text style | ⌘ + Option + 0 |
| Apply heading style [1-6] | ⌘ + Option + [1-6] |
| Numbered list | ⌘ + Shift + 7 |
| Bulleted list | ⌘ + Shift + 8 |
| Go to new line | Enter  |
| Insert soft new line | Shift + Enter |
| Insert soft new line | ⌘ + Enter |

#### Text selection with keyboard

| Function | Shortcut |
|----------|----------|
| Select all | ⌘ + A |
| Extend selection one character | Shift + Left/right arrow |
| Extend selection one line | Shift + Up/down arrow |
| Extend selection one word | Option + Shift + Left/right arrow |
| Extend selection to the beginning of the line | ⌘ + Shift + Left arrow |
| Extend selection to the end of the line | ⌘ + Shift + Right arrow |
| Extend selection to the beginning of the document | Shift + Home |
| Extend selection to the end of the document | Shift + End |

#### Text selection with mouse

| Function | Shortcut |
|----------|----------|
| Select word | Double-click |
| Extend selection one word at a time | Double-click + drag |
| Select paragraph | Triple-click |
| Extend selection one paragraph at a time | Triple-click + drag |

#### Unsupported

Other shortcuts we would like to support in the future:

| Function | Shortcut |
|----------|----------|
| Insert or edit link | ⌘ + K |
| Open link | Option + Enter |
| Show common keyboard shortcuts | ⌘ + / |

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

### Other Wagtail-integrated editors to learn from.

Things to borrow: keyboard shortcuts, Wagtail integration mechanism,

- https://github.com/jaydensmith/wagtailfroala
- https://github.com/isotoma/wagtailtinymce
