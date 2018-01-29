# Draftail user guide

Draftail is a rich text editor built for websites of all shapes and sizes. It aims for a mouse-free, keyboard-centric experience. Most formatting can be done by using common keyboard shortcuts, inspired by [Google Docs](https://support.google.com/docs/answer/179738) and [Markdown](https://en.wikipedia.org/wiki/Markdown).

## Online demo

[![Screenshot of Draftail](https://springload.github.io/draftail/static/draftail-ui-screenshot.png)](https://springload.github.io/draftail/)

The Draftail website has a [nice demo](https://springload.github.io/draftail/) with many features. Go have a look and try things out over there!

## Browser and device support

Draftail supports all modern **desktop** browsers. There are [known issues](https://github.com/springload/draftail/issues/138) in Internet Explorer - your mileage may vary.

**Supported browsers:**

| Browser | OS             | Version |
| ------- | -------------- | ------- |
| Chrome  | Windows, macOS | latest  |
| Firefox | Windows, macOS | latest  |
| MS Edge | Windows        | latest  |
| Safari  | macOS          | latest  |

For mobile devices, Draftail is tested on the latest versions of iOS and Android. Support is limited - there are many known issues there as well, especially with custom keyboards like [Google's GBoard keyboard](https://play.google.com/store/apps/details?id=com.google.android.inputmethod.latin&hl=en) or [SwiftKey](https://swiftkey.com/).

## The editor

Draftail is a simple editor. The toolbar contains all of the formatting options and other controls. You can type underneath.

![Editor screenshot with toolbar](/docs/user-guide/editor.png)

### Toolbar controls and keyboard shortcuts

Each control in the toolbar comes with its own tooltip, so you can see exactly what the button is for, as well as the related keyboard shortcuts. Here, the "H3" button is for _Heading level 3_.

![Editor screenshot showing the toolbar’s tooltips to view keyboard shortcuts](/docs/user-guide/toolbar-tooltip.png)

That H3 control, heading level 3, uses the `###` [Markdown](https://en.wikipedia.org/wiki/Markdown)-style shortcut. You can activate H3 formatting by typing `###` followed by a space at the start of a line:

![Editor screenshot showing basic keyboard shortcuts for styles and blocks](/docs/user-guide/keyboard-shortcuts.gif)

And of course, normal shortcuts for common controls like bold, undo/redo are available as well. Here is another example shortcut, `-` or `*` for list items:

![Editor screenshot with shortcuts to toggle list items, and indent/de-indent or stop the list](/docs/user-guide/list-item-shortcuts.gif)

If numbered lists were available in this editor, you could also use `1.`. In the editor below, we've also enabled line breaks and horizontal rules, which also have their own buttons and shortcuts:

![Editor screenshot showing support for line breaks and horizontal rules with their corresponding shortcuts](/docs/user-guide/line-breaks-horizontal-rules.gif)

If you forget the shortcut for a given control, it’ll be in the tooltip unless there is no defined shortcut.

![Editor screenshot with a demo of undo/redo buttons and keyboard shortcuts](/docs/user-guide/undo-redo.gif)

Those shortcuts are extra convenient on mobile devices, where it can be annoying to move back and forth between the keyboard and the buttons. You can find the [full list of supported shortcuts](#keyboard-shortcuts) below, but bear in mind that they won’t be active unless the editor has the corresponding formatting enabled.

## Credits

Screenshots taken with [LICECap](https://www.cockos.com/licecap/) and [Keycastr](https://github.com/keycastr/keycastr). Images optimised with [ImageAlpha](https://pngmini.com/) and [ImageOptim](https://imageoptim.com/).
