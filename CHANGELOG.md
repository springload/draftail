Changelog
=========

> All notable changes to this project are documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [[v0.4.0]](https://github.com/springload/draftail/releases/tag/v0.4.0) - 2016-12-22

### Added

- Make `hr` availability configurable with `enableHorizontalRule`. #25.
- Add `br` support, availability configurable with `enableLineBreak`.
- Prevent soft line breaks from keyboard shortcut if disabled.
- Add editor CSS to published package. #17
- Add common keyboard shortcuts (inspired by Google Docs, see documentation for the full list).
- Add support for "autolist" behavior (lines starting with `- `, `* `, `1. ` are automatically converted to list items).

### Changed

- Max nested list level is now 1.
- Max nested list level is now configurable via a prop.
- Save interval is now configurable via a prop.
- Change `hr` representation to use atomic block and entity instead of custom block type. #1
- `mediaControls`, `dialogControls` and `modelPickerOptions` are now a single `entityTypes` array. #26
- `sources` and `decorators` are now declared directly in the `entityTypes` array items.
- `INLINE_STYLES` property is now `inlineStyles`.
- `BLOCK_TYPES` property is now `blockTypes`.
- Inline styles and block types now use the `type` attribute instead of `style`.
- `imageFormats` are now assigned directly on the `IMAGE` entity type. #33
- All options are now direct props of `DraftailEditor` instead of attributes of the `options` prop. #21

### Fixed

- Fix erratic behavior of list nesting changes with tab and shift+tab shortcuts. #34
- Fix keyboard shortcuts giving access to unallowed formatting. #32

### Removed

- draftail no longer depends on jQuery.
- draftail no longer depends on the Wagtail font icon.

## [[v0.3.3]](https://github.com/springload/draftail/releases/tag/v0.3.3) - 2016-12-13

### Added

- Allow customisation of block style function & block render map.

## [[v0.3.2]](https://github.com/springload/draftail/releases/tag/v0.3.2) - 2016-11-29

### Added

- Pressing return on an empty list item should un-indent it until it is not nested, and then remove it.
- Pressing return at the end of a block should create an empty unstyled block.

## [[v0.3.1]](https://github.com/springload/draftail/releases/tag/v0.3.1) - 2016-11-28

### Fixed

- Buttons do not trigger a form submit

## [[v0.3.0]](https://github.com/springload/draftail/releases/tag/v0.3.0) - 2016-11-28

> This release contains __breaking changes__.

### Added

- Keyboard shortcuts documentation

### Changed

- Expose onSave hook instead of auto field saving (https://github.com/springload/draftail/issues/23)

### Fixed

- https://github.com/springload/draftail/issues/2
- https://github.com/springload/draftail/issues/3
- https://github.com/springload/draftail/issues/28

## [[v0.2.0]](https://github.com/springload/draftail/releases/tag/v0.2.0) - 2016-11-14

### Changed

- Reworking most of the editor codebase to make it more maintainable.
- Configurable block types and inline styles.

## [[v0.1.0]](https://github.com/springload/draftail/releases/tag/v0.1.0) - 2016-11-11

First usable release!

-------------

## [[x.y.z]](https://github.com/springload/draftail/releases/tag/x.y.z) - YYYY-MM-DD (Template: http://keepachangelog.com/)

### Added

- Something was added to the API / a new feature was introduced.

### Changed

### Fixed

### Removed
