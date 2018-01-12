# Changelog

> All notable changes to this project are documented in this file. This project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

* Add new Sass constants to make the editor more themable: `$draftail-editor-padding, $draftail-editor-text, $draftail-editor-font-family, $draftail-editor-font-size, $draftail-editor-line-height, $draftail-toolbar-radius, $draftail-editor-border, $draftail-toolbar-tooltip-radius, $draftail-toolbar-tooltip-duration, $draftail-toolbar-tooltip-delay`.
* Delay toolbar tooltip opening on hover by 0.5s, animated over 0.1s.

### Changed

* Switch to rollup for package compilation.
* Move `DraftailEditor` from default export of draftail to named export (`import { DraftailEditor } from 'draftail';`).
* Wrap `propTypes` in env check so they only appear in dev build.
* Rename / namespace all overridable Sass constants.
* Stop defining `$draftail-tooltip-radius` based on `$draftail-editor-radius`.
* Simplify `DraftUtils.getSelectedBlock()` implementation.

### Fixed

* Prevent toolbar button labels from being selected.
* Fix newline block insertion & reset creating 2 entries in undo stack ([#105](https://github.com/springload/draftail/issues/105)).

### Removed

* Remove all unused variables from Sass constants.
* Remove `immutable` from `peerDependencies`.
* Remove `draftjs-utils` from `dependencies`.
* Remove `DraftUtils.createEntity()`.
* Remove `DraftUtils.getAllBlocks()`.
* Remove `DraftUtils.getEntityRange()`.

## [[v0.10.0]](https://github.com/springload/draftail/releases/tag/v0.10.0)

### Added

* Add new `DraftUtils.getEntitySelection(editorState, entityKey)` method, returning the selection corresponding to a given entity. Note: only works if the entity is in the currently selected block.
* Add `DraftUtils.updateBlockEntity` method, with workaround for Draft.s 0.10 entity data update bug.
* Add shortcuts for blockquote and code block to toolbar tooltips.
* Use alternative keyboard shortcuts for more formats.
* Add default labels & descriptions for built-in formats ([#122](https://github.com/springload/draftail/issues/122)).
* Process, whitelist, blacklist, migrate available blocks, styles and entities when pasting rich text ([#50](https://github.com/springload/draftail/pull/50) & [#103](https://github.com/springload/draftail/pull/103) thanks to [@inostia](https://github.com/inostia), see [#123](https://github.com/springload/draftail/issues/123) for next steps).
* Add support for custom text decorators ([#121](https://github.com/springload/draftail/issues/121)).
* Add predefined classes for block depth levels above 4, of the format `public-DraftStyleDefault-depth${depth}`.
* Add `nested-list-item($depth)` Sass mixin to generate styles for arbitrary list item nesting.
* Introduce new `Draftail-` class namespace for all styles ([#63](https://github.com/springload/draftail/issues/63)).
* Expose Sass stylesheets to Draftail users, for extension.

### Changed

* Exclude toolbar buttons from default focus navigation flow.
* Disable ligatures in the editor, to simplify cursor behaviour.
* Stop bundling the Draft.js styles. They now have to be manually included. The previous approach was prone to version mismatches.
* Configure text antialiasing for Firefox.
* Change `Icon` implementation to use SVG by default. Supports symbol references, SVG path(s), and arbitrary React components ([#119](https://github.com/springload/draftail/issues/119)).
* Disable pointer events on all icons by default.
* Remove toolbar hover styles.
* Make more of the editor styling overridable.
* Move `Tooltip` outside of Draftail package.
* Refactor tooltip for inline entities to be defined directly in decorators. They should now define their own tooltip (or other control), rather than rely on `data-tooltip`.
* Move `Portal` component outside of Draftail.
* Add `block` prop to entityTypes, and move `IMAGE` and `EMBED` blocks outside of Draftail ([#121](https://github.com/springload/draftail/issues/121)).
* Provide methods for `entityTypes`' `block` to edit, remove entity.

### Removed

* Remove Save and Cancel buttons from image block, thanks to [@allcaps](https://github.com/allcaps) ([#102](https://github.com/springload/draftail/pull/102))
* Remove `DraftUtils.getSelectedEntitySelection`. It can be replaced by `DraftUtils.getEntitySelection(editorState, DraftUtils.getSelectionEntity(editorState))`.
* Remove built-in support for `MODEL` entities.
* Remove built-in support for `EMBED` entities.
* Remove built-in support for `DOCUMENT` entities.
* Remove support for `entityTypes`' `imageFormats`.
* Remove support for custom `entityTypes` `strategy`.

### Fixed

* Update handleNewLine to defer breakout in code-block. Fix [#104](https://github.com/springload/draftail/issues/104).
* Fix toolbar entity edit and remove not working on selection pre first char. Fix [#109](https://github.com/springload/draftail/issues/109).
* Fix block type transformations moving selection to the wrong block.
* Fix editor scrolling in the wrong position when breaking a big block (https://github.com/facebook/draft-js/issues/304#issuecomment-327606596).

## [[v0.9.0]](https://github.com/springload/draftail/releases/tag/v0.9.0)

### Added

* Add support for [custom inline styles](https://github.com/springload/draftail#custom-inline-styles), thanks to [@vincentaudebert](https://github.com/vincentaudebert) ([#97](https://github.com/springload/draftail/pull/97)).
* Add [basic styles](https://github.com/springload/draftail/blob/60f2f6ef5684c10c7c409a6333f2b157b955fa45/lib/api/constants.js#L51) for common inline styles.
* Add new `description` prop for all formats to describe the format's use with more text than the `label`.
* Add tooltips for toolbar buttons to display the full control `description` as well as its keyboard shortcut.
* Add separate button groups in the toolbar.
* Add basic undo/redo controls in the toolbar ([#100](https://github.com/springload/draftail/pull/100)), displaying the related keyboard shortcuts.
* Introduce icons for hr: `―` and br: `↵`.
* Add keyboard shortcuts for superscript & subscript.
* Add more Markdown-like markers for heading levels (`##`), code block (triple backtick), blockquote (`>`), hr (`---`) ([#53](https://github.com/springload/draftail/issues/53)).
* Add `spellCheck` prop, passed to Draft.js `Editor`. Sets whether spellcheck is turned on for your editor.
* Add support for React 16.

### Changed

* Update keyboard shortcuts format to follow that of Google Docs.
* Refine toolbar styles. Fix toolbar to the top of the page when sticky.
* Make the editor look closer to a textarea ([#96](https://github.com/springload/draftail/issue/96)).
* Update strikethrough shortcut from Google Docs.
* Update Draft.js dependency to 0.10.4, and `draftjs-utils` to 0.8.8.
* Stop preserving Markdown-like block marker when undoing block type change.
* Stop restricting block type changes based on Markdown-style markers to unstyled blocks only.

### Fixed

* Fix tooltip position when scrolling ([#99](https://github.com/springload/draftail/pull/99)).
* Fix beforeInput text replacement happening on non-collapsed selections.
* Prevent text inserted after entities from continuing the entity. Fix [#86](https://github.com/springload/draftail/issue/86) ([#106](https://github.com/springload/draftail/pull/106)).

### How to upgrade

This release does not have many breaking changes, but the editor's toolbar styles have changed a lot and this may cause breakage.

First, update Draftail and its Draft.js peer dependency: `npm install --save draft-js@^0.10.4 draftail@0.9.0`.

Then, you will want to update controls to leverage the new `description` prop. It will be displayed in the new toolbar tooltips. Here is a brief example:

```diff
blockTypes={[
    {
        type: BLOCK_TYPE.HEADER_THREE,
        label: 'H3',
        // Use a description to further convey what the control does.
+        description: 'Heading 3',
    },
    {
        type: BLOCK_TYPE.UNORDERED_LIST_ITEM,
        // The icon is enough – but use the new prop to help screen reader users.
-        label: 'UL',
+        description: 'Bulleted list',
        icon: 'icon-list-ul',
    },
]}
```

## [[v0.8.0]](https://github.com/springload/draftail/releases/tag/v0.8.0)

### Added

* Add `name` attribute to button elements to simplify targeting in browser automation tests.
* Publish the package as an ES2015 module.

### Changed

* Upgrade draftjs-utils to latest (draftjs-utils).
* Use references to window object instead of global.
* Update dependencies to remove Immutable.js duplication

## [[v0.7.3]](https://github.com/springload/draftail/releases/tag/v0.7.3)

### Added

* Expose reusable Portal component as part of the API.

## [[v0.7.2]](https://github.com/springload/draftail/releases/tag/v0.7.2)

### Changed

* Only stick toolbar when editor is active.
* Make editor slightly bigger.

### Fixed

* Fix `editor` class name concatenation.

## [[v0.7.1]](https://github.com/springload/draftail/releases/tag/v0.7.1)

### Fixed

* Fix CSS import present in published library.

## [[v0.7.0]](https://github.com/springload/draftail/releases/tag/v0.7.0)

### Added

* Make the editor toolbar sticky (requires a polyfill, documented in README).
* Add support for `placeholder` attribute.

### Changed

* Improve "active block" rendering and disabled state.

### Fixed

* Fix missing vertical spacing between button rows.
* Fix missing pointer cursor on tooltip button.

### Removed

* Remove `Element.closest` polyfill from main lib.

## [[v0.6.0]](https://github.com/springload/draftail/releases/tag/v0.6.0)

### Added

* Add default `strategy` for entity types based on `type`.

### Changed

* Change empty `RawDraftContentState` in conversion API to be null.
* Change entity type nomenclature to use `source` and `decorator` in place of `control` and `component`.

## [[v0.5.0]](https://github.com/springload/draftail/releases/tag/v0.5.0)

### Added

* Implement list depth normalisation on copy/paste.
* Add title attributes on buttons to display keyboard shortcuts. Fix #37.
* Override default code-block element. Fix #41.

### Changed

* Update project to use draft-js@0.10 API
* Move draftjs-utils `peerDependency` to be a dependency.
* Move immutable `peerDependency` to be a dependency.
* Copy/paste of rich text is now configurable via the `stripPastedStyles` option.
* Copy/paste of rich text is now disabled by default. This will be enabled by default once it is better supported.

## [[v0.4.1]](https://github.com/springload/draftail/releases/tag/v0.4.1)

### Fixed

* Fix image block not unlocking editor on cancel.

## [[v0.4.0]](https://github.com/springload/draftail/releases/tag/v0.4.0)

### Added

* Make `hr` availability configurable with `enableHorizontalRule`. #25.
* Add `br` support, availability configurable with `enableLineBreak`.
* Prevent soft line breaks from keyboard shortcut if disabled.
* Add editor CSS to published package. #17
* Add common keyboard shortcuts (inspired by Google Docs, see documentation for the full list).
* Add support for "autolist" behavior (lines starting with `-`, `*`, `1.` are automatically converted to list items).

### Changed

* Max nested list level is now 1.
* Max nested list level is now configurable via a prop.
* Save interval is now configurable via a prop.
* Change `hr` representation to use atomic block and entity instead of custom block type. #1
* `mediaControls`, `dialogControls` and `modelPickerOptions` are now a single `entityTypes` array. #26
* `sources` and `decorators` are now declared directly in the `entityTypes` array items.
* `INLINE_STYLES` property is now `inlineStyles`.
* `BLOCK_TYPES` property is now `blockTypes`.
* Inline styles and block types now use the `type` attribute instead of `style`.
* `imageFormats` are now assigned directly on the `IMAGE` entity type. #33
* All options are now direct props of `DraftailEditor` instead of attributes of the `options` prop. #21

### Fixed

* Fix erratic behavior of list nesting changes with tab and shift+tab shortcuts. #34
* Fix keyboard shortcuts giving access to unallowed formatting. #32
* Fix tooltip not opening when clicking decorator icon. #5

### Removed

* draftail no longer depends on jQuery.
* draftail no longer depends on the Wagtail font icon.

## [[v0.3.3]](https://github.com/springload/draftail/releases/tag/v0.3.3)

### Added

* Allow customisation of block style function & block render map.

## [[v0.3.2]](https://github.com/springload/draftail/releases/tag/v0.3.2)

### Added

* Pressing return on an empty list item should un-indent it until it is not nested, and then remove it.
* Pressing return at the end of a block should create an empty unstyled block.

## [[v0.3.1]](https://github.com/springload/draftail/releases/tag/v0.3.1)

### Fixed

* Buttons do not trigger a form submit

## [[v0.3.0]](https://github.com/springload/draftail/releases/tag/v0.3.0)

> This release contains **breaking changes**.

### Added

* Keyboard shortcuts documentation

### Changed

* Expose onSave hook instead of auto field saving (https://github.com/springload/draftail/issues/23)

### Fixed

* https://github.com/springload/draftail/issues/2
* https://github.com/springload/draftail/issues/3
* https://github.com/springload/draftail/issues/28

## [[v0.2.0]](https://github.com/springload/draftail/releases/tag/v0.2.0)

### Changed

* Reworking most of the editor codebase to make it more maintainable.
* Configurable block types and inline styles.

## [[v0.1.0]](https://github.com/springload/draftail/releases/tag/v0.1.0)

First usable release!

---

Template from http://keepachangelog.com/

## [[vx.y.z]](https://github.com/springload/draftail/releases/tag/vx.y.z)

### Added

* Something was added to the API / a new feature was introduced.

### Changed

### Fixed

### Removed
