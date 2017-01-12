draftail documentation
======================

## Editor behavior

### Keyboard shortcuts

We support most of the common keyboard shortcuts users would expect to find in text editors, thanks to [Draft.js key bindings](https://facebook.github.io/draft-js/docs/advanced-topics-key-bindings.html).

#### Common actions

| Function | Shortcut |
|----------|----------|
| Copy | Ctrl + C |
| Cut | Ctrl + X |
| Paste | Ctrl + V |
| Paste without formatting | Ctrl + Shift + V |
| Undo | Ctrl + Z |
| Redo | Ctrl + Shift + Z |

#### Text formatting (if enabled)

| Function | Shortcut |
|----------|----------|
| Bold | Cmd + B |
| Italicize | Cmd + I |
| Underline | Cmd + U |
| Monospace (code) | Cmd + J |
| Strikethrough | Option + Shift + 5 |

#### Other

| Function | Shortcut |
|----------|----------|
| Ctrl + Left | Move focus to start of block |
| Ctrl + Right | Move focus to end of block |
| Tab | Increase indentation of list items |
| Shift + Tab | Decrease indentation of list items |

#### Unsupported

Other shortcuts we would like to support in the future:

|Shortcut|Function|
|--------|--------|
|Cmd + Option + 1/2/3/4/5/6 | Format as heading level |
|Cmd + Option + 0 | Format as paragraph |
|Cmd + K  | Create a link (if enabled) |

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
