# Changelog

> All notable changes to this project are documented in this file. This project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

* Add new `DraftUtils.getEntitySelection(editorState, entityKey)` method, returning the selection corresponding to a given entity. Note: only works if the entity is in the currently selected block.
* Add shortcuts for blockquote and code block to toolbar tooltips.

### Changed

* Exclude toolbar buttons from default focus navigation flow.

### Removed

* Remove Save and Cancel buttons from image block, thanks to [@allcaps](https://github.com/allcaps) ([#102](https://github.com/springload/draftail/pull/102))
* Remove `DraftUtils.getSelectedEntitySelection(editorState)`. It can be replaced by `DraftUtils.getEntitySelection(editorState, DraftUtils.getSelectionEntity(editorState))`.

### Fixed

* Update handleNewLine to defer breakout in code-block. Fix [#104](https://github.com/springload/draftail/issues/104).
* Fix toolbar entity edit and remove not working on selection pre first char. Fix [#109](https://github.com/springload/draftail/issues/109).
* Fix wrong `PropTypes` definition for entity `imageFormat`.
* Fix block type transformations moving selection to the wrong block.

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
