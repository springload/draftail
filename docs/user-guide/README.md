| :earth_africa: Translations                       |
| ------------------------------------------------- |
| **[:gb: English](/docs/user-guide/README.md)**    |
| [:fr: Français](/docs/user-guide/fr_FR/README.md) |

# Draftail user guide

Draftail is an editor built for sites and apps of all shapes and sizes. It aims for a mouse-free, keyboard-centric experience. Most formatting can be done by using common keyboard shortcuts, inspired by [Google Docs](https://support.google.com/docs/answer/179738) and [Markdown](https://en.wikipedia.org/wiki/Markdown).

One thing that sets Draftail apart from other editors is its configurability: **the available formatting options can be different from one instance of the editor to the next**, depending on how the editor is setup. One editor could only allow links. Another might have heading levels, lists, and images.

## Contents

-   [Online demo](#online-demo)
-   [Browser support](#browser-support)
-   [The editor](#the-editor)
    -   [Using keyboard shortcuts](#using-keyboard-shortcuts)
    -   [Copy-pasting content in the editor](#copy-pasting-content-in-the-editor)
-   [Links, images, and more](#links-images-and-more)
-   [Feedback](#feedback)
-   [Keyboard shortcuts](#keyboard-shortcuts)
-   [Credits](#credits)

## Online demo

| [![Screenshot of Draftail](https://springload.github.io/draftail/static/draftail-ui-screenshot.png)](https://springload.github.io/draftail/)       |
| -------------------------------------------------------------------------------------------------------------------------------------------------- |
| The Draftail website has a nice demo with most built-in features. [Go have a look and try out the editor!](https://springload.github.io/draftail/) |

## Browser support

Draftail supports all modern **desktop** browsers, in their latest version:

| Browser | OS             |
| ------- | -------------- |
| Chrome  | Windows, macOS |
| Firefox | Windows, macOS |
| MS Edge | Windows        |
| Safari  | macOS          |

If your browser is not on this list, your mileage may vary. Have a look at the [list of known issues](https://github.com/springload/draftail/issues/138), or use one of the supported browsers.

For mobile devices, Draftail is tested on the latest versions of iOS and Android. Support is limited – there are many known issues there as well, especially with custom keyboards like [Google’s GBoard keyboard](https://play.google.com/store/apps/details?id=com.google.android.inputmethod.latin) or [SwiftKey](https://swiftkey.com/).

## The editor

Draftail is a simple editor. The toolbar contains all of the formatting options and other controls. You can write underneath.

![Editor screenshot with toolbar](/docs/user-guide/editor.png)

Each control in the toolbar comes with its own tooltip, so you can see exactly what the button is for, as well as the related keyboard shortcuts. Here, the "H3" button is for **Heading level 3**.

![Editor screenshot showing the toolbar’s tooltips to view keyboard shortcuts](/docs/user-guide/toolbar-tooltip.png)

---

### Using keyboard shortcuts

> Have a look at the [full list of keyboard shortcuts](#keyboard-shortcuts).

That H3 control uses the `###` [Markdown](https://en.wikipedia.org/wiki/Markdown)-style shortcut. You can activate H3 formatting by typing `###` followed by a space at the start of a line:

![Editor screenshot showing Markdown shortcuts](/docs/user-guide/markdown-shortcuts.gif)

And of course, normal shortcuts for common controls like bold, undo/redo are available as well:

![Editor screenshot showing classic shortcuts](/docs/user-guide/classic-shortcuts.gif)

Here is another example shortcut, `-` or `*` for list items:

![Editor screenshot with shortcuts to toggle list items, and indent/de-indent or stop the list](/docs/user-guide/list-item-shortcuts.gif)

If numbered lists were available in this editor, you could use `1.`. In the editor below, we’ve enabled line breaks and horizontal rules, which also have their own buttons and shortcuts:

![Editor screenshot showing support for line breaks and horizontal rules with their corresponding shortcuts](/docs/user-guide/line-breaks-horizontal-rules.gif)

If you forget the shortcut for a given control, it’s displayed in the tooltip.

![Editor screenshot with a demo of undo/redo buttons and keyboard shortcuts](/docs/user-guide/undo-redo.gif)

Those shortcuts are extra convenient on touch screens, where it can be hard to move back and forth between text input and the toolbar. You can find the [full list of supported shortcuts](#keyboard-shortcuts) below, but bear in mind that they won’t be active unless the editor has the corresponding formatting enabled.

---

### Copy-pasting content in the editor

When pasting content into a Draftail editor, the editor will only keep the formatting that is enabled. This depends on how the editor is set up of course – here are two examples. It can remove all formatting:

![Editor screenshot with a demo of copy-pasting from Word, removing all formatting](/docs/user-guide/copy-paste-filter.gif)

It can preserve what’s enabled in the editor (bold and italic here).

![Editor screenshot with a demo of copy-pasting from Word, preserving italics and bold](/docs/user-guide/copy-paste-preserve.gif)

The editor may not preserve all formatting as-is, but it will always filter out unallowed formats. Pasting works well from Google Docs, Dropbox Paper, Word, and more.

---

## Links, images, and more

> :warning: Links and images aren’t default features of Draftail – their behavior may differ a lot depending on how the editor is configured.

It’s also possible to add links within text – and manage the links with their own tooltips:

![Editor screenshot with a demo of rich text links](/docs/user-guide/rich-text-link.gif)

Some editors may also contain images if configured. They are inserted with empty lines (that can be removed) above and below to make it easier to select the image.

![Editor screenshot with a demo of an image block](/docs/user-guide/rich-text-image.gif)

---

Voilà, that’s Draftail! We hope it’ll work well for you, and you find it useful.

## Feedback

See anything you like in here? Anything missing? We welcome all support, whether on bug reports, feature requests, code, design, reviews, tests, documentation, and more. Please have a look at our [issue tracker](https://github.com/springload/draftail/issues), and consider commenting or suggesting improvements.

---

## Keyboard shortcuts

| Function                                          | Shortcut              | Shortcut (macOS)      | Markdown |
| ------------------------------------------------- | --------------------- | --------------------- | -------- |
| **Common actions**                                |                       |                       |          |
| Copy                                              | `Ctrl + C`            | `⌘ + C`               |          |
| Cut                                               | `Ctrl + X`            | `⌘ + X`               |          |
| Paste                                             | `Ctrl + V`            | `⌘ + V`               |          |
| Paste without formatting                          | `Ctrl + ⇧ + V`        | `⌘ + ⇧ + V`           |          |
| Undo                                              | `Ctrl + Z`            | `⌘ + Z`               |          |
| Redo                                              | `Ctrl + ⇧ + Z`        | `⌘ + ⇧ + Z`           |          |
| Insert or edit link                               | `Ctrl + K`            | `⌘ + K`               |          |
| Open link                                         | `Alt + ↵`             | `⌥ + ↵`               |          |
| Insert horizontal rule                            |                       |                       | `---`    |
| **Text formatting (if enabled)**                  |                       |                       |          |
| Bold                                              | `Ctrl + B`            | `⌘ + B`               |          |
| Italic                                            | `Ctrl + I`            | `⌘ + I`               |          |
| Underline                                         | `Ctrl + U`            | `⌘ + U`               |          |
| Monospace (code)                                  | `Ctrl + J`            | `⌘ + J`               |          |
| Strikethrough                                     | `Ctrl + ⇧ + X`        | `⌘ + ⇧ + X`           |          |
| Superscript                                       | `Ctrl + .`            | `⌘ + .`               |          |
| Subscript                                         | `Ctrl + ,`            | `⌘ + ,`               |          |
| **Paragraph formatting (if enabled)**             |                       |                       |          |
| Increase list indentation                         | `↹`                   | `↹`                   |          |
| Decrease list indentation                         | `⇧ + ↹`               | `⇧ + ↹`               |          |
| Apply normal text style                           | `Ctrl + Alt + 0`      | `⌘ + ⌥ + 0`           | `⌫`      |
| Apply heading style [1-6]                         | `Ctrl + Alt + [1-6]`  | `⌘ + ⌥ + [1-6]`       | `##`     |
| Numbered list                                     | `Ctrl + ⇧ + 7`        | `⌘ + ⇧ + 7`           | `1.`     |
| Bulleted list                                     | `Ctrl + ⇧ + 8`        | `⌘ + ⇧ + 8`           | `-`      |
| Blockquote                                        |                       |                       | `>`      |
| Code block                                        |                       |                       | ` ``` `  |
| Go to new line                                    | `↵`                   | `↵`                   |          |
| Insert soft new line                              | `⇧ + ↵`               | `⇧ + ↵`               |          |
| Insert soft new line                              | `Ctrl + ↵`            | `⌘ + ↵`               |          |
| **Text selection with keyboard**                  |                       |                       |          |
| Select all                                        | `Ctrl + A`            | `⌘ + A`               |          |
| Extend selection one character                    | `⇧ + ← or →`          | `⇧ + ← or →`          |          |
| Extend selection one line                         | `⇧ + ↑ or ↓`          | `⇧ + ↑ or ↓`          |          |
| Extend selection one word                         | `Alt + ⇧ + ← or →`    | `⌥ + ⇧ + ← or →`      |          |
| Extend selection to the beginning of the line     | `Ctrl + ⇧ + ←`        | `⌘ + ⇧ + ←`           |          |
| Extend selection to the end of the line           | `Ctrl + ⇧ + →`        | `⌘ + ⇧ + →`           |          |
| Extend selection to the beginning of the document | `⇧ + ⇱`               | `⇧ + ⇱`               |          |
| Extend selection to the end of the document       | `⇧ + ⇲`               | `⇧ + ⇲`               |          |
| **Text selection with mouse**                     |                       |                       |          |
| Select word                                       | `Double-click`        | `Double-click`        |          |
| Extend selection one word at a time               | `Double-click + Drag` | `Double-click + Drag` |          |
| Select paragraph                                  | `Triple-click`        | `Triple-click`        |          |
| Extend selection one paragraph at a time          | `Triple-click + Drag` | `Triple-click + Drag` |          |

## Credits

Screenshots taken with [LICECap](https://www.cockos.com/licecap/) and [Keycastr](https://github.com/keycastr/keycastr). Images optimised with [ImageAlpha](https://pngmini.com/) and [ImageOptim](https://imageoptim.com/).
