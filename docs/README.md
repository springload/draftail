draftail documentation
======================

## Editor behavior

### Keyboard shortcuts

We support most of the common keyboard shortcuts users would expect to find in text editors thanks to [Draft.js key bindings](https://facebook.github.io/draft-js/docs/advanced-topics-key-bindings.html).

Here are the most important shortcuts:

|Shortcut|Function|
|--------|--------|
|Cmd + B | Bolden text (if enabled) |
|Cmd + I | Italicise text (if enabled) |
|Cmd + U | Underline text (if enabled) |
|Cmd + J | Format as code (if enabled) |
|Cmd + Z | Undo |
|Cmd + Maj + Z | Redo |
|Cmd + Left | Move selection to start of block |
|Cmd + Right | Move selection to end of block |
|Cmd + Tab|Increase indentation of list items|
|Cmd + Maj + Tab|Decrease indentation of list items|

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
