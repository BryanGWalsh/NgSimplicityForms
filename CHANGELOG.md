# Changelog

All notable changes to this project will be documented in this file.

## [1.1.2] - 2026-11-01

### Added
- New `@ng-simplicity/forms-tailwind` styling package with Tailwind CSS `input-text`, `input-textarea`, `checkbox`, `radio` and `select` components, `NgsFormsTailwindModule.registerAllTailwindComponents()`, and `provideNgsFormsTailwindClasses()` for overriding the default classes.
- Docs: Tailwind installation steps, a Tailwind quick start and a Tailwind component reference with live demos.

### Changed
- All packages declare `uuid` as a dependency, so it no longer has to be installed by hand.
- `NgsFormsCoreModule.registerCoreNgsFormComponents()` (and so every `registerAll…` helper) now registers `content-html`.
- The Bootstrap, Material and Tailwind packages require `@ng-simplicity/forms-core ^1.1.2`.
- Docs site: dark theme and full page width.

## [1.0.0] - 2026-06-19

### Added
- First official release of `@ng-simplicity/forms-core` core engine.
- First official release of `@ng-simplicity/forms-bootstrap` styling package (includes `input-text`, `input-textarea`, `checkbox`, `radio`, `select`, `error`).
- First official release of `@ng-simplicity/forms-material` styling package (includes `input-text`, `input-textarea`).
- Comprehensive unit test suites achieving 100% line coverage for all services, controllers, base classes, and components.
- Added support for Signals-based form value updates and OnPush/Zoneless change detection.
